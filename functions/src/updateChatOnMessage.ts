import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

const db = admin.firestore();

/**
 * On new message creation, denormalize chat metadata:
 * - Update chats/{chatId}.lastMessage with text/type/createdAt/sender snapshot
 * - Increment unreadCount for other participants
 */
export const updateChatOnMessage = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap: any, ctx: any) => {
    const chatId = ctx.params.chatId as string;
    const message = snap.data() || {} as any;

    const userId: string | undefined = message.userId;
    if (!userId) return;

    // Load chat to get participants
    const chatRef = db.doc(`chats/${chatId}`);
    const chatSnap = await chatRef.get();
    if (!chatSnap.exists) return;
    const chatData = chatSnap.data() as any;
    const participants: string[] = Array.isArray(chatData?.participants) ? chatData.participants : [];

    // Sender snapshot (optional, for UI convenience)
    let userName: string | null = null;
    let userPhotoURL: string | null = null;
    try {
      const userDoc = await db.doc(`kullanicilar/${userId}`).get();
      if (userDoc.exists) {
        const u = userDoc.data() as any;
        userName = u?.ad ?? null;
        userPhotoURL = (u?.photoURL ?? u?.profilFotoURL) ?? null;
      }
    } catch (e) {
      console.error('updateChatOnMessage: failed to load user snapshot', e);
    }

    const type = message.type || 'text';
    const text: string = message.text ?? '';

    const lastMessage = {
      text: type === 'text' ? text : `[${type}]`,
      type,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userId,
      userName,
      userPhotoURL,
    };

    // Compute unread counts
  const unreadCount: Record<string, number> = { ...(chatData?.unreadCount || {}) };
    for (const uid of participants) {
      if (uid !== userId) {
        unreadCount[uid] = (unreadCount[uid] || 0) + 1;
      }
    }

    try {
      // Persist sender snapshot into message doc for convenience
      await snap.ref.set({ userName, userPhotoURL, type }, { merge: true });

      await chatRef.set({ lastMessage, unreadCount }, { merge: true });
    } catch (e) {
      console.error('updateChatOnMessage: failed to update chat metadata', e);
    }
  });
