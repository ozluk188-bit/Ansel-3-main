import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

const db = admin.firestore();

/**
 * When a user's profile changes, propagate their snapshot into chats.participantsMeta
 */
export const updateChatParticipantsMeta = functions.firestore
  .document('kullanicilar/{uid}')
  .onUpdate(async (change: any, ctx: any) => {
    const uid = ctx.params.uid as string;
    const after = change.after.data() || {};
    const ad: string | null = after.ad ?? null;
    const photoURL: string | null = (after.photoURL ?? after.profilFotoURL) ?? null;

  const batchSize = 500;
  let lastDoc: any | null = null;

    try {
      while (true) {
        let q = db.collection('chats')
          .where('participants', 'array-contains', uid)
          .orderBy('__name__')
          .limit(batchSize);

        if (lastDoc) q = q.startAfter(lastDoc);

  const snap: any = await q.get();
        if (snap.empty) break;

        const batch = db.batch();
  snap.docs.forEach((chatDoc: any) => {
          const data = chatDoc.data() as any;
          const participantsMeta: Array<any> = Array.isArray(data?.participantsMeta) ? data.participantsMeta : [];
          let updated = false;
          const next = participantsMeta.map((p) => {
            if (p?.uid === uid) {
              updated = true;
              return { ...p, uid, ad, photoURL };
            }
            return p;
          });
          if (!updated) {
            next.push({ uid, ad, photoURL });
          }
          batch.update(chatDoc.ref, { participantsMeta: next });
        });

        await batch.commit();
        lastDoc = snap.docs[snap.docs.length - 1];
        if (snap.size < batchSize) break;
      }
    } catch (e) {
      console.error('updateChatParticipantsMeta error', e);
    }
  });
