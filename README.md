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

## V2 · Dashboard, ada, Premium ve davet akışları

Uygulama dashboard ile açılır. Takvimde çalışma planı eklenebilir; planlar ve ada önizlemesi cihazda saklanır. Dünyam, alt menünün gizlendiği tam ekran ada deneyimidir. Geri oku dashboard'a döner; ev, dekorasyon, odaklanma ve önceki özelliklere erişim korunur.

- Figma'daki 1–8 ve 12 kişilik ada görselleri `assets/figma` içinde yerel dosyalardır.
- Onaylı Midnight paleti, Outfit/Nunito yazıları, kabartmalı mor butonlar ve bitişik navigasyon kullanılır.
- Premium: aylık ₺150 veya yıllık tek ödeme ₺1.200. **Gerçek satın alma entegrasyonu yoktur.** Kapasite yalnızca kullanıcının açıkça onayladığı demo adımında 12'ye çıkarılır; mağaza aboneliği veya geçerli bir Premium hakkı oluşturmaz.
- Dört yeni ev ada üzerinde sıralı büyüme animasyonuyla görünür. Sistem hareket azaltma tercihi dikkate alınır.
- “Daveti paylaş”, React Native `Share` ile iOS/Android'in gerçek sistem paylaşım panelini açar. Alıcıyı kullanıcı seçer; mesaj otomatik gönderilmez. Kod kopyalama `expo-clipboard` ile çalışır.
- Paylaşılan bağlantı Expo geliştirme adresi / `coworkers` şeması ile üretilir. Üretimde doğrulanmış HTTPS Universal Links / Android App Links alan adı ve sunucu davet servisi gerekir.
- **Üyelik, kod doğrulama ve kapasite yerel demodur.** `KIYI27` örnek kodu yalnızca aynı cihazdaki akışı denemek içindir. Başka telefondaki kullanıcıyı gerçek bir ortak adaya bağlamaz. Sunucusuz bu kod kimlik doğrulama veya yetkilendirme sağlamaz.
- Profil → Ada senaryoları, 1–8 kişilik görselleri ve demo Premium sonrası genişletilmiş kapasiteyi incelemeyi sağlar. Demo üyeler gerçek kullanıcı değildir.

### Doğrulama

```sh
npm run typecheck
npm run lint
npm test
# Ayrı terminal: yerel web önizlemesi
npx expo start --web --localhost --port 8084
npm run test:e2e
# iOS, Android ve web JavaScript paketleri
npx expo export --platform all
```

Mağaza yayını öncesinde hesaplar, sunucuda davet/kapasite denetimi, eşzamanlı ada üyeliği, gerçek mağaza aboneliği ve sunucuda abonelik doğrulaması bağlanmalıdır. Native paylaşım paneli için cihaz üzerinde son kontrol yapılmalıdır; otomatik ekran testleri web önizlemesindedir.
