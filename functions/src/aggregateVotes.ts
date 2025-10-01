import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Maintain like/dislike counters and net ratio on icerikler when votes change
 */
export const aggregateVotes = functions.firestore
  .document('icerikler/{icerikId}/oylar/{uid}')
  .onWrite(async (change: any, ctx: any) => {
    const icerikId = ctx.params.icerikId as string;
    const before = change.before.exists ? change.before.data() : null;
    const after = change.after.exists ? change.after.data() : null;

    // Determine delta for like/dislike counts
    let likeDelta = 0;
    let dislikeDelta = 0;

    const val = (x: any) => (x === 1 ? 1 : x === -1 ? -1 : 0);
    const b = before ? val(before.oy) : 0;
    const a = after ? val(after.oy) : 0;

    if (!before && after) {
      // create
      if (a === 1) likeDelta += 1;
      if (a === -1) dislikeDelta += 1;
    } else if (before && !after) {
      // delete
      if (b === 1) likeDelta -= 1;
      if (b === -1) dislikeDelta -= 1;
    } else if (before && after && a !== b) {
      // update
      if (b === 1) likeDelta -= 1;
      if (b === -1) dislikeDelta -= 1;
      if (a === 1) likeDelta += 1;
      if (a === -1) dislikeDelta += 1;
    }

    const icerikRef = db.doc(`icerikler/${icerikId}`);
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(icerikRef);
      if (!snap.exists) return;
      const d = snap.data() || {} as any;
      const begeni = (d.begeniSayisi || 0) + likeDelta;
      const begenmeme = (d.begenmemeSayisi || 0) + dislikeDelta;
      const toplam = Math.max(0, begeni + begenmeme);
      const net = toplam > 0 ? begeni / toplam : 0;
      tx.update(icerikRef, {
        begeniSayisi: Math.max(0, begeni),
        begenmemeSayisi: Math.max(0, begenmeme),
        netBegeniOrani: net,
      });
    });
  });
