# ANSEL - Maliyet Optimizasyon Önerileri

Bu doküman, proje planlarına eklenen maliyet optimizasyon önerilerini toplu hâlde sunar. Hedef: Firestore, Cloud Storage ve Cloud Functions maliyetlerini kontrol altına almak ve planlara uygulanabilir eylemler sağlamak.

## Varsayımlar (Örnek)
- Günlük Aktif Kullanıcı (DAU): 5.000 (örnek)
- Ortalama oturum başı istek: 10 okuma, 3 yazma
- Ortalama yüklenen medya boyutu (görsel): 500 KB
- Medya yükleyen kullanıcı oranı: %20

> Not: Gerçek maliyet hesaplamaları için DAU ve kullanım profili ile güncelleyin.

---

## Firestore
- Gerçek zamanlı listener'ları (`onSnapshot`) sadece gerekli ekranlarla sınırlayın; global/kalıcı listener'lar okuma maliyetini artırır.
- Sık erişilen verileri denormalize ederek okuma sayısını azaltın; yazma maliyetini batch yazmalarla optimize edin.
- Gereksiz veya otomatik oluşturulan indeksleri kaldırın; özel indeksleri yalnızca yaygın sorgular için ekleyin.
- TTL (time-to-live) kuralları ile eski verileri otomatik silin; küçük, çok sayıda belge yerine gerektiğinde daha büyük belgeler tercih edin.
- Okuma önbellekleme: React Query veya client-side cache kullanımı planlayın.
- Sayfalama ve lazy-loading kullanarak büyük listelerde okuma sayısını azaltın.

## Cloud Storage
- İstemci tarafı sıkıştırmayı zorunlu hale getirin: resimler için WebP/AVIF, videolarda bitrate çözünürlük düşürme.
- Maksimum çözünürlük kısıtları belirleyin (örn. fotoğraf 1080p, video 720p).
- Yaşam döngüsü (lifecycle) kuralları ile eski veya kullanılmayan medyayı arşivle/sil.
- CDN kullanarak egress maliyetlerini ve gecikmeyi azaltın.
- Doğrudan kullanıcıdan storage'a yükleme (signed URLs) ile backend ve fonksiyon tetiklemelerini azaltın.
- Dosya versiyonlama ve kopya tutma politikalarını gözden geçirip gereksiz kopyaları kaldırın.

## Cloud Functions
- Fonksiyon timeout ve bellek ayarlarını en düşük gerekli seviyeye çekin; fazla bellek & uzun timeout maliyeti artırır.
- Yüksek frekanslı tetiklemeleri batch işlerine çevirin (Pub/Sub + toplu işlem), sık kısa çağrıdan kaçının.
- Log seviyesini düşürün ve log örnekleme (sampling) uygulayın.
- Fonksiyonları mantıksal gruplar hâline getirip gereksiz küçük fonksiyonlardan kaçının.
- Kritik fonksiyonlarda soğuk başlangıç etkisini azaltmak için kept-warm stratejisi düşünün; maliyet/performans dengesini değerlendirin.
- 3. parti API çağrılarını azaltarak bekleme sürelerini ve toplam çalıştırma süresini düşürün.

## İzleme ve Bütçe
- Firestore okumaları/yazmaları, Storage GB ve egress, Functions çağrıları için billing alerts (günlük/haftalık) kurun.
- DAU ve istek profiline göre 1k/5k/20k senaryoları ile maliyet simülasyonları yapın.
- Log örnekleme, metrikleri dashboard'a taşıma ve kritik metrikler (reads/writes, storage GB, function invocations, egress GB) için izleme oluşturun.
- Günlük maliyet eşiklerine ulaşıldığında otomatik bildirim/limit uygulayan script veya politika belirleyin.

## UI/UX Etkileri ve Uygulanabilirlik
- Kullanıcıya yükleme sırasında kalite seçeneği sunarak (düşük/orta/yüksek) veri kullanımını azaltın.
- Gerçek zamanlı güncellemeler yerine sayfalama veya "yenile" butonu seçenekleri sunun.
- Medya yükleme politika ve kısıtlarını onboarding ve yükleme UI'ında görünür şekilde gösterin.

## Eylem Önerileri (Plan Güncellemeleri)
- Planlara "Maliyet Hesaplaması" bölümü ekleyin; DAU, ort. istek, ort. dosya boyutu gibi varsayımları yazın.
- UI/UX planına medya yükleme kısıtları, kalite seçimi ve istemci sıkıştırma yönergeleri ekleyin.
- Geliştirme aşamalarına "maliyet testleri" (yük testleri ve fiyatlandırma simülasyonları) ekleyin.
- Billing alerts ve günlük maliyet raporları kurun.

---

## Hızlı Kontrol Listesi (Implementasyon için)
- [ ] Firestore listener kullanım haritası çıkarıldı mı?
- [ ] Koleksiyon ve indeks incelemesi yapıldı mı?
- [ ] Storage lifecycle kuralları tanımlandı mı?
- [ ] CDN entegrasyonu planlandı mı?
- [ ] Fonksiyon timeout/memory ayarları gözden geçirildi mi?
- [ ] Billing alerts kuruldu mu?
- [ ] Yük testi senaryoları tanımlandı mı?

---

Bu dosya; proje içinde referans olarak kullanılabilir veya `README`/dokümantasyon içine taşınabilir. İsterseniz bu dosyayı daha ayrıntılı maliyet tabloları ve DAU senaryoları ile genişleteyim.