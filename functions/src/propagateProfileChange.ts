import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const propagateProfileChange = functions.firestore
  .document('kullanicilar/{uid}')
  .onUpdate(async (change, ctx) => {
    const uid = ctx.params.uid;
    const newData = change.after.data() || {};
    const newName = newData.ad || null;
    const newAvatar = newData.profilFotoURL || null;

    const batchSize = 500;
    let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;

    try {
      while (true) {
        let q: FirebaseFirestore.Query = db.collection('icerikler')
          .where('olusturanId', '==', uid)
          .orderBy('__name__')
          .limit(batchSize);

        if (lastDoc) q = q.startAfter(lastDoc);

        const snap = await q.get();
        if (snap.empty) break;

        const batch = db.batch();
        snap.docs.forEach((docSnap) => {
          batch.update(docSnap.ref, {
            olusturanAdi: newName,
            olusturanAvatar: newAvatar,
          });
        });

        await batch.commit();

        lastDoc = snap.docs[snap.docs.length - 1];
        if (snap.size < batchSize) break;
      }
    } catch (e) {
      console.error('propagateProfileChange error', e);
    }
  });
