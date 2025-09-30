import { db, auth } from '@/src/firebaseConfig';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function voteOnIcerik(icerikId: string, oy: 1 | -1, neden?: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Giriş gerekli');
  const ref = doc(db, 'icerikler', icerikId, 'oylar', user.uid);
  await setDoc(ref, {
    oy,
    neden: neden ?? null,
    tarih: serverTimestamp(),
  }, { merge: true });
}

export async function addYorum(icerikId: string, metin: string, ustYorumId?: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Giriş gerekli');
  const yorumCol = collection(db, 'icerikler', icerikId, 'yorumlar');
  await addDoc(yorumCol, {
    kullaniciId: user.uid,
    metin,
    ustYorumId: ustYorumId ?? null,
    olusturmaTarihi: serverTimestamp(),
    durum: 'aktif',
  });
}

export async function createReport(hedefTip: 'icerik'|'yorum'|'kullanici', hedefPath: string, neden: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Giriş gerekli');
  const raporCol = collection(db, 'raporlar');
  await addDoc(raporCol, {
    raporlayanId: user.uid,
    hedefTip,
    hedefPath,
    neden,
    tarih: serverTimestamp(),
    durum: 'incelemede',
    itiraz: false,
  });
}
