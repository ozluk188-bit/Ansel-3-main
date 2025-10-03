type Dict = Record<string, string>;

const tr: Dict = {
  like_success: 'Beğenin kaydedildi',
  dislike_success: 'Beğenmeme kaydedildi',
  vote_removed: 'Oy kaldırıldı',
  report_sent: 'Rapor gönderildi',
  comment_sent: 'Yorum gönderildi',
  login_required: 'Devam etmek için giriş yapmalısınız',
  empty_chats_title: 'Henüz sohbetiniz yok.',
  empty_chats_sub: 'Yeni bir sohbet başlatmak için buraya dokunun.',
  start_new_chat: 'Yeni sohbet başlat',
  start_chat: 'Sohbeti başlat!',
  type_first_message: 'İlk mesajını yaz ve gönder',
  login: 'Giriş Yap',
  requires_login_title: 'Giriş yapmanız gerekiyor',
  requires_login_sub: 'Profilinizi görüntülemek ve düzenlemek için giriş yapın.',
  create_kalem: 'Yeni Kalem Oluştur',
  create: 'Oluştur',
  cancel: 'İptal',
  no_kalem_title: 'Henüz kalem yok.',
  no_kalem_sub: 'İlkini sen ekleyebilirsin.',
  no_icerik_title: 'Henüz hiç içerik yok.',
  no_icerik_sub: 'İlk içeriği sen ekle!',
  profile_title: 'Profil',
  messages_title: 'Mesajlar',
  kalemler_title: 'Kalemler',
  kalem_title_placeholder: 'Kalem başlığı...',
  search_placeholder: 'Ara...',
  write_something_placeholder: 'Bir şeyler yaz...',
  write_message: 'Mesaj yaz',
  attach_photo: 'Fotoğraf ekle',
  send: 'Gönder',
};

const dicts: Record<string, Dict> = { tr };

let currentLocale = 'tr';

export const setLocale = (locale: string) => {
  currentLocale = dicts[locale] ? locale : 'tr';
};

export const t = (key: keyof typeof tr): string => {
  const d = dicts[currentLocale] || tr;
  return d[key] || key;
};
