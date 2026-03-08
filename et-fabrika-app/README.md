# Plan4Flex — Zimmet Yönetim Sistemi

Et kesim fabrikası için çalışan iş ve ev ekipmanları zimmet takip sistemi.

## Kurulum

```bash
npm install
npm run dev
```

## Netlify Deploy

1. Projeyi GitHub'a push edin
2. Netlify'da "New site from Git" seçin
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Ya da `netlify.toml` otomatik olarak ayarları alacak

## Özellikler

- 📊 **Genel Bakış**: Stok, zimmet, imza ve iade özeti
- 👷 **Çalışanlar**: Ekleme, detay, zimmet güncelleme, işten çıkarma
- 📦 **Stok & Zimmet**: Ekipman bazlı dağılım ve detay
- 🏠 **Oda Takibi**: Konut oda doluluk ve zimmet durumu
- ↩ **İade Listesi**: İşten ayrılan çalışanlardan iade alımı
