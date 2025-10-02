# UI/UX Yol Haritası (Ansel)

Bu dosya, uygulamanın UI/UX geliştirmeleri için uygulanmış öğeleri ve sıradaki işleri özetler.

## Tamamlananlar
- Toast Provider ve `useToast()` ile global bildirimler
- Haptics yardımcıları (başarı/hata/selection/light)
- Skeleton bileşenleri (Line/Avatar/Card)
- EmptyState bileşeni
- İçerik Detayı: like/dislike/report/comment aksiyonlarında haptics + toast, oy toggle
- Yorum listesi: yazar adı & avatar canlı lookup
- Kalemler listesi: oluşturucu gizli, Skeleton ve EmptyState entegrasyonu
- Mesajlar listesi: Skeleton ve EmptyState entegrasyonu
- Sekme çubuğu: Mesajlar ikonunda okunmamış rozet toplamı

## Sıradaki işler
- Boş durum CTA’ları: EmptyState üzerine dokunma ile ilgili ekranlara yönlendirme
- Erişilebilirlik: minimum hit area (≥48dp), kontrast, accessibilityLabel’lar, Dynamic Type
- Dark mode varyantları (renk token’ları)
- Görsel caching ve progressive yükleme (expo-image)
- i18n anahtarlarının genişletilmesi (tüm metinler)
- Mesajlar: swipe actions, yazıyor… göstergesi, gönderildi/görüldü

## Kabul Kriterleri (örnek)
- [Toast] Başarılı aksiyonda 2–3 sn görünüp kaybolur; hata durumunda farklı renk
- [Haptics] Gönderim sonrası başarı; hatada error; seçimlerde light/selection
- [Skeleton] Listeler yüklenirken en az 3 placeholder
- [Empty] Boş ekranlarda başlık + açıklama + CTA
- [A11y] Butonlar min 44–48dp; kontrast ≥ 4.5:1; ana aksiyonlarda label mevcut

## Notlar
- Editör uyarıları (JSX/ES lib) yerel ayarlarla ilgilidir; Expo projesi derleme sırasında çözümlenir.
- TS/ES lib için gerekirse `tsconfig.json` üzerinde `lib` genişletilebilir.
