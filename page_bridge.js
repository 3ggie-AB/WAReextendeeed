/**
 * WhatsappReextended - WhatsApp Web Sticker Manager
 * Page Bridge Script (Runs in MAIN world to interact with window.WPP)
 */

(function () {
  'use strict';

  if (window.__reextended_bridge_injected) return;
  window.__reextended_bridge_injected = true;

  console.log('[WhatsappReextended Bridge] Initializing in WhatsApp Web context...');

  let isReady = false;

  function checkWppReady() {
    if (window.WPP) {
      if (window.WPP.isReady || (window.WPP.webpack && window.WPP.webpack.isReady)) {
        isReady = true;
        console.log('[WhatsappReextended Bridge] WhatsApp Web & WPP are ready for native stickers!');
        window.postMessage({ type: 'DRUPPY_WPP_READY' }, '*');
        return;
      }
      if (window.WPP.webpack && typeof window.WPP.webpack.onReady === 'function') {
        window.WPP.webpack.onReady(() => {
          isReady = true;
          console.log('[WhatsappReextended Bridge] WhatsApp Web & WPP are ready for native stickers!');
          window.postMessage({ type: 'DRUPPY_WPP_READY' }, '*');
        });
      }
    }
    if (!isReady) {
      setTimeout(checkWppReady, 400);
    }
  }

  checkWppReady();

  // Helper to convert dataURL string to File object to avoid regex issues in wppconnect
  function dataURLtoFile(dataurl, filename) {
    try {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = (mimeMatch && mimeMatch[1]) || 'image/webp';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.warn('[WhatsappReextended Bridge] dataURLtoFile conversion fallback:', e);
      return dataurl;
    }
  }

  // Helper to extract actively quoted/reply message in WhatsApp Web
  function getActiveQuotedMsg(activeChat) {
    try {
      // 1. Direct model properties on activeChat
      if (activeChat) {
        if (activeChat.composeQuotedMsg) return activeChat.composeQuotedMsg;
        if (activeChat.quotedMsg) return activeChat.quotedMsg;
        if (typeof activeChat.getComposeContents === 'function') {
          const contents = activeChat.getComposeContents();
          if (contents && contents.quotedMsg) return contents.quotedMsg;
        }
        if (activeChat.composeContents && activeChat.composeContents.quotedMsg) {
          return activeChat.composeContents.quotedMsg;
        }
      }

      // 2. DOM inspection for active reply/quote bar in footer
      const footer = document.querySelector('#main footer');
      if (!footer) return null;

      // When replying, WhatsApp Web renders a close/cancel button for quoted message (x or close icon)
      const closeBtn = footer.querySelector('span[data-icon="x"], span[data-icon="close"], span[data-icon="cancel"]')
        ?.closest('button, [role="button"]');

      if (!closeBtn) return null;

      // Find the reply container (the bar holding the quote preview)
      let el = closeBtn;
      while (el && el !== footer) {
        // Inspect React Fiber
        const reactKey = Object.keys(el).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
        if (reactKey) {
          let fiber = el[reactKey];
          let depth = 0;
          while (fiber && depth < 25) {
            const props = fiber.memoizedProps;
            if (props) {
              if (props.quotedMsg) return props.quotedMsg;
              if (props.msg) return props.msg;
              if (props.message) return props.message;
              if (props.quotedMessage) return props.quotedMessage;
              if (props.quotedMsgId) return props.quotedMsgId;
            }
            fiber = fiber.return;
            depth++;
          }
        }
        el = el.parentElement;
      }
    } catch (e) {
      console.warn('[WhatsappReextended Bridge] getActiveQuotedMsg error:', e);
    }
    return null;
  }

  // Listen for sticker send requests from content.js
  window.addEventListener('message', async (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'DRUPPY_CHECK_READY') {
      window.postMessage({
        type: 'DRUPPY_READY_STATUS',
        isReady: !!(window.WPP && (window.WPP.isReady || (window.WPP.webpack && window.WPP.webpack.isReady)))
      }, '*');
      return;
    }

    if (event.data.type === 'DRUPPY_SEND_STICKER_NATIVE') {
      const { dataUrl, fileName } = event.data;

      try {
        if (!window.WPP) {
          throw new Error('Modul WhatsApp belum terinisialisasi. Mohon refresh halaman WhatsApp.');
        }

        // Wait up to 3s if WPP is still loading webpack
        if (!window.WPP.isReady && window.WPP.webpack && !window.WPP.webpack.isReady) {
          console.log('[WhatsappReextended Bridge] Menunggu kesiapan modul WPP...');
          let retries = 10;
          while (retries > 0 && !window.WPP.isReady && !(window.WPP.webpack && window.WPP.webpack.isReady)) {
            await new Promise((res) => setTimeout(res, 300));
            retries--;
          }
        }

        if (!window.WPP.chat) {
          throw new Error('Modul Chat WhatsApp belum siap. Mohon tunggu beberapa saat.');
        }

        // Get current active chat with multi-tier fallback
        let activeChat = null;
        if (typeof window.WPP.chat.getActiveChat === 'function') {
          try {
            activeChat = window.WPP.chat.getActiveChat();
          } catch (e) {
            console.warn('[WhatsappReextended Bridge] getActiveChat error:', e);
          }
        }

        if (!activeChat && window.WPP.whatsapp && window.WPP.whatsapp.ChatStore) {
          try {
            activeChat = window.WPP.whatsapp.ChatStore.findFirst((c) => c.active || c.__x_active);
          } catch (e) {}
        }

        if (!activeChat) {
          throw new Error('Chat WhatsApp tujuan belum terbuka. Silakan klik salah satu obrolan terlebih dahulu!');
        }

        const targetChatId = activeChat.id ? (activeChat.id._serialized || activeChat.id) : activeChat;
        console.log('[WhatsappReextended Bridge] Mengirim stiker asli ke chat:', targetChatId.toString());

        // Convert base64 dataUrl into native File object
        const finalFileName = (fileName || 'sticker') + '.webp';
        const fileObj = dataURLtoFile(dataUrl, finalFileName);

        // Check if user is currently replying/quoting a message in this chat
        const quotedMsg = getActiveQuotedMsg(activeChat);

        const sendOptions = {
          type: 'sticker',
          mimetype: 'image/webp',
          filename: finalFileName
        };

        if (quotedMsg) {
          sendOptions.quotedMsg = quotedMsg;
          console.log('[WhatsappReextended Bridge] Mengirim stiker sambil me-reply pesan:', quotedMsg);
        }

        // Send as native WhatsApp Sticker
        const result = await window.WPP.chat.sendFileMessage(targetChatId, fileObj, sendOptions);

        // If this was a reply, dismiss the active reply bar in the UI
        if (quotedMsg) {
          try {
            const cancelBtn = document.querySelector('#main footer span[data-icon="x"], #main footer span[data-icon="close"], #main footer span[data-icon="cancel"]')
              ?.closest('button, [role="button"]');
            if (cancelBtn) {
              cancelBtn.click();
            }
            if (activeChat && activeChat.composeQuotedMsg) {
              activeChat.composeQuotedMsg = null;
            }
          } catch (e) {}
        }

        console.log('[WhatsappReextended Bridge] Stiker sukses terkirim!', result);

        window.postMessage({
          type: 'DRUPPY_NATIVE_SEND_RESULT',
          success: true,
          message: quotedMsg ? 'Stiker balasan berhasil dikirim!' : 'Stiker berhasil dikirim!'
        }, '*');

      } catch (err) {
        console.error('[WhatsappReextended Bridge] Gagal mengirim stiker:', err);
        const errMsg = (err && (err.message || err.name)) || (typeof err === 'string' ? err : 'Gagal mengirim stiker ke obrolan.');
        window.postMessage({
          type: 'DRUPPY_NATIVE_SEND_RESULT',
          success: false,
          error: errMsg
        }, '*');
      }
    }
  });

})();
