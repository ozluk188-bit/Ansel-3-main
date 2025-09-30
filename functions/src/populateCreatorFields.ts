import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

// Ensure creator display fields are populated on icerikler creation
export const populateCreatorFields = functions.firestore
  .document('icerikler/{docId}')
  .onCreate(async (snap, ctx) => {
    const data = snap.data();
    const uid = data?.olusturanId;
    if (!uid) return;

    try {
      const userDoc = await db.doc(`kullanicilar/${uid}`).get();
      const user = userDoc.exists ? userDoc.data() : null;
      const updates: any = {};
      if (user?.ad) updates.olusturanAdi = user.ad;
      if (user?.profilFotoURL) updates.olusturanAvatar = user.profilFotoURL;

      if (Object.keys(updates).length > 0) {
        await snap.ref.update(updates);
      }
    } catch (e) {
      console.error('populateCreatorFields error', e);
    }
  });
