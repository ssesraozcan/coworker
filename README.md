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

## V3 · Son tasarım

- Sabit haftalık takvimli dashboard, cam kartlar, mint işlem butonları; diğer arayüz zeminlerinde düz lacivert.
- Ada, Evim, Dolabım için yüzen oyun kapsülü; sağında ayrı Ana sayfa dönüş butonu. Planlama menüsü oyun içinde kullanılmaz.
- Sade profil ve rutin düzenleme: günlük dakika hedefi ve haftanın günleri cihazda saklanır. Dashboard ve profil aynı hedefi kullanır.
- 40 özgün şeffaf obje: Eşyalarım / Keşfet / Ödüller, kategori ve arama, açılıp kapanan filtreler, yatay vitrin ve 3 sütunlu liste. Kilit yalnızca seçili vitrin objesinde veya liste kartında görünür.
- Yaprakla tek seferlik obje edinme, çalışarak açılan kilometre taşı hediyeleri; evde veya ortak alanda konum seçerek yerleştirme, dolaba geri alma. Obje mülkiyeti paylaşırken korunur.
- Ödüller ve dolap ekranlarında uygulamaya özel, sade açık dolap arka planı. Görseller yereldir.
- Destekleyen iOS cihazlarında native Liquid Glass; diğer platformlarda bulanıklık ve saydam yüzeyler.
- 1–12 ev için ayrı ada görselleri, Premium sonrası dört ev animasyonu ve ortak alana yakınlaşma korunur.
- Premium: aylık ₺150 veya yıllık tek ödeme ₺1.200. Gerçek tahsilat bağlı değildir; yükseltme yalnızca açıkça onaylanan demo adımında uygulanır.
- Daveti paylaş, işletim sisteminin gerçek paylaşım panelini açar. Kod kopyalanabilir. Davet doğrulama ve ada kapasitesi bu sürümde cihaz içi önizlemedir; başka cihazlar aynı canlı adaya bağlanmaz.
- Bildirim tercihi kaydedilir; native bildirim gönderimi henüz bağlı değildir.

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

### Ortak çalışma alanına kamera geçişi

Adadaki “Ortak alan” noktasına dokunulduğunda kamera her ada görseli için tanımlı pergola merkezine yakınlaşır; iç sahneye yumuşak geçiş yapılır. “Adaya dön” aynı hareketi tersine oynatır. Görsel ekrana kaplanırken oluşan kırpma, dokunma alanının konumunda hesaba katılır. İşletim sisteminde hareket azaltma açıksa yakınlaşma yerine kısa bir solma kullanılır. İçeriden başlatılan ortak çalışma oturumu yerel sayaç ve ambiyans desteğini kullanır; canlı diğer üyeler henüz bağlı değildir.
