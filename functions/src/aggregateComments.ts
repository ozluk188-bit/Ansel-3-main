import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Maintain comment count on icerikler when comments change
 */
export const aggregateComments = functions.firestore
  .document('icerikler/{icerikId}/yorumlar/{yorumId}')
  .onWrite(async (_change: any, ctx: any) => {
    const icerikId = ctx.params.icerikId as string;
    const icerikRef = db.doc(`icerikler/${icerikId}`);

    await db.runTransaction(async (tx) => {
      const yorumCol = db.collection(`icerikler/${icerikId}/yorumlar`);
      const snap = await tx.get(yorumCol);
      const count = snap.size || 0;
      tx.update(icerikRef, { yorumSayisi: count });
    });
  });
