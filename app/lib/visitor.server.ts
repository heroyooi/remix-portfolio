import { initializeFirebaseAdmin } from './firebase.server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeFirebaseAdmin();
const db = getFirestore();
const counterRef = db.doc('analytics/visitor');

export async function increaseVisitorCount() {
  const snapshot = await counterRef.get();
  console.log(111);

  if (!snapshot.exists) {
    await counterRef.set({ count: 1 });
  } else {
    await counterRef.update({
      count: FieldValue.increment(1),
    });
  }
}

export async function getVisitorCount() {
  const snapshot = await counterRef.get();
  return snapshot.exists ? snapshot.data()?.count ?? 0 : 0;
}
