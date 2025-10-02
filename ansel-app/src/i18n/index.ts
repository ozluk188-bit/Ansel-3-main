type Dict = Record<string, string>;

const tr: Dict = {
  like_success: 'Beğenin kaydedildi',
  dislike_success: 'Beğenmeme kaydedildi',
  vote_removed: 'Oy kaldırıldı',
  report_sent: 'Rapor gönderildi',
  comment_sent: 'Yorum gönderildi',
  login_required: 'Devam etmek için giriş yapmalısınız',
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
