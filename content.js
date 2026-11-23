/**
 * WhatsappReextended - WhatsApp Web Sticker Manager & Studio
 * Content Script (Runs in isolated world with storage access, injects UI into WhatsApp Web)
 */

(function () {
  'use strict';

  if (window.__druppy_content_injected) return;
  window.__druppy_content_injected = true;

  console.log('[WhatsappReextended] Initializing WhatsApp Web Extension...');

  // --- LOGO CONFIGURATION ---
  const LOGO_URL = (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL('icons/icon48.png') : 'icons/icon48.png');
  const LOGO_HTML = `<img src="${LOGO_URL}" class="druppy-logo-img" alt="WhatsappReextended" />`;

  // --- CUSTOM SVG ICONS (Replaces all emojis) ---
  const ICONS = {
    sticker: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8l7-7V6a3 3 0 0 0-3-3z" fill="rgba(249, 115, 22, 0.15)" stroke="#f97316"/><path d="M14 21v-5a2 2 0 0 1 2-2h5" stroke="#f97316"/><circle cx="9" cy="10" r="1.2" fill="#f97316" stroke="none"/><circle cx="14" cy="10" r="1.2" fill="#f97316" stroke="none"/><path d="M9.5 14c.8.6 1.7.6 2.5 0" stroke="#f97316" stroke-width="1.6"/></svg>`,
    send: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    crop: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    dashboard: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    sidebar: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
    popup: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="8" y="10" width="8" height="7"/></svg>`,
    fullscreen: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`,
    windowed: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    rotate: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    package: `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    reset: `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`
  };

  // --- BUILT-IN PACK CONFIGURATION ---
  const BUILTIN_PACK_ID = 'builtin-red-panda';
  const BUILTIN_PACK = {
    id: BUILTIN_PACK_ID,
    name: 'Red Panda (Bawaan)',
    builtin: true,
    stickers: [
      { id: 'rp-1', name: 'Oka', file: 'stickers/red_panda_oka_transparent.webp', thumb: 'stickers/thumbs/red_panda_oka_transparent.webp' },
      { id: 'rp-2', name: 'Cinema', file: 'stickers/red_panda_cinema_transparent.webp', thumb: 'stickers/thumbs/red_panda_cinema_transparent.webp' },
      { id: 'rp-5', name: 'Menyala Original', file: 'stickers/red_panda_menyala_original_transparent.webp', thumb: 'stickers/thumbs/red_panda_menyala_original_transparent.webp' },
      { id: 'rp-6', name: 'Gasspoll', file: 'stickers/red_panda_gasspoll_transparent.webp', thumb: 'stickers/thumbs/red_panda_gasspoll_transparent.webp' },
      { id: 'rp-7', name: 'OTW Koding Claude', file: 'stickers/red_panda_otw_koding_claude.webp', thumb: 'stickers/thumbs/red_panda_otw_koding_claude.webp' },
      { id: 'rp-8', name: 'OTW Koding Gemini', file: 'stickers/red_panda_otw_koding_gemini.webp', thumb: 'stickers/thumbs/red_panda_otw_koding_gemini.webp' },
      { id: 'rp-9', name: 'Wait Dicek Dulu', file: 'stickers/red_panda_wait_dicek_dulu.webp', thumb: 'stickers/thumbs/red_panda_wait_dicek_dulu.webp' },
      { id: 'rp-10', name: 'Siap', file: 'stickers/red_panda_siap.webp', thumb: 'stickers/thumbs/red_panda_siap.webp' },
      { id: 'rp-11', name: 'Sorry', file: 'stickers/red_panda_sorry_transparent.webp', thumb: 'stickers/thumbs/red_panda_sorry_transparent.webp' },
      { id: 'rp-12', name: 'GG', file: 'stickers/red_panda_gg_transparent.webp', thumb: 'stickers/thumbs/red_panda_gg_transparent.webp' },
      { id: 'rp-13', name: 'Done', file: 'stickers/red_panda_done_transparent.webp', thumb: 'stickers/thumbs/red_panda_done_transparent.webp' },
      { id: 'rp-14', name: 'Mantap', file: 'stickers/red_panda_mantap_transparent.webp', thumb: 'stickers/thumbs/red_panda_mantap_transparent.webp' },
      { id: 'rp-15', name: 'Valid', file: 'stickers/red_panda_valid_transparent.webp', thumb: 'stickers/thumbs/red_panda_valid_transparent.webp' },
      { id: 'rp-16', name: 'Fakta', file: 'stickers/red_panda_fakta_transparent.webp', thumb: 'stickers/thumbs/red_panda_fakta_transparent.webp' },
      { id: 'rp-17', name: 'Ayo Bisa', file: 'stickers/red_panda_ayo_bisa_transparent.webp', thumb: 'stickers/thumbs/red_panda_ayo_bisa_transparent.webp' },
      { id: 'rp-18', name: 'No Comment', file: 'stickers/red_panda_no_comment_transparent.webp', thumb: 'stickers/thumbs/red_panda_no_comment_transparent.webp' },
      { id: 'rp-19', name: 'Bingung', file: 'stickers/red_panda_bingung_transparent.webp', thumb: 'stickers/thumbs/red_panda_bingung_transparent.webp' },
      { id: 'rp-20', name: 'Wkwkwk', file: 'stickers/red_panda_wkwkwk_transparent.webp', thumb: 'stickers/thumbs/red_panda_wkwkwk_transparent.webp' },
      { id: 'rp-21', name: 'Thanks', file: 'stickers/red_panda_thanks_transparent.webp', thumb: 'stickers/thumbs/red_panda_thanks_transparent.webp' },
      { id: 'rp-22', name: 'Terima Kasih', file: 'stickers/red_panda_terima_kasih_transparent.webp', thumb: 'stickers/thumbs/red_panda_terima_kasih_transparent.webp' },
    ]
  };

  // State
  let packs = [BUILTIN_PACK];
  let activePackId = BUILTIN_PACK_ID;
  let isPanelOpen = false;
  let isDashboardOpen = false;
  let isWppReady = false;
  let viewMode = 'popup'; // 'popup' | 'sidebar'
  let isDashFullscreen = true;

  // Ping page bridge to check WPP ready state
  window.postMessage({ type: 'DRUPPY_CHECK_READY' }, '*');

  // Listen for bridge messages
  window.addEventListener('message', (event) => {
    if (!event.data || typeof event.data !== 'object') return;

    if (event.data.type === 'DRUPPY_WPP_READY') {
      isWppReady = true;
      console.log('[Druppy] WPP native sticker engine ready!');
    }

    if (event.data.type === 'DRUPPY_NATIVE_SEND_RESULT') {
      if (event.data.success) {
        showToast('Stiker terkirim!');
      } else {
        showToast(event.data.error || 'Gagal mengirim stiker.');
      }
    }
  });

  // --- STORAGE HELPERS ---
  async function loadPacksFromStorage() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(
          ['druppy_custom_packs', 'druppy_active_pack', 'druppy_view_mode', 'druppy_dash_fullscreen'],
          (res) => {
            const customPacks = res.druppy_custom_packs || [];
            packs = [BUILTIN_PACK, ...customPacks];
            if (res.druppy_active_pack && packs.some(p => p.id === res.druppy_active_pack)) {
              activePackId = res.druppy_active_pack;
            } else {
              activePackId = BUILTIN_PACK_ID;
            }
            if (res.druppy_view_mode === 'sidebar' || res.druppy_view_mode === 'popup') {
              viewMode = res.druppy_view_mode;
            }
            if (typeof res.druppy_dash_fullscreen === 'boolean') {
              isDashFullscreen = res.druppy_dash_fullscreen;
            }
            resolve();
          }
        );
      } else {
        try {
          const stored = localStorage.getItem('druppy_custom_packs');
          const customPacks = stored ? JSON.parse(stored) : [];
          packs = [BUILTIN_PACK, ...customPacks];
          const storedActive = localStorage.getItem('druppy_active_pack');
          if (storedActive && packs.some(p => p.id === storedActive)) {
            activePackId = storedActive;
          }
          const storedMode = localStorage.getItem('druppy_view_mode');
          if (storedMode === 'sidebar' || storedMode === 'popup') {
            viewMode = storedMode;
          }
          const storedFs = localStorage.getItem('druppy_dash_fullscreen');
          if (storedFs !== null) {
            isDashFullscreen = storedFs === 'true';
          }
        } catch (e) {
          console.warn('[Druppy] Local storage fallback read error:', e);
        }
        resolve();
      }
    });
  }

  async function saveCustomPacksToStorage() {
    const customPacks = packs.filter(p => !p.builtin);
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          druppy_custom_packs: customPacks,
          druppy_active_pack: activePackId
        }, resolve);
      } else {
        try {
          localStorage.setItem('druppy_custom_packs', JSON.stringify(customPacks));
          localStorage.setItem('druppy_active_pack', activePackId);
        } catch (e) {
          console.warn('[Druppy] Local storage fallback write error:', e);
        }
        resolve();
      }
    });
  }

  function setViewMode(newMode) {
    if (newMode !== 'popup' && newMode !== 'sidebar') return;
    viewMode = newMode;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ druppy_view_mode: newMode });
    } else {
      try {
        localStorage.setItem('druppy_view_mode', newMode);
      } catch (e) {}
    }
    applyViewMode();
    showToast(newMode === 'sidebar' ? 'Mode Sidebar Kanan aktif' : 'Mode Popup aktif');
  }

  function setDashFullscreen(fullscreen) {
    isDashFullscreen = fullscreen;
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ druppy_dash_fullscreen: fullscreen });
    } else {
      try {
        localStorage.setItem('druppy_dash_fullscreen', String(fullscreen));
      } catch (e) {}
    }
  }

  // --- TOAST NOTIFICATION ---
  function showToast(message, duration = 2500) {
    let toast = document.getElementById('druppy-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'druppy-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    clearTimeout(toast.__timer);
    toast.__timer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // --- DETECT ACTIVE WHATSAPP CHAT CONTACT NAME ---
  function getActiveChatName() {
    const mainHeader = document.querySelector('#main header');
    if (!mainHeader) return null;

    const candidates = [
      mainHeader.querySelector('div[role="button"] span[title]'),
      mainHeader.querySelector('span[title]'),
      mainHeader.querySelector('div[role="button"] span[dir="auto"]'),
      mainHeader.querySelector('span[dir="auto"]')
    ];

    for (const el of candidates) {
      if (el) {
        const title = el.getAttribute('title') || el.textContent;
        if (title && title.trim()) {
          const t = title.trim();
          if (!/^(online|typing|sedang mengetik|terakhir dilihat|last seen)/i.test(t)) {
            return t;
          }
        }
      }
    }
    return 'Chat Aktif';
  }

  // --- CONVERT FILE / URL TO BASE64 DATAURL ---
  async function toDataURL(urlOrDataUrl) {
    if (urlOrDataUrl.startsWith('data:')) return urlOrDataUrl;
    const res = await fetch(urlOrDataUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // --- SEND STICKER (NATIVE WHATSAPP STICKER) ---
  async function sendSticker(sticker) {
    const mainPanel = document.querySelector('#main');
    if (!mainPanel) {
      showToast('Buka chat WhatsApp tujuan terlebih dahulu!');
      return;
    }

    const chatName = getActiveChatName() || 'WhatsApp';
    showToast(`Mengirim stiker ke ${chatName}...`);

    try {
      const imgUrl = sticker.file
        ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.file) : sticker.file)
        : sticker.dataUrl;

      // Ensure Base64 DataURL
      const base64Data = await toDataURL(imgUrl);

      // Send to page context via postMessage for native WhatsApp sticker transmission
      window.postMessage({
        type: 'DRUPPY_SEND_STICKER_NATIVE',
        dataUrl: base64Data,
        fileName: sticker.name || 'sticker'
      }, '*');

    } catch (err) {
      console.error('[Druppy] Gagal memproses stiker:', err);
      showToast('Gagal menyiapkan stiker: ' + err.message);
    }
  }

  // --- CONVERT UPLOADED IMAGE TO 512x512 WEBP STICKER ---
  function convertStaticImageToStickerWebP(fileOrDataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 1024;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Transparent canvas
        ctx.clearRect(0, 0, size, size);

        // Maintain aspect ratio with 32px padding for Ultra HD
        const maxDim = size - 64;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          h = (h / w) * maxDim;
          w = maxDim;
        } else {
          w = (w / h) * maxDim;
          h = maxDim;
        }

        const x = (size - w) / 2;
        const y = (size - h) / 2;

        ctx.drawImage(img, x, y, w, h);
        const webpDataUrl = canvas.toDataURL('image/webp', 0.98);
        resolve(webpDataUrl);
      };
      img.onerror = reject;

      if (typeof fileOrDataUrl === 'string') {
        img.src = fileOrDataUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(fileOrDataUrl);
      }
    });
  }

  // --- ANIMATED STICKER (GIF / animated WebP -> 512x512 animated WebP) ---
  // Canvas hanya bisa menyimpan satu frame, jadi gambar bergerak didekode per frame
  // memakai ImageDecoder (WebCodecs), tiap frame di-encode ke WebP, lalu dirakit
  // ulang menjadi satu file WebP animasi (RIFF: VP8X + ANIM + ANMF).
  const ANIM_STICKER_SIZE = 512;          // WhatsApp mewajibkan 512x512 untuk stiker animasi
  const ANIM_STICKER_MAX_BYTES = 500 * 1024; // batas ukuran stiker animasi WhatsApp
  const ANIM_STICKER_MAX_FRAMES = 60;
  const ANIM_STICKER_MAX_MS = 10000;

  function sniffImageMime(bytes) {
    if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
    if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
    if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
    return '';
  }

  async function inputToBytes(fileOrDataUrl) {
    const blob = typeof fileOrDataUrl === 'string'
      ? await (await fetch(fileOrDataUrl)).blob()
      : fileOrDataUrl;
    return new Uint8Array(await blob.arrayBuffer());
  }

  // Ambil chunk ALPH / VP8 / VP8L (lengkap dengan header & padding) dari WebP satu frame
  function extractWebpFrameChunks(bytes) {
    const parts = [];
    let off = 12;
    while (off + 8 <= bytes.length) {
      const fourcc = String.fromCharCode(bytes[off], bytes[off + 1], bytes[off + 2], bytes[off + 3]);
      const size = bytes[off + 4] | (bytes[off + 5] << 8) | (bytes[off + 6] << 16) | (bytes[off + 7] << 24);
      const total = 8 + size + (size & 1);
      if (fourcc === 'ALPH' || fourcc === 'VP8 ' || fourcc === 'VP8L') {
        parts.push(bytes.subarray(off, Math.min(off + total, bytes.length)));
      }
      off += total;
    }
    return parts;
  }

  function buildAnimatedWebp(frames, width, height) {
    const u24 = (arr, o, v) => { arr[o] = v & 255; arr[o + 1] = (v >> 8) & 255; arr[o + 2] = (v >> 16) & 255; };
    const u32 = (arr, o, v) => { arr[o] = v & 255; arr[o + 1] = (v >> 8) & 255; arr[o + 2] = (v >> 16) & 255; arr[o + 3] = (v >>> 24) & 255; };
    const chunkHeader = (fourcc, size) => {
      const h = new Uint8Array(8);
      for (let i = 0; i < 4; i++) h[i] = fourcc.charCodeAt(i);
      u32(h, 4, size);
      return h;
    };

    const pieces = [];
    // VP8X: flag animasi (0x02) + alpha (0x10)
    const vp8x = new Uint8Array(10);
    vp8x[0] = 0x12;
    u24(vp8x, 4, width - 1);
    u24(vp8x, 7, height - 1);
    pieces.push(chunkHeader('VP8X', 10), vp8x);
    // ANIM: background transparan, loop selamanya
    pieces.push(chunkHeader('ANIM', 6), new Uint8Array(6));

    for (const f of frames) {
      const dataLen = f.chunks.reduce((s, c) => s + c.length, 0);
      const hdr = new Uint8Array(16);
      u24(hdr, 6, width - 1);
      u24(hdr, 9, height - 1);
      u24(hdr, 12, Math.max(20, Math.round(f.duration)));
      hdr[15] = 0x02; // tanpa blending: tiap frame sudah berupa gambar utuh
      pieces.push(chunkHeader('ANMF', 16 + dataLen), hdr, ...f.chunks);
    }

    const bodyLen = pieces.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(12 + bodyLen);
    out.set([0x52, 0x49, 0x46, 0x46], 0);
    u32(out, 4, 4 + bodyLen);
    out.set([0x57, 0x45, 0x42, 0x50], 8);
    let o = 12;
    for (const p of pieces) { out.set(p, o); o += p.length; }
    return out;
  }

  function canvasToWebpBytes(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob || blob.type !== 'image/webp') return reject(new Error('Browser tidak mendukung encode WebP'));
        resolve(new Uint8Array(await blob.arrayBuffer()));
      }, 'image/webp', quality);
    });
  }

  function bytesToDataUrl(bytes, mime) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([bytes], { type: mime }));
    });
  }

  // Mengembalikan dataUrl WebP animasi, atau null kalau gambar ternyata tidak bergerak
  // transform opsional dari Crop: { rotation, srcX, srcY, srcW, srcH } (koordinat piksel gambar setelah diputar)
  async function convertAnimatedToStickerWebP(bytes, mime, transform) {
    if (typeof ImageDecoder === 'undefined') return null;
    if (mime !== 'image/gif' && mime !== 'image/webp') return null;
    if (!(await ImageDecoder.isTypeSupported(mime))) return null;

    const decoder = new ImageDecoder({ data: bytes, type: mime });
    try {
      await decoder.tracks.ready;
      await decoder.completed;
      const track = decoder.tracks.selectedTrack;
      const frameCount = track ? track.frameCount : 1;
      if (!track || !track.animated || frameCount < 2) return null;

      // Dekode semua frame dulu (dengan durasi asli), batasi total durasi
      const decoded = [];
      let elapsed = 0;
      for (let i = 0; i < frameCount && elapsed < ANIM_STICKER_MAX_MS; i++) {
        const { image } = await decoder.decode({ frameIndex: i });
        let dur = image.duration ? image.duration / 1000 : 100;
        if (dur < 20) dur = 100; // GIF dengan delay 0 diputar 10fps seperti browser
        const c = document.createElement('canvas');
        c.width = ANIM_STICKER_SIZE;
        c.height = ANIM_STICKER_SIZE;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const iw = image.displayWidth, ih = image.displayHeight;
        let source = image;
        let sx = 0, sy = 0, sw = iw, sh = ih;
        if (transform) {
          const rot = ((transform.rotation || 0) % 360 + 360) % 360;
          if (rot) {
            const sideways = rot % 180 !== 0;
            const rc = document.createElement('canvas');
            rc.width = sideways ? ih : iw;
            rc.height = sideways ? iw : ih;
            const rctx = rc.getContext('2d');
            rctx.translate(rc.width / 2, rc.height / 2);
            rctx.rotate((rot * Math.PI) / 180);
            rctx.drawImage(image, -iw / 2, -ih / 2);
            source = rc;
          }
          sx = transform.srcX; sy = transform.srcY; sw = transform.srcW; sh = transform.srcH;
        }
        const maxDim = ANIM_STICKER_SIZE - 32;
        const scale = Math.min(maxDim / sw, maxDim / sh);
        const w = sw * scale, h = sh * scale;
        ctx.drawImage(source, sx, sy, sw, sh, (ANIM_STICKER_SIZE - w) / 2, (ANIM_STICKER_SIZE - h) / 2, w, h);
        image.close();
        decoded.push({ canvas: c, duration: dur });
        elapsed += dur;
      }

      // Kurangi jumlah frame bila terlalu banyak (durasi digabung supaya kecepatan tetap)
      const sample = (list, maxCount) => {
        if (list.length <= maxCount) return list;
        const step = list.length / maxCount;
        const out = [];
        for (let k = 0; k < maxCount; k++) {
          const from = Math.floor(k * step), to = Math.floor((k + 1) * step);
          let d = 0;
          for (let j = from; j < to; j++) d += list[j].duration;
          out.push({ canvas: list[from].canvas, duration: d });
        }
        return out;
      };

      let frameSet = sample(decoded, ANIM_STICKER_MAX_FRAMES);
      const qualities = [0.8, 0.65, 0.5, 0.35, 0.2];
      let result = null;
      for (let attempt = 0; attempt < 8 && !result; attempt++) {
        for (const q of qualities) {
          const frames = [];
          for (const f of frameSet) {
            frames.push({ chunks: extractWebpFrameChunks(await canvasToWebpBytes(f.canvas, q)), duration: f.duration });
          }
          const webp = buildAnimatedWebp(frames, ANIM_STICKER_SIZE, ANIM_STICKER_SIZE);
          result = webp;
          if (webp.length <= ANIM_STICKER_MAX_BYTES) break;
          result = null;
        }
        if (!result) {
          if (frameSet.length <= 4) break;
          frameSet = sample(frameSet, Math.ceil(frameSet.length / 2));
        }
      }
      if (!result) throw new Error('Animasi terlalu besar untuk stiker WhatsApp (maks 500KB)');
      return await bytesToDataUrl(result, 'image/webp');
    } finally {
      decoder.close();
    }
  }

  // Titik masuk utama: gambar bergerak tetap bergerak, gambar diam diproses seperti biasa
  async function convertImageToStickerWebP(fileOrDataUrl) {
    try {
      const bytes = await inputToBytes(fileOrDataUrl);
      const declared = typeof fileOrDataUrl === 'string'
        ? (fileOrDataUrl.match(/^data:([^;,]+)/) || [])[1] || ''
        : fileOrDataUrl.type || '';
      const mime = sniffImageMime(bytes) || declared;
      const animated = await convertAnimatedToStickerWebP(bytes, mime);
      if (animated) return animated;
    } catch (err) {
      if (err && /terlalu besar/.test(err.message)) throw err;
      console.warn('[WhatsappReextended] Proses animasi gagal, pakai gambar diam:', err);
    }
    return convertStaticImageToStickerWebP(fileOrDataUrl);
  }

  // =========================================================================
  // 1. CHAT FOOTER BUTTON INJECTION (Anti-Stacking & Perfectly Aligned)
  // =========================================================================
  function injectChatFooterButton() {
    const mainPanel = document.querySelector('#main');
    if (!mainPanel) return;

    const footer = mainPanel.querySelector('footer');
    if (!footer) return;

    let footerBtn = footer.querySelector('#druppy-footer-btn');

    if (!footerBtn) {
      // Locate emoji or attach button in footer
      const emojiBtn =
        footer.querySelector('button[aria-label*="emoji" i], [data-icon="smiley"], [data-icon="expressions"], [data-icon="sticker"]')
          ?.closest('button, [role="button"]');

      const attachBtn =
        footer.querySelector('button[aria-label*="Attach" i], button[aria-label*="Lampirkan" i], [data-icon="plus"], [data-icon="attach-menu-plus"], [data-icon="clip"]')
          ?.closest('button, [role="button"]');

      // Anchor point: prefer attachBtn (so it sits next to clip) or emojiBtn
      const anchor = attachBtn || emojiBtn;
      if (!anchor) return;

      footerBtn = document.createElement('button');
      footerBtn.id = 'druppy-footer-btn';
      footerBtn.className = 'druppy-footer-btn';
      footerBtn.type = 'button';
      footerBtn.title = 'WhatsappReextended (Buka Panel Stiker)';
      footerBtn.setAttribute('aria-label', 'WhatsappReextended');
      footerBtn.innerHTML = LOGO_HTML;

      footerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePanel();
      });

      // Walk up if parent only contains this button (single-child wrapper)
      // so we insert alongside the wrapper in the row, preventing vertical stacking!
      let targetNode = anchor;
      while (targetNode.parentElement &&
             targetNode.parentElement !== footer &&
             targetNode.parentElement.children.length === 1) {
        targetNode = targetNode.parentElement;
      }
      targetNode.insertAdjacentElement('afterend', footerBtn);
    }

    // Crucial: Fix WhatsApp Web input pill wrapping.
    // Force nowrap and row alignment on button wrappers so elements don't stack ("numpuk")
    let curr = footerBtn.parentElement;
    while (curr && curr !== footer) {
      curr.style.setProperty('flex-wrap', 'nowrap', 'important');
      curr.style.setProperty('flex-direction', 'row', 'important');
      curr.style.setProperty('align-items', 'center', 'important');
      curr = curr.parentElement;
    }

    // Ensure Sticker Panel exists
    ensurePanel();
  }

  // =========================================================================
  // 2. STICKER PANEL (DUAL MODE: POPUP / SIDEBAR KANAN)
  // =========================================================================
  function ensurePanel() {
    if (document.getElementById('druppy-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'druppy-panel';
    panel.className = `druppy-mode-${viewMode} druppy-hidden`;
    panel.innerHTML = `
      <div class="druppy-header">
        <div class="druppy-header-title">
          <img src="${LOGO_URL}" class="druppy-header-logo-img" alt="WhatsappReextended" />
          <span>WhatsappReextended</span>
          <span class="druppy-header-badge" id="druppy-panel-mode-badge">${viewMode === 'sidebar' ? 'Sidebar' : 'Popup'}</span>
        </div>
        <div class="druppy-header-actions">
          <button class="druppy-btn-link" id="druppy-btn-toggle-mode" title="Ubah tampilan ke Sidebar Kanan / Popup">
            ${viewMode === 'sidebar' ? ICONS.popup + ' Popup' : ICONS.sidebar + ' Sidebar'}
          </button>
          <button class="druppy-btn-link" id="druppy-btn-open-dash" title="Buka Dashboard Studio Stiker">${ICONS.dashboard} Dashboard</button>
          <button class="druppy-btn-icon" id="druppy-btn-close-panel" title="Tutup">${ICONS.close}</button>
        </div>
      </div>

      <div class="druppy-tabs" id="druppy-popover-tabs">
        <!-- Rendered via JS -->
      </div>

      <div class="druppy-toolbar">
        <span id="druppy-popover-info">10 Stiker</span>
        <button class="druppy-btn-action" id="druppy-btn-popover-upload">${ICONS.plus} Tambah Stiker</button>
      </div>

      <div class="druppy-body" id="druppy-popover-body">
        <!-- Rendered via JS -->
      </div>

      <input type="file" id="druppy-popover-file-input" accept="image/*" multiple style="display:none;" />
    `;

    document.body.appendChild(panel);

    // Prevent clicks inside panel from bubbling to document (prevent premature closing)
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Events
    panel.querySelector('#druppy-btn-close-panel').addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
    panel.querySelector('#druppy-btn-open-dash').addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
      openDashboard();
    });
    panel.querySelector('#druppy-btn-toggle-mode').addEventListener('click', (e) => {
      e.stopPropagation();
      const nextMode = viewMode === 'popup' ? 'sidebar' : 'popup';
      setViewMode(nextMode);
    });
    panel.querySelector('#druppy-btn-popover-upload').addEventListener('click', () => {
      const currentPack = packs.find(p => p.id === activePackId) || BUILTIN_PACK;
      if (currentPack.builtin) {
        const ask = confirm('Paket Red Panda adalah stiker bawaan.\nBuka dashboard untuk membuat paket baru?');
        if (ask) openDashboard();
        return;
      }
      panel.querySelector('#druppy-popover-file-input').click();
    });

    panel.querySelector('#druppy-popover-file-input').addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await processAndAddFilesToActivePack(files);
      }
      e.target.value = '';
    });

    renderPopover();
  }

  function positionPanel() {
    const panel = document.getElementById('druppy-panel');
    if (!panel) return;

    if (viewMode === 'sidebar') {
      panel.style.top = '0';
      panel.style.right = '0';
      panel.style.bottom = '0';
      panel.style.left = 'auto';
      panel.style.width = '380px';
      panel.style.height = '100vh';
      return;
    }

    // Popup mode: calculate position above footerBtn
    const footerBtn = document.getElementById('druppy-footer-btn');
    panel.style.top = 'auto';
    panel.style.right = 'auto';
    panel.style.width = '390px';
    panel.style.height = '460px';

    if (footerBtn) {
      const rect = footerBtn.getBoundingClientRect();
      const bottomPos = Math.max(16, window.innerHeight - rect.top + 8);
      const leftPos = Math.max(16, Math.min(rect.left - 12, window.innerWidth - 410));
      panel.style.bottom = `${bottomPos}px`;
      panel.style.left = `${leftPos}px`;
    } else {
      panel.style.bottom = '68px';
      panel.style.left = '20px';
    }
  }

  function applyViewMode() {
    const panel = document.getElementById('druppy-panel');
    if (panel) {
      panel.classList.remove('druppy-mode-popup', 'druppy-mode-sidebar');
      panel.classList.add(`druppy-mode-${viewMode}`);

      const badge = panel.querySelector('#druppy-panel-mode-badge');
      if (badge) badge.textContent = viewMode === 'sidebar' ? 'Sidebar' : 'Popup';

      const toggleBtn = panel.querySelector('#druppy-btn-toggle-mode');
      if (toggleBtn) {
        toggleBtn.innerHTML = viewMode === 'sidebar'
          ? `${ICONS.popup} Popup`
          : `${ICONS.sidebar} Sidebar`;
      }

      if (isPanelOpen) {
        positionPanel();
      }
    }

    // Sync dashboard settings card buttons if rendered
    const modeBtns = document.querySelectorAll('.druppy-dash-mode-btn');
    modeBtns.forEach(btn => {
      if (btn.dataset.mode === viewMode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const hint = document.getElementById('druppy-dash-mode-hint');
    if (hint) {
      hint.textContent = viewMode === 'sidebar'
        ? 'Panel stiker muncul di sisi kanan layar'
        : 'Panel stiker melayang di atas bar chat';
    }
  }

  function togglePanel() {
    if (isPanelOpen) {
      closePanel();
    } else {
      openPanel();
    }
  }

  function openPanel() {
    ensurePanel();
    const panel = document.getElementById('druppy-panel');
    const footerBtn = document.getElementById('druppy-footer-btn');
    if (!panel) return;

    applyViewMode();
    positionPanel();
    panel.classList.remove('druppy-hidden');
    if (footerBtn) footerBtn.classList.add('active');
    isPanelOpen = true;
    renderPopover();
  }

  function closePanel() {
    const panel = document.getElementById('druppy-panel');
    const footerBtn = document.getElementById('druppy-footer-btn');
    if (panel) panel.classList.add('druppy-hidden');
    if (footerBtn) footerBtn.classList.remove('active');
    isPanelOpen = false;
  }

  function renderPopover() {
    renderPopoverTabs();
    renderPopoverBody();
  }

  function renderPopoverTabs() {
    const container = document.getElementById('druppy-popover-tabs');
    if (!container) return;
    container.innerHTML = '';

    packs.forEach((pack) => {
      const tab = document.createElement('div');
      tab.className = `druppy-tab ${pack.id === activePackId ? 'active' : ''}`;
      tab.textContent = pack.name;
      tab.title = pack.name;
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        activePackId = pack.id;
        saveCustomPacksToStorage();
        renderPopover();
      });
      container.appendChild(tab);
    });

    // Add Tab shortcut
    const addTab = document.createElement('div');
    addTab.className = 'druppy-tab druppy-tab-add';
    addTab.innerHTML = `${ICONS.plus} Paket Baru`;
    addTab.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
      openDashboard();
    });
    container.appendChild(addTab);
  }

  function renderPopoverBody() {
    const body = document.getElementById('druppy-popover-body');
    const infoSpan = document.getElementById('druppy-popover-info');
    if (!body) return;
    body.innerHTML = '';

    const currentPack = packs.find(p => p.id === activePackId) || BUILTIN_PACK;
    const stickers = currentPack.stickers || [];

    if (infoSpan) {
      infoSpan.textContent = `${stickers.length} Stiker ${currentPack.builtin ? '(Bawaan)' : ''}`;
    }

    if (stickers.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'druppy-empty';
      empty.innerHTML = `
        <div>${ICONS.package}</div>
        <div>Belum ada stiker di paket ini</div>
        <div style="font-size:11px; opacity:0.8;">Buka Dashboard atau klik "+ Tambah Stiker"</div>
      `;
      body.appendChild(empty);
      return;
    }

    stickers.forEach((sticker) => {
      const item = document.createElement('div');
      item.className = 'druppy-sticker-item';
      item.title = `${sticker.name || 'Stiker'} (Klik untuk kirim ke chat)`;

      // Preview thumbnail for grid (minified, smooth, fast)
      const previewSrc = sticker.thumb
        ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.thumb) : sticker.thumb)
        : (sticker.file
            ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.file) : sticker.file)
            : (sticker.thumbDataUrl || sticker.dataUrl));

      const img = document.createElement('img');
      img.src = previewSrc;
      img.alt = sticker.name || 'Stiker';
      img.loading = 'lazy';
      item.appendChild(img);

      item.addEventListener('click', (e) => {
        e.stopPropagation();
        sendSticker(sticker);
      });

      body.appendChild(item);
    });
  }

  // =========================================================================
  // 3. LEFT NAVIGATION RAIL BUTTON (Di Bawah Meta AI)
  // =========================================================================
  function injectLeftRailButton() {
    if (document.getElementById('druppy-rail-btn')) return;

    // 1. Look for Meta AI button in the navigation rail
    const metaAiButton =
      document.querySelector('button[aria-label*="Meta AI" i]') ||
      document.querySelector('[role="button"][aria-label*="Meta AI" i]') ||
      document.querySelector('span[data-icon="meta-ai"]')?.closest('button, [role="button"]') ||
      document.querySelector('span[data-icon*="meta"]')?.closest('button, [role="button"]');

    // 2. Or fallback to Navigation rail container
    const navRail =
      document.querySelector('div[aria-label="Navigation rail"]') ||
      document.querySelector('nav') ||
      document.querySelector('header')?.parentElement;

    const wrapper = document.createElement('div');
    wrapper.className = 'druppy-rail-btn-wrapper';

    const railBtn = document.createElement('button');
    railBtn.id = 'druppy-rail-btn';
    railBtn.className = 'druppy-rail-btn';
    railBtn.type = 'button';
    railBtn.title = 'WhatsappReextended Studio';
    railBtn.setAttribute('aria-label', 'WhatsappReextended Studio');
    railBtn.innerHTML = `
      <img src="${LOGO_URL}" class="druppy-rail-logo-img" alt="WhatsappReextended" />
      <div class="druppy-rail-badge"></div>
    `;

    railBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openDashboard();
    });

    wrapper.appendChild(railBtn);

    if (metaAiButton && metaAiButton.parentElement) {
      const metaContainer = metaAiButton.parentElement;
      metaContainer.insertAdjacentElement('afterend', wrapper);
      console.log('[Druppy] Left rail button injected below Meta AI!');
    } else if (navRail) {
      navRail.appendChild(wrapper);
      console.log('[Druppy] Left rail button injected into Navigation Rail!');
    }
  }

  // =========================================================================
  // 4. FULLSCREEN DRUPPY DASHBOARD MODAL
  // =========================================================================
  function ensureDashboardModal() {
    if (document.getElementById('druppy-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'druppy-modal-overlay';
    overlay.innerHTML = `
      <div id="druppy-dashboard-modal" class="${isDashFullscreen ? '' : 'druppy-dash-windowed'}">
        <div class="druppy-dash-header">
          <div class="druppy-dash-header-left">
            <img src="${LOGO_URL}" style="width:36px; height:36px; border-radius:8px; object-fit:cover;" alt="WhatsappReextended" />
            <div>
              <div class="druppy-dash-header-title">WhatsappReextended Studio</div>
              <div class="druppy-dash-header-subtitle">Kelola, crop, dan buat paket stiker WhatsApp Web Anda</div>
            </div>
          </div>
          <div class="druppy-dash-header-actions">
            <button class="druppy-btn-link" id="druppy-dash-toggle-fullscreen" title="Ubah tampilan Layar Penuh / Mode Jendela">
              ${isDashFullscreen ? ICONS.windowed + ' Mode Jendela' : ICONS.fullscreen + ' Layar Penuh'}
            </button>
            <button class="druppy-dash-btn-close" id="druppy-dash-close" title="Tutup Dashboard (Esc)">${ICONS.close}</button>
          </div>
        </div>

        <div class="druppy-dash-body">
          <!-- Sidebar: Pack List & Settings -->
          <div class="druppy-dash-sidebar">
            <div class="druppy-dash-sidebar-header">
              <span>Paket Stiker</span>
              <span id="druppy-dash-pack-count">1 Paket</span>
            </div>
            <div class="druppy-dash-pack-list" id="druppy-dash-pack-list">
              <!-- Rendered via JS -->
            </div>
            <div class="druppy-dash-sidebar-actions">
              <button class="druppy-btn-primary" id="druppy-dash-btn-new-pack">
                ${ICONS.plus}
                <span>Buat Paket Baru</span>
              </button>
            </div>

            <!-- Tampilan Panel Config (Popup vs Sidebar Kanan) -->
            <div class="druppy-dash-settings-card">
              <div class="druppy-dash-settings-title">${ICONS.settings} Mode Panel Chat</div>
              <div class="druppy-dash-mode-options">
                <button type="button" class="druppy-dash-mode-btn ${viewMode === 'popup' ? 'active' : ''}" data-mode="popup">
                  ${ICONS.popup}
                  <span>Popup</span>
                </button>
                <button type="button" class="druppy-dash-mode-btn ${viewMode === 'sidebar' ? 'active' : ''}" data-mode="sidebar">
                  ${ICONS.sidebar}
                  <span>Sidebar</span>
                </button>
              </div>
              <div class="druppy-dash-settings-hint" id="druppy-dash-mode-hint">
                ${viewMode === 'sidebar' ? 'Panel stiker muncul di sisi kanan layar' : 'Panel stiker melayang di atas bar chat'}
              </div>
            </div>
          </div>

          <!-- Main: Active Pack Details & Stickers Grid -->
          <div class="druppy-dash-main" id="druppy-dash-main">
            <!-- Rendered via JS -->
          </div>
        </div>
      </div>
      <input type="file" id="druppy-dash-file-input" accept="image/*" multiple style="display:none;" />
      <input type="file" id="druppy-dash-crop-input" accept="image/*" style="display:none;" />
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#druppy-dash-close').addEventListener('click', closeDashboard);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDashboard();
    });

    overlay.querySelector('#druppy-dash-toggle-fullscreen').addEventListener('click', toggleDashFullscreen);
    overlay.querySelector('#druppy-dash-btn-new-pack').addEventListener('click', handleCreateNewPack);

    // Mode buttons in settings card
    overlay.querySelectorAll('.druppy-dash-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setViewMode(btn.dataset.mode);
      });
    });

    const fileInput = overlay.querySelector('#druppy-dash-file-input');
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await processAndAddFilesToActivePack(files);
      }
      e.target.value = '';
    });

    const cropInput = overlay.querySelector('#druppy-dash-crop-input');
    cropInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const currentPack = packs.find(p => p.id === activePackId) || BUILTIN_PACK;
        openCropModal(file, currentPack);
      }
      e.target.value = '';
    });
  }

  function toggleDashFullscreen() {
    isDashFullscreen = !isDashFullscreen;
    const modal = document.getElementById('druppy-dashboard-modal');
    const toggleBtn = document.getElementById('druppy-dash-toggle-fullscreen');
    if (modal) {
      if (isDashFullscreen) {
        modal.classList.remove('druppy-dash-windowed');
      } else {
        modal.classList.add('druppy-dash-windowed');
      }
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = isDashFullscreen
        ? `${ICONS.windowed} Mode Jendela`
        : `${ICONS.fullscreen} Layar Penuh`;
    }
    setDashFullscreen(isDashFullscreen);
    showToast(isDashFullscreen ? 'Dashboard Layar Penuh' : 'Dashboard Mode Jendela');
  }

  function openDashboard() {
    ensureDashboardModal();
    const overlay = document.getElementById('druppy-modal-overlay');
    if (overlay) {
      overlay.classList.add('show');
      isDashboardOpen = true;
      renderDashboard();
    }
  }

  function closeDashboard() {
    const overlay = document.getElementById('druppy-modal-overlay');
    if (overlay) {
      overlay.classList.remove('show');
      isDashboardOpen = false;
    }
  }

  function renderDashboard() {
    renderDashboardSidebar();
    renderDashboardMain();
  }

  function renderDashboardSidebar() {
    const list = document.getElementById('druppy-dash-pack-list');
    const count = document.getElementById('druppy-dash-pack-count');
    if (!list) return;

    if (count) count.textContent = `${packs.length} Paket`;
    list.innerHTML = '';

    packs.forEach((pack) => {
      const item = document.createElement('div');
      item.className = `druppy-dash-pack-item ${pack.id === activePackId ? 'active' : ''}`;
      item.innerHTML = `
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${pack.name}</span>
        <span style="font-size:11px; opacity:0.7;">${(pack.stickers || []).length}</span>
      `;
      item.addEventListener('click', () => {
        activePackId = pack.id;
        saveCustomPacksToStorage();
        renderDashboard();
        renderPopover();
      });
      list.appendChild(item);
    });

    // Update active state on settings buttons
    applyViewMode();
  }

  function renderDashboardMain() {
    const main = document.getElementById('druppy-dash-main');
    if (!main) return;
    main.innerHTML = '';

    const currentPack = packs.find(p => p.id === activePackId) || BUILTIN_PACK;
    const stickers = currentPack.stickers || [];

    // Header section
    const header = document.createElement('div');
    header.className = 'druppy-dash-main-header';
    header.innerHTML = `
      <div>
        <div class="druppy-dash-pack-title">${currentPack.name}</div>
        <div class="druppy-dash-pack-meta">${stickers.length} stiker • ${currentPack.builtin ? 'Paket Bawaan (Read-only)' : 'Paket Kustom Pribadi'}</div>
      </div>
      <div style="display:flex; gap:8px;">
        ${!currentPack.builtin ? `
          <button class="druppy-btn-action" id="druppy-dash-btn-rename">${ICONS.edit} Ganti Nama</button>
          <button class="druppy-btn-action" id="druppy-dash-btn-delete" style="color:#ef4444; border-color:rgba(239,68,68,0.3);">${ICONS.trash} Hapus Paket</button>
        ` : ''}
        <button class="druppy-btn-action" id="druppy-dash-btn-crop-new" title="Upload gambar dan crop jadi stiker">${ICONS.crop} Crop Gambar Baru</button>
        <button class="druppy-btn-action" id="druppy-dash-btn-upload" style="background:#202c33; border-color:#f97316; color:#f97316;">${ICONS.plus} Tambah Stiker</button>
      </div>
    `;
    main.appendChild(header);

    // Header buttons
    const uploadBtn = header.querySelector('#druppy-dash-btn-upload');
    uploadBtn.addEventListener('click', () => {
      if (currentPack.builtin) {
        const ask = confirm('Paket Red Panda adalah stiker bawaan.\nBuat paket baru untuk stiker kustom Anda?');
        if (ask) handleCreateNewPack();
        return;
      }
      document.getElementById('druppy-dash-file-input').click();
    });

    const cropNewBtn = header.querySelector('#druppy-dash-btn-crop-new');
    cropNewBtn.addEventListener('click', () => {
      if (currentPack.builtin) {
        const ask = confirm('Paket Red Panda adalah stiker bawaan.\nBuat paket baru untuk stiker kustom Anda?');
        if (ask) handleCreateNewPack();
        return;
      }
      document.getElementById('druppy-dash-crop-input').click();
    });

    const renameBtn = header.querySelector('#druppy-dash-btn-rename');
    if (renameBtn) {
      renameBtn.addEventListener('click', () => {
        const newName = prompt('Ganti nama paket:', currentPack.name);
        if (newName && newName.trim()) {
          currentPack.name = newName.trim();
          saveCustomPacksToStorage();
          renderDashboard();
          renderPopover();
          showToast('Nama paket diperbarui!');
        }
      });
    }

    const deleteBtn = header.querySelector('#druppy-dash-btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Hapus paket "${currentPack.name}" beserta ${stickers.length} stikernya?`)) {
          packs = packs.filter(p => p.id !== currentPack.id);
          activePackId = BUILTIN_PACK_ID;
          saveCustomPacksToStorage();
          renderDashboard();
          renderPopover();
          showToast('Paket berhasil dihapus.');
        }
      });
    }

    // Dropzone for custom pack
    if (!currentPack.builtin) {
      const dropzone = document.createElement('div');
      dropzone.className = 'druppy-dropzone';
      dropzone.innerHTML = `
        <div>${ICONS.upload}</div>
        <span style="font-weight:600;">Drag & drop gambar ke sini untuk dijadikan stiker</span>
        <span style="font-size:11px; opacity:0.8;">Format PNG, JPG, WebP otomatis diubah ke 512x512 WebP Transparan</span>
      `;
      dropzone.addEventListener('click', () => {
        document.getElementById('druppy-dash-file-input').click();
      });
      setupDragAndDrop(dropzone);
      main.appendChild(dropzone);
    }

    // Stickers Grid
    const grid = document.createElement('div');
    grid.className = 'druppy-dash-grid';

    if (stickers.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'druppy-empty';
      empty.innerHTML = `
        <div>${ICONS.package}</div>
        <div>Paket ini masih kosong. Silakan upload gambar stiker Anda!</div>
      `;
      main.appendChild(empty);
    } else {
      stickers.forEach((sticker) => {
        const card = document.createElement('div');
        card.className = 'druppy-dash-sticker-card druppy-checkerboard';
        card.title = `${sticker.name || 'Stiker'} (Klik untuk buka detail & kirim)`;

        // Preview thumbnail for grid (minified, smooth, fast)
        const previewSrc = sticker.thumb
          ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.thumb) : sticker.thumb)
          : (sticker.file
              ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.file) : sticker.file)
              : (sticker.thumbDataUrl || sticker.dataUrl));

        const img = document.createElement('img');
        img.src = previewSrc;
        img.alt = sticker.name || 'Stiker';
        img.loading = 'lazy';
        card.appendChild(img);

        // Delete badge button for quick removal
        if (!currentPack.builtin) {
          const del = document.createElement('button');
          del.className = 'druppy-delete-sticker-btn';
          del.innerHTML = ICONS.close;
          del.title = 'Hapus stiker ini';
          del.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Hapus stiker "${sticker.name || 'ini'}"?`)) {
              currentPack.stickers = currentPack.stickers.filter(s => s.id !== sticker.id);
              saveCustomPacksToStorage();
              renderDashboard();
              renderPopover();
              showToast('Stiker dihapus');
            }
          });
          card.appendChild(del);
        }

        // REQUIRED: When clicked in dashboard, DO NOT send immediately. Open Detail Modal!
        card.addEventListener('click', () => {
          openStickerDetailModal(sticker, currentPack);
        });

        grid.appendChild(card);
      });

      main.appendChild(grid);
    }
  }

  function handleCreateNewPack() {
    const name = prompt('Masukkan nama paket stiker baru:');
    if (!name || !name.trim()) return;

    const newPack = {
      id: 'pack-' + Date.now(),
      name: name.trim(),
      builtin: false,
      stickers: []
    };

    packs.push(newPack);
    activePackId = newPack.id;
    saveCustomPacksToStorage();
    renderDashboard();
    renderPopover();
    showToast(`Paket "${newPack.name}" dibuat!`);
  }

  async function processAndAddFilesToActivePack(files) {
    showToast(`Memproses ${files.length} gambar ke 512x512 WebP...`);
    const currentPack = packs.find(p => p.id === activePackId) || BUILTIN_PACK;
    if (currentPack.builtin) return;

    let added = 0;
    for (const f of files) {
      try {
        const dataUrl = await convertImageToStickerWebP(f);
        currentPack.stickers.push({
          id: 'stk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
          name: f.name.replace(/\.[^/.]+$/, ''),
          dataUrl: dataUrl
        });
        added++;
      } catch (err) {
        console.error('[Druppy] Gagal memproses gambar:', f.name, err);
        if (err && /terlalu besar/.test(err.message)) showToast(`${f.name}: ${err.message}`);
      }
    }

    if (added > 0) {
      await saveCustomPacksToStorage();
      renderDashboard();
      renderPopover();
      showToast(`${added} stiker berhasil ditambahkan!`);
    } else {
      showToast('Gagal memproses gambar.');
    }
  }

  function setupDragAndDrop(el) {
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('dragover');
    });
    el.addEventListener('dragleave', () => {
      el.classList.remove('dragover');
    });
    el.addEventListener('drop', async (e) => {
      e.preventDefault();
      el.classList.remove('dragover');
      const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) {
        await processAndAddFilesToActivePack(files);
      }
    });
  }

  // =========================================================================
  // 5. STICKER DETAIL MODAL (Click Sticker in Dashboard)
  // =========================================================================
  function openStickerDetailModal(sticker, currentPack) {
    let overlay = document.getElementById('druppy-detail-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'druppy-detail-overlay';
      document.body.appendChild(overlay);
    }

    const imgUrl = sticker.file
      ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(sticker.file) : sticker.file)
      : sticker.dataUrl;

    const activeChat = getActiveChatName();
    const chatLabel = activeChat ? activeChat : 'WhatsApp';

    overlay.innerHTML = `
      <div class="druppy-detail-modal">
        <div class="druppy-detail-header">
          <div class="druppy-detail-header-left">
            <img src="${LOGO_URL}" style="width:22px; height:22px; border-radius:5px; object-fit:cover;" alt="WhatsappReextended" />
            <span>Detail Stiker - WhatsappReextended</span>
          </div>
          <button class="druppy-btn-icon" id="druppy-detail-close" title="Tutup">${ICONS.close}</button>
        </div>

        <div class="druppy-detail-body">
          <div class="druppy-detail-preview-container druppy-checkerboard">
            <img src="${imgUrl}" alt="${sticker.name || 'Stiker'}" />
          </div>

          <div class="druppy-detail-meta">
            <div class="druppy-detail-name-row">
              <input type="text" class="druppy-detail-name-input" id="druppy-detail-name-input" value="${sticker.name || 'Stiker'}" ${currentPack.builtin ? 'readonly title="Paket bawaan tidak dapat diubah"' : ''} placeholder="Nama stiker..." />
              ${!currentPack.builtin ? `<button class="druppy-btn-action" id="druppy-detail-btn-save-name" title="Simpan Nama Baru">${ICONS.check} Simpan</button>` : ''}
            </div>

            <!-- PACK SELECTOR DROPDOWN -->
            <div class="druppy-detail-pack-row">
              <span class="druppy-detail-pack-label">Paket:</span>
              <select class="druppy-detail-pack-select" id="druppy-detail-pack-select">
                ${packs.map(p => `
                  <option value="${p.id}" ${p.id === currentPack.id ? 'selected' : ''}>
                    📁 ${p.name} ${p.builtin ? '(Bawaan)' : ''}
                  </option>
                `).join('')}
                <option value="__create_new__">➕ Buat Paket Baru...</option>
              </select>
            </div>

            <div class="druppy-detail-tags">
              <span class="druppy-detail-tag">Ultra HD WebP</span>
              <span class="druppy-detail-tag status-ready">Siap Kirim</span>
            </div>
          </div>
        </div>

        <div class="druppy-detail-footer">
          <button class="druppy-btn-send-chat" id="druppy-detail-btn-send" title="Kirim stiker ke ruang chat yang sedang aktif">
            ${ICONS.send}
            <span>Kirim ke ${chatLabel}</span>
          </button>

          <div class="druppy-detail-actions-row">
            <button class="druppy-detail-btn-crop" id="druppy-detail-btn-crop">
              ${ICONS.crop}
              <span>${currentPack.builtin ? 'Duplikat & Crop' : 'Crop & Edit'}</span>
            </button>

            ${!currentPack.builtin ? `
              <button class="druppy-detail-btn-delete" id="druppy-detail-btn-delete">
                ${ICONS.trash}
                <span>Hapus</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('show');

    const closeDetail = () => {
      overlay.classList.remove('show');
    };

    overlay.querySelector('#druppy-detail-close').addEventListener('click', closeDetail);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDetail();
    });

    // Save Name
    const nameInput = overlay.querySelector('#druppy-detail-name-input');
    const saveNameBtn = overlay.querySelector('#druppy-detail-btn-save-name');
    const handleSaveName = () => {
      if (currentPack.builtin) return;
      const newName = nameInput.value.trim();
      if (newName && newName !== sticker.name) {
        sticker.name = newName;
        saveCustomPacksToStorage();
        renderDashboard();
        renderPopover();
        showToast('Nama stiker diperbarui!');
      }
    };
    if (saveNameBtn) saveNameBtn.addEventListener('click', handleSaveName);
    if (nameInput) {
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSaveName();
      });
    }

    // Pack Selector Change Handler
    const packSelect = overlay.querySelector('#druppy-detail-pack-select');
    if (packSelect) {
      packSelect.addEventListener('change', async (e) => {
        const selectedVal = e.target.value;
        if (selectedVal === '__create_new__') {
          const newPackName = prompt('Masukkan nama paket stiker baru:');
          if (!newPackName || !newPackName.trim()) {
            packSelect.value = currentPack.id;
            return;
          }
          const createdPack = {
            id: 'pack-' + Date.now(),
            name: newPackName.trim(),
            builtin: false,
            stickers: []
          };
          packs.push(createdPack);

          // Move sticker
          if (!currentPack.builtin) {
            currentPack.stickers = currentPack.stickers.filter(s => s.id !== sticker.id);
          }
          createdPack.stickers.push(sticker);
          activePackId = createdPack.id;

          await saveCustomPacksToStorage();
          renderDashboard();
          renderPopover();
          showToast(`Stiker dipindahkan ke paket "${createdPack.name}"!`);
          openStickerDetailModal(sticker, createdPack);
          return;
        }

        const targetP = packs.find(p => p.id === selectedVal);
        if (targetP && targetP.id !== currentPack.id) {
          if (targetP.builtin) {
            alert('Paket bawaan bersifat read-only. Silakan pilih paket kustom.');
            packSelect.value = currentPack.id;
            return;
          }

          // Move sticker
          if (!currentPack.builtin) {
            currentPack.stickers = currentPack.stickers.filter(s => s.id !== sticker.id);
          }
          if (!targetP.stickers.some(s => s.id === sticker.id)) {
            targetP.stickers.push(sticker);
          }
          activePackId = targetP.id;

          await saveCustomPacksToStorage();
          renderDashboard();
          renderPopover();
          showToast(`Stiker dipindahkan ke paket "${targetP.name}"!`);
          openStickerDetailModal(sticker, targetP);
        }
      });
    }

    // Send to Chat
    overlay.querySelector('#druppy-detail-btn-send').addEventListener('click', async () => {
      await sendSticker(sticker);
      closeDetail();
    });

    // Crop & Edit
    overlay.querySelector('#druppy-detail-btn-crop').addEventListener('click', () => {
      closeDetail();
      openCropModal(sticker, currentPack);
    });

    // Delete
    const deleteBtn = overlay.querySelector('#druppy-detail-btn-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Hapus stiker "${sticker.name || 'ini'}" dari paket?`)) {
          currentPack.stickers = currentPack.stickers.filter(s => s.id !== sticker.id);
          saveCustomPacksToStorage();
          closeDetail();
          renderDashboard();
          renderPopover();
          showToast('Stiker berhasil dihapus.');
        }
      });
    }
  }

  // =========================================================================
  // 6. INTERACTIVE CROP STICKER TOOL
  // =========================================================================
  function openCropModal(stickerOrFile, currentPack) {
    let overlay = document.getElementById('druppy-crop-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'druppy-crop-overlay';
      document.body.appendChild(overlay);
    }

    const isExistingSticker = Boolean(stickerOrFile && (stickerOrFile.dataUrl || stickerOrFile.file));
    let initialName = isExistingSticker
      ? (stickerOrFile.name || 'Stiker')
      : (stickerOrFile.name ? stickerOrFile.name.replace(/\.[^/.]+$/, '') : 'Stiker Baru');

    overlay.innerHTML = `
      <div class="druppy-crop-modal">
        <div class="druppy-crop-header">
          <div class="druppy-crop-header-title">
            <img src="${LOGO_URL}" style="width:22px; height:22px; border-radius:5px; object-fit:cover;" alt="WhatsappReextended" />
            <span>Crop & Edit - WhatsappReextended</span>
          </div>
          <button class="druppy-btn-icon" id="druppy-crop-close" title="Tutup">${ICONS.close}</button>
        </div>

        <div class="druppy-crop-toolbar">
          <div class="druppy-crop-toolgroup">
            <span style="font-size:11px; color:#8696a0; font-weight:600; text-transform:uppercase;">Rasio:</span>
            <button type="button" class="druppy-crop-btn active" id="druppy-crop-ratio-1">1:1 Kotak (WA)</button>
            <button type="button" class="druppy-crop-btn" id="druppy-crop-ratio-free">Bebas</button>
          </div>
          <div class="druppy-crop-toolgroup">
            <button type="button" class="druppy-crop-btn" id="druppy-crop-btn-rotate">${ICONS.rotate} Putar 90°</button>
            <button type="button" class="druppy-crop-btn" id="druppy-crop-btn-reset">${ICONS.reset} Reset</button>
          </div>
        </div>

        <div class="druppy-crop-workspace druppy-checkerboard" id="druppy-crop-workspace">
          <div class="druppy-crop-container" id="druppy-crop-container">
            <img id="druppy-crop-img" alt="Crop target" />
            <div id="druppy-crop-box" class="druppy-crop-box">
              <div class="druppy-crop-handle nw" data-dir="nw"></div>
              <div class="druppy-crop-handle ne" data-dir="ne"></div>
              <div class="druppy-crop-handle se" data-dir="se"></div>
              <div class="druppy-crop-handle sw" data-dir="sw"></div>
              <div class="druppy-crop-handle n" data-dir="n"></div>
              <div class="druppy-crop-handle s" data-dir="s"></div>
              <div class="druppy-crop-handle w" data-dir="w"></div>
              <div class="druppy-crop-handle e" data-dir="e"></div>
            </div>
          </div>
        </div>

        <div class="druppy-crop-footer">
          <button type="button" class="druppy-btn-action" id="druppy-crop-cancel" style="padding:8px 16px;">Batal</button>
          <button type="button" class="druppy-btn-primary" id="druppy-crop-apply" style="width:auto; padding:8px 20px;">
            ${ICONS.check}
            <span>Terapkan & Simpan</span>
          </button>
        </div>
      </div>
    `;

    overlay.classList.add('show');

    const closeCrop = () => {
      overlay.classList.remove('show');
    };

    overlay.querySelector('#druppy-crop-close').addEventListener('click', closeCrop);
    overlay.querySelector('#druppy-crop-cancel').addEventListener('click', closeCrop);

    // State
    let rotation = 0;
    let isSquareRatio = true;
    let rawImage = new Image();
    const cropImg = overlay.querySelector('#druppy-crop-img');
    const cropBox = overlay.querySelector('#druppy-crop-box');
    const cropContainer = overlay.querySelector('#druppy-crop-container');

    // Load source
    const loadSource = async () => {
      let src;
      if (isExistingSticker) {
        src = stickerOrFile.file
          ? (typeof chrome !== 'undefined' && chrome.runtime ? chrome.runtime.getURL(stickerOrFile.file) : stickerOrFile.file)
          : stickerOrFile.dataUrl;
      } else if (typeof stickerOrFile === 'string') {
        src = stickerOrFile;
      } else {
        src = await toDataURL(URL.createObjectURL(stickerOrFile));
      }

      rawImage.onload = () => {
        renderRotatedView();
      };
      rawImage.src = src;
    };
    loadSource();

    function renderRotatedView() {
      // Tanpa putar: tampilkan gambar asli supaya GIF/WebP bergerak tetap terlihat bergerak
      if (rotation % 360 === 0) {
        cropImg.onload = () => {
          resetCropBox();
        };
        cropImg.src = rawImage.src;
        return;
      }
      // Create offscreen canvas for rotation
      const offCanvas = document.createElement('canvas');
      const isSideways = rotation % 180 !== 0;
      offCanvas.width = isSideways ? rawImage.naturalHeight : rawImage.naturalWidth;
      offCanvas.height = isSideways ? rawImage.naturalWidth : rawImage.naturalHeight;

      const offCtx = offCanvas.getContext('2d');
      offCtx.translate(offCanvas.width / 2, offCanvas.height / 2);
      offCtx.rotate((rotation * Math.PI) / 180);
      offCtx.drawImage(rawImage, -rawImage.naturalWidth / 2, -rawImage.naturalHeight / 2);

      cropImg.onload = () => {
        resetCropBox();
      };
      cropImg.src = offCanvas.toDataURL('image/png');
    }

    function resetCropBox() {
      const containerW = cropImg.offsetWidth || 300;
      const containerH = cropImg.offsetHeight || 300;

      let boxSize = Math.min(containerW, containerH) * 0.85;
      let left = (containerW - boxSize) / 2;
      let top = (containerH - boxSize) / 2;

      if (!isSquareRatio) {
        boxSize = Math.min(containerW, containerH) * 0.9;
        left = (containerW - boxSize) / 2;
        top = (containerH - boxSize) / 2;
      }

      cropBox.style.left = `${Math.round(left)}px`;
      cropBox.style.top = `${Math.round(top)}px`;
      cropBox.style.width = `${Math.round(boxSize)}px`;
      cropBox.style.height = `${Math.round(boxSize)}px`;
    }

    // Drag & Resize logic
    let isDragging = false;
    let dragMode = null; // 'move' or handle direction
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    let initialWidth = 0;
    let initialHeight = 0;

    cropBox.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const handle = e.target.closest('.druppy-crop-handle');
      dragMode = handle ? handle.dataset.dir : 'move';
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseFloat(cropBox.style.left) || 0;
      initialTop = parseFloat(cropBox.style.top) || 0;
      initialWidth = parseFloat(cropBox.style.width) || cropBox.offsetWidth;
      initialHeight = parseFloat(cropBox.style.height) || cropBox.offsetHeight;
      cropBox.setPointerCapture(e.pointerId);
    });

    cropBox.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const maxW = cropImg.offsetWidth;
      const maxH = cropImg.offsetHeight;

      if (dragMode === 'move') {
        let newLeft = Math.max(0, Math.min(maxW - initialWidth, initialLeft + dx));
        let newTop = Math.max(0, Math.min(maxH - initialHeight, initialTop + dy));
        cropBox.style.left = `${Math.round(newLeft)}px`;
        cropBox.style.top = `${Math.round(newTop)}px`;
      } else {
        // Resizing
        let newW = initialWidth;
        let newH = initialHeight;
        let newL = initialLeft;
        let newT = initialTop;

        if (dragMode.includes('e')) newW = Math.max(40, Math.min(maxW - initialLeft, initialWidth + dx));
        if (dragMode.includes('s')) newH = Math.max(40, Math.min(maxH - initialTop, initialHeight + dy));
        if (dragMode.includes('w')) {
          const clampedDx = Math.min(initialWidth - 40, Math.max(-initialLeft, dx));
          newL = initialLeft + clampedDx;
          newW = initialWidth - clampedDx;
        }
        if (dragMode.includes('n')) {
          const clampedDy = Math.min(initialHeight - 40, Math.max(-initialTop, dy));
          newT = initialTop + clampedDy;
          newH = initialHeight - clampedDy;
        }

        if (isSquareRatio) {
          const sq = Math.min(newW, newH);
          newW = sq;
          newH = sq;
        }

        cropBox.style.left = `${Math.round(newL)}px`;
        cropBox.style.top = `${Math.round(newT)}px`;
        cropBox.style.width = `${Math.round(newW)}px`;
        cropBox.style.height = `${Math.round(newH)}px`;
      }
    });

    const endDrag = (e) => {
      if (isDragging) {
        isDragging = false;
        dragMode = null;
        try { cropBox.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    };
    cropBox.addEventListener('pointerup', endDrag);
    cropBox.addEventListener('pointercancel', endDrag);

    // Aspect Ratio Toggles
    const btnRatio1 = overlay.querySelector('#druppy-crop-ratio-1');
    const btnRatioFree = overlay.querySelector('#druppy-crop-ratio-free');

    btnRatio1.addEventListener('click', () => {
      isSquareRatio = true;
      btnRatio1.classList.add('active');
      btnRatioFree.classList.remove('active');
      resetCropBox();
    });

    btnRatioFree.addEventListener('click', () => {
      isSquareRatio = false;
      btnRatioFree.classList.add('active');
      btnRatio1.classList.remove('active');
      resetCropBox();
    });

    // Rotate button
    overlay.querySelector('#druppy-crop-btn-rotate').addEventListener('click', () => {
      rotation = (rotation + 90) % 360;
      renderRotatedView();
    });

    // Reset button
    overlay.querySelector('#druppy-crop-btn-reset').addEventListener('click', () => {
      rotation = 0;
      renderRotatedView();
    });

    // Apply & Save
    overlay.querySelector('#druppy-crop-apply').addEventListener('click', async () => {
      showToast('Menyimpan stiker hasil crop...');

      try {
        // Intermediate canvas for rotation
        const isSideways = rotation % 180 !== 0;
        const rotCanvas = document.createElement('canvas');
        rotCanvas.width = isSideways ? rawImage.naturalHeight : rawImage.naturalWidth;
        rotCanvas.height = isSideways ? rawImage.naturalWidth : rawImage.naturalHeight;

        const rotCtx = rotCanvas.getContext('2d');
        rotCtx.translate(rotCanvas.width / 2, rotCanvas.height / 2);
        rotCtx.rotate((rotation * Math.PI) / 180);
        rotCtx.drawImage(rawImage, -rawImage.naturalWidth / 2, -rawImage.naturalHeight / 2);

        // Crop coordinates mapped from DOM display to rotCanvas
        const dispW = cropImg.offsetWidth;
        const dispH = cropImg.offsetHeight;
        const scaleX = rotCanvas.width / dispW;
        const scaleY = rotCanvas.height / dispH;

        const boxX = parseFloat(cropBox.style.left) || 0;
        const boxY = parseFloat(cropBox.style.top) || 0;
        const boxW = parseFloat(cropBox.style.width) || cropBox.offsetWidth;
        const boxH = parseFloat(cropBox.style.height) || cropBox.offsetHeight;

        const srcX = Math.max(0, boxX * scaleX);
        const srcY = Math.max(0, boxY * scaleY);
        const srcW = Math.min(rotCanvas.width - srcX, boxW * scaleX);
        const srcH = Math.min(rotCanvas.height - srcY, boxH * scaleY);

        // Output to Ultra HD 1024x1024 WebP sticker format
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = 1024;
        finalCanvas.height = 1024;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.imageSmoothingEnabled = true;
        finalCtx.imageSmoothingQuality = 'high';
        finalCtx.clearRect(0, 0, 1024, 1024);

        // Maintain aspect ratio with 32px safety padding
        const pad = 32;
        const maxDim = 1024 - (pad * 2);
        let destW = srcW;
        let destH = srcH;

        if (destW > destH) {
          destH = (destH / destW) * maxDim;
          destW = maxDim;
        } else {
          destW = (destW / destH) * maxDim;
          destH = maxDim;
        }

        const destX = (1024 - destW) / 2;
        const destY = (1024 - destH) / 2;

        finalCtx.drawImage(rotCanvas, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
        let webpDataUrl = null;

        // Gambar bergerak: crop & putar diterapkan ke setiap frame
        try {
          const bytes = await inputToBytes(rawImage.src);
          const mime = sniffImageMime(bytes);
          webpDataUrl = await convertAnimatedToStickerWebP(bytes, mime, { rotation, srcX, srcY, srcW, srcH });
        } catch (animErr) {
          if (animErr && /terlalu besar/.test(animErr.message)) throw animErr;
          console.warn('[WhatsappReextended] Crop animasi gagal, pakai gambar diam:', animErr);
        }
        if (!webpDataUrl) webpDataUrl = finalCanvas.toDataURL('image/webp', 0.98);

        // Save target
        let targetPack = currentPack;
        if (targetPack.builtin) {
          // If builtin, ask user to create or select a custom pack
          const customPacks = packs.filter(p => !p.builtin);
          if (customPacks.length > 0) {
            targetPack = customPacks[0];
            activePackId = targetPack.id;
          } else {
            targetPack = {
              id: 'pack-' + Date.now(),
              name: 'Paket Stiker Saya',
              builtin: false,
              stickers: []
            };
            packs.push(targetPack);
            activePackId = targetPack.id;
          }
        }

        if (isExistingSticker && !currentPack.builtin) {
          stickerOrFile.dataUrl = webpDataUrl;
          stickerOrFile.file = undefined;
          showToast('Stiker berhasil di-crop & disimpan!');
        } else {
          targetPack.stickers.push({
            id: 'stk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
            name: initialName,
            dataUrl: webpDataUrl
          });
          showToast(`Stiker baru disimpan ke "${targetPack.name}"!`);
        }

        await saveCustomPacksToStorage();
        closeCrop();
        renderDashboard();
        renderPopover();

      } catch (err) {
        console.error('[Druppy] Gagal meng-crop stiker:', err);
        showToast('Gagal meng-crop stiker: ' + err.message);
      }
    });
  }

  // =========================================================================
  // 7. CONTEXT MENU "TITIK 3" - TAMBAH KE WHATSAPP REEXTENDED
  // =========================================================================
  let lastTargetSticker = null;

  // Track user interactions on message "titik 3" / chevron / right click
  document.addEventListener('mousedown', (e) => {
    // 1. User clicked message menu trigger ("titik 3" / chevron down)
    const menuBtn = e.target.closest('[data-icon="down-context"], [data-icon="chevron-down"], [data-icon="down"], [aria-haspopup="true"], [role="button"]');
    if (menuBtn) {
      const msg = menuBtn.closest('div[data-id], [role="row"], div[class*="message"]');
      if (msg) {
        lastTargetSticker = msg.querySelector('img[src*="blob:"], img[src*="data:"], img');
      }
    }

    // 2. Or user clicked directly on a sticker / image
    const clickedImg = e.target.closest('img');
    if (clickedImg && (clickedImg.src.includes('blob:') || clickedImg.src.includes('data:'))) {
      lastTargetSticker = clickedImg;
    }
  }, true);

  document.addEventListener('contextmenu', (e) => {
    const msg = e.target.closest('div[data-id], [role="row"], div[class*="message"]');
    if (msg) {
      lastTargetSticker = msg.querySelector('img[src*="blob:"], img[src*="data:"], img');
    } else if (e.target instanceof HTMLImageElement) {
      lastTargetSticker = e.target;
    }
  }, true);

  async function extractDataUrlFromImg(img) {
    if (!img) return null;
    if (img.src && img.src.startsWith('data:image/')) {
      return img.src;
    }
    // Baca file asli dulu: lewat canvas, stiker bergerak akan jadi diam
    if (img.src) {
      try {
        const blob = await (await fetch(img.src)).blob();
        if (blob && blob.size > 0 && blob.type.startsWith('image/')) {
          return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        }
      } catch (e) {
        console.warn('[WhatsappReextended] Fetch gambar gagal, pakai canvas:', e);
      }
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 512;
      canvas.height = img.naturalHeight || img.height || 512;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/webp', 0.95);
      if (dataUrl && dataUrl.length > 100) return dataUrl;
    } catch (e) {
      console.warn('[WhatsappReextended] Canvas extraction notice, falling back to fetch:', e);
    }

    if (img.src) {
      const res = await fetch(img.src);
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    return null;
  }

  async function handleAddStickerFromMessage() {
    showToast('Mengambil stiker dari pesan...');
    let img = lastTargetSticker;

    // Fallback 1: check active message row with open dropdown
    if (!img) {
      const activeBtn = document.querySelector('[aria-expanded="true"], [data-icon="down-context"]');
      const msgRow = activeBtn?.closest('div[data-id], [role="row"], div[class*="message"]');
      if (msgRow) {
        img = msgRow.querySelector('img[src*="blob:"], img');
      }
    }

    // Fallback 2: geometric distance check relative to open menu
    if (!img) {
      const menuEl = document.getElementById('druppy-context-add-sticker') || document.querySelector('[role="menu"]');
      if (menuEl) {
        const menuRect = menuEl.getBoundingClientRect();
        const allImgs = Array.from(document.querySelectorAll('#main img[src*="blob:"], #main img'));
        let closest = null;
        let minDiff = Infinity;
        allImgs.forEach(candidate => {
          const r = candidate.getBoundingClientRect();
          const diff = Math.abs(r.top - menuRect.top);
          if (diff < minDiff) {
            minDiff = diff;
            closest = candidate;
          }
        });
        img = closest;
      }
    }

    if (!img) {
      showToast('Tidak dapat menemukan gambar stiker dari pesan.');
      return;
    }

    try {
      const rawDataUrl = await extractDataUrlFromImg(img);
      if (!rawDataUrl) {
        showToast('Gagal membaca gambar stiker.');
        return;
      }

      // Convert to 512x512 WebP sticker format
      const webpDataUrl = await convertImageToStickerWebP(rawDataUrl);

      // Target pack (active custom pack or first custom pack, or create new)
      let targetPack = packs.find(p => p.id === activePackId && !p.builtin);
      if (!targetPack) {
        targetPack = packs.find(p => !p.builtin);
      }
      if (!targetPack) {
        targetPack = {
          id: 'pack-' + Date.now(),
          name: 'Stiker Tersimpan',
          builtin: false,
          stickers: []
        };
        packs.push(targetPack);
        activePackId = targetPack.id;
      }

      const newSticker = {
        id: 'stk-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        name: 'Stiker ' + (targetPack.stickers.length + 1),
        dataUrl: webpDataUrl
      };

      targetPack.stickers.push(newSticker);
      await saveCustomPacksToStorage();
      renderDashboard();
      renderPopover();

      showToast(`Stiker disimpan ke "${targetPack.name}"!`);

      // Open detail modal so user can view, rename, crop, or test send
      openStickerDetailModal(newSticker, targetPack);

    } catch (err) {
      console.error('[WhatsappReextended] Error saving sticker:', err);
      showToast('Gagal menyimpan stiker: ' + err.message);
    }
  }

  function checkAndInjectContextMenu() {
    if (document.getElementById('druppy-context-add-sticker')) return;

    // Search for matching menu items in the active WhatsApp dropdown menu ("titik 3")
    const allEls = Array.from(document.querySelectorAll('div[role="button"], li, div[data-animate-dropdown-item="true"], div'));
    let anchorNode = null;

    // STRICT CHECK: ONLY match if this menu specifically contains sticker actions!
    // Never inject into text messages, audio messages, document menus, or chat headers!
    for (const el of allEls) {
      if (el.children.length > 3) continue;
      const t = (el.textContent || '').trim().toLowerCase();
      if (t === 'salin gambar stiker' || 
          t === 'copy sticker image' || 
          t === 'tambah ke favorit' || 
          t === 'hapus dari favorit' ||
          t === 'add to favorites' || 
          t === 'remove from favorites') {
        anchorNode = el;
        break;
      }
    }

    // If it is NOT a sticker menu (e.g. text message menu), DO NOT INJECT ANYTHING!
    if (!anchorNode) return;

    // Find the item row wrapper inside the menu list container
    let itemWrapper = anchorNode.closest('div[data-animate-dropdown-item="true"]') || anchorNode.closest('li');
    if (!itemWrapper) {
      let curr = anchorNode;
      while (curr && curr.parentElement && curr.parentElement !== document.body) {
        if (curr.parentElement.children.length >= 3) {
          itemWrapper = curr;
          break;
        }
        curr = curr.parentElement;
      }
    }

    if (!itemWrapper || !itemWrapper.parentElement) return;
    const menuList = itemWrapper.parentElement;
    if (menuList.querySelector('#druppy-context-add-sticker')) return;

    // Build the menu item for the 3-dots dropdown menu (ONLY on stickers!)
    const newItem = document.createElement(itemWrapper.tagName.toLowerCase() === 'li' ? 'li' : 'div');
    newItem.id = 'druppy-context-add-sticker';
    newItem.className = `${itemWrapper.className} druppy-context-item-wrapper`;
    newItem.setAttribute('role', 'button');
    newItem.setAttribute('tabindex', '-1');
    newItem.style.setProperty('opacity', '1', 'important');
    newItem.style.setProperty('transform', 'none', 'important');
    newItem.style.setProperty('visibility', 'visible', 'important');
    newItem.style.setProperty('display', 'block', 'important');

    newItem.innerHTML = `
      <div class="druppy-context-menu-item">
        <div class="druppy-context-menu-inner">
          <img src="${LOGO_URL}" class="druppy-context-menu-icon" alt="WhatsappReextended" />
          <span>Tambah ke Reextended</span>
        </div>
      </div>
    `;

    newItem.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      await handleAddStickerFromMessage();
      lastTargetSticker = null;
      // Dismiss context menu
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    // Place it directly after "Salin gambar stiker" or "Tambah ke favorit"
    const targetAnchorRow = Array.from(menuList.children).find(ch => {
      const txt = (ch.textContent || '').trim().toLowerCase();
      return txt.includes('salin gambar stiker') || 
             txt.includes('copy sticker image') || 
             txt.includes('tambah ke favorit') || 
             txt.includes('add to favorites');
    });

    if (targetAnchorRow) {
      targetAnchorRow.insertAdjacentElement('afterend', newItem);
    } else {
      itemWrapper.insertAdjacentElement('afterend', newItem);
    }
  }

  // =========================================================================
  // 8. WHATSAPP NATIVE STICKER PREVIEW MODAL ("TAMBAH KE FAVORIT" DIALOG)
  // =========================================================================
  function checkAndInjectNativeStickerModal() {
    if (document.getElementById('druppy-native-modal-add-btn')) return;

    // Look for "Tambah ke favorit" / "Hapus dari favorit" in the sticker viewer modal
    const allBtns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const favBtn = allBtns.find(b => {
      const txt = (b.textContent || '').trim().toLowerCase();
      return txt === 'tambah ke favorit' || 
             txt === 'hapus dari favorit' || 
             txt === 'add to favorites' || 
             txt === 'remove from favorites';
    });

    if (!favBtn) return;

    const modalContainer = favBtn.closest('div[role="dialog"], div[data-animate-modal-popup="true"]') || favBtn.parentElement;
    if (!modalContainer || modalContainer.querySelector('#druppy-native-modal-add-btn')) return;

    const stickerImg = modalContainer.querySelector('img[src*="blob:"], img[src*="data:"], img');

    const addBtn = document.createElement('button');
    addBtn.id = 'druppy-native-modal-add-btn';
    addBtn.type = 'button';
    addBtn.className = 'druppy-native-modal-btn';
    addBtn.innerHTML = `
      <img src="${LOGO_URL}" class="druppy-btn-logo-small" alt="" />
      <span>Tambah ke Reextended</span>
    `;

    addBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (stickerImg) {
        lastTargetSticker = stickerImg;
      }
      await handleAddStickerFromMessage();
    });

    const parent = favBtn.parentElement;
    if (parent) {
      parent.style.setProperty('display', 'flex', 'important');
      parent.style.setProperty('align-items', 'center', 'important');
      parent.style.setProperty('justify-content', 'center', 'important');
      parent.style.setProperty('gap', '10px', 'important');
      parent.style.setProperty('flex-wrap', 'wrap', 'important');
    }

    favBtn.insertAdjacentElement('afterend', addBtn);
  }

  // Close Popover on click outside (only in popup mode)
  document.addEventListener('click', (e) => {
    if (!isPanelOpen) return;
    if (viewMode === 'sidebar') return;
    const panel = document.getElementById('druppy-panel');
    const footerBtn = document.getElementById('druppy-footer-btn');
    const railBtn = document.getElementById('druppy-rail-btn');

    // Using composedPath handles elements detached during click re-renders (like switching tabs)
    const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
    if (panel && (path.includes(panel) || panel.contains(e.target))) return;
    if (footerBtn && (path.includes(footerBtn) || footerBtn.contains(e.target))) return;
    if (railBtn && (path.includes(railBtn) || railBtn.contains(e.target))) return;

    closePanel();
  });

  // Reposition on window resize if popup is open
  window.addEventListener('resize', () => {
    if (isPanelOpen) {
      positionPanel();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const cropOverlay = document.getElementById('druppy-crop-overlay');
      if (cropOverlay && cropOverlay.classList.contains('show')) {
        cropOverlay.classList.remove('show');
        return;
      }
      const detailOverlay = document.getElementById('druppy-detail-overlay');
      if (detailOverlay && detailOverlay.classList.contains('show')) {
        detailOverlay.classList.remove('show');
        return;
      }
      if (isDashboardOpen) closeDashboard();
      if (isPanelOpen) closePanel();
    }
  });

  // --- CONTINUOUS DOM OBSERVER FOR WHATSAPP WEB ---
  async function init() {
    await loadPacksFromStorage();

    // Check periodically for DOM elements (Chat footer, Left Rail, Context Menu, Native Sticker Modal)
    setInterval(() => {
      injectChatFooterButton();
      injectLeftRailButton();
      checkAndInjectContextMenu();
      checkAndInjectNativeStickerModal();
    }, 350);

    // Also observe DOM mutations for instant menu insertion on click
    const observer = new MutationObserver(() => {
      checkAndInjectContextMenu();
      checkAndInjectNativeStickerModal();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[WhatsappReextended] UI watchers, Titik 3, and Native Sticker Dialog listeners active!');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
