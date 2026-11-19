# 🚀 WhatsappReextended - WhatsApp Web Sticker Manager & Studio (v1.3.2)

Ekstensi browser Chrome / Chromium (Brave, Edge, Chrome) untuk mengelola banyak paket stiker WhatsApp, melakukan **Crop & Edit**, dan mengirim stiker **asli (bukan foto)** dengan 1 klik langsung di **WhatsApp Web** (`https://web.whatsapp.com/`).

---

## 🌟 Fitur Utama & Pembaruan v1.3.1

1. **Dukungan Balas Pesan dengan Stiker (Reply / Quote Message):**
   - Saat Anda sedang dalam mode membalas pesan (*reply / quote*), stiker yang dikirim kini **otomatis me-reply pesan tersebut** (menempelkan kutipan pesan yang dibalas), bukan lagi terkirim sebagai pesan baru yang terpisah.
   - Setelah stiker balasan terkirim, preview balasan di WhatsApp otomatis ditutup dengan rapi.

2. **Perbaikan Menu Konteks Pesan Teks (Tidak Ada Lagi "Tambah ke WhatsappReextended" pada Teks):**
   - Menu klik kanan / titik 3 pada pesan teks biasa kini bersih dari opsi stiker.
   - Tombol **"Tambah ke WhatsappReextended"** hanya akan muncul secara spesifik pada pesan yang benar-benar merupakan **Stiker** (yang memiliki opsi bawaan seperti "Salin gambar stiker" atau "Tambah ke favorit").

3. **Perbaikan Posisi Tombol Bar Chat (Sejajar Horizontal & Tidak Numpuk):**
   - Tombol WhatsappReextended di-anchor tepat setelah tombol emoji, memastikan posisinya selalu berada di dalam bar input teks secara horizontal berdampingan dengan emoji dan kolom ketik pesan tanpa pernah menumpuk ke bawah atau terpotong.

4. **Logo Baru & Rebranding WhatsappReextended:**
   - Desain logo resmi modern bergaya kosmik dengan ikon chat "R".
   - Integrasi logo pada tombol chat input bar, tombol bilah navigasi kiri (*left rail*), header panel stiker, dan dashboard studio.

5. **Fitur Interaktif Crop Stiker:**
   - Workspace crop visual dengan 8 titik handle dan bounding box yang dapat digeser dan diubah ukurannya secara bebas.
   - Pilihan rasio aspek: **1:1 Kotak (Standar Stiker WhatsApp)** dan **Bebas**.
   - Tombol **Putar 90°** dan **Reset**.
   - Otomatis mengubah gambar apa pun menjadi resolusi standar **512×512 WebP transparan**.

6. **Modal Detail Stiker pada Dashboard:**
   - Mengklik stiker di Dashboard membuka tampilan Detail (tidak langsung terkirim secara tidak sengaja).
   - Menampilkan pratinjau besar dengan latar belakang transparan *checkerboard*.
   - Ubah nama stiker langsung.
   - Tombol dinamis: **"Kirim ke [Nama Kontak/Grup WhatsApp]"** yang otomatis mendeteksi ruang obrolan yang sedang aktif.
   - Tombol **Crop & Edit** dan **Hapus**.

7. **Koleksi Custom SVG Icons:**
   - Semua kontrol UI menggunakan SVG kustom tajam tanpa emoji generik.

8. **Dual Mode Panel:**
   - **Mode Popup:** Melayang di atas chat bar.
   - **Mode Sidebar Kanan:** Menempel di sisi kanan layar untuk akses cepat tanpa menutup chat.

---

## 🚀 Cara Update / Reload Ekstensi di Browser

1. Buka `chrome://extensions/` di address bar browser.
2. Cari ekstensi **WhatsappReextended**.
3. Klik tombol **🔄 Reload (Perbarui)**.
4. Buka kembali tab [web.whatsapp.com](https://web.whatsapp.com/) lalu **Refresh (F5)**.

---

## 📁 Struktur Berkas

- [manifest.json](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/manifest.json) — Konfigurasi Manifest V3 WhatsappReextended.
- [content.js](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/content.js) — Logika UI input bar, modal detail, interactive crop, dan pengiriman stiker.
- [content.css](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/content.css) — Styling Dark Mode, crop workspace, anti-stacking fix, dan styling logo.
- [icons/](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/icons) — Asset logo resmi WhatsappReextended dalam berbagai resolusi (16, 32, 48, 128, dan logo utama).
- [page_bridge.js](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/page_bridge.js) — Jembatan konteks WhatsApp Web untuk memanggil pengiriman stiker asli.
- [wppconnect-wa.js](file:///home/egi/MyKodingGweh/SCIGROUP/wa-sticker-extension/wppconnect-wa.js) — Engine pengiriman stiker WhatsApp Web.
