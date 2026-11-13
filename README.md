# Coworkers

Figma tasarımından geliştirilen iOS, Android ve web önizlemesi. Expo SDK 58 / React Native / TypeScript.

## Başlatma

Node.js 22.13 veya üzerini kullanın (öneri: Node 22 LTS).

```sh
npm ci
npm start
```

Telefona Expo Go yükleyin. Bilgisayar ve telefonu aynı Wi-Fi ağına bağlayın. Terminaldeki QR kodunu iPhone kamerası veya Android Expo Go ile tarayın. Expo Go sürümü SDK 58'i desteklemelidir. Ağ bağlantısı sorunluysa `npx expo start --tunnel` kullanılabilir (ek tünel paketi isteyebilir).

Tarayıcı için `npm run web`. iOS simülatörü için `npm run ios` (Xcode gerekir).

## Bu sürümde

- Tam ekran ada, ev, masa başından odaklanma, dekorasyon, gardırop ve ödüller.
- Gerçek zamanlı sayaç; duraklat/devam et; arka planda geçen süreyi hesaba katan son tarih.
- Tamamlanan oturum başına 25 yaprak; günlük/haftalık/aylık tek seferlik dönem ödülleri.
- Yaprakla eşya alma, sürükleyip yerleştirme, ortak adaya ödünç verme ve geri alma.
- Kıyafet tercihini ve ilerlemeyi cihazda saklama.
- Kendi sentezlediğimiz yağmur/deniz benzeri ses döngüleri. Son ses kütüphanesi değildir.
- Figma'dan gelen şeffaf eşya görselleri yerel dosyalar olarak saklanır; geçici görsel adreslerine bağımlılık yoktur.

## Henüz bağlanmayanlar

Bu sürüm tek cihazda çalışan etkileşim prototipidir. Hesap, sunucu, gerçek arkadaşlar, oda davetleri, eşzamanlı oturumlar, bulut kaydı, gerçek para ödemesi ve bildirimler yoktur. Avatar resmi sabittir; kıyafet tercihi kaydedilir ancak avatar üzerinde henüz değişmez. Çalışma kitabı sahne görselinin parçasıdır; içerik yükleme/okuma özelliği yoktur. Ada ve ev görsellerinin içindeki nesneler ayrı oyun varlıkları değildir; mağazadan eklenen eşyalar hareket ettirilebilir.

## Kontroller

```sh
npm run typecheck
npm test
npm run export:web
```

Görsel kaynak: https://www.figma.com/design/9iiliqGARhFVzKvGfo0Xis/Coworking-Space
