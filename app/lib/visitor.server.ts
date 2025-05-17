import { initializeFirebaseAdmin } from './firebase.server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeFirebaseAdmin();
const db = getFirestore();
const counterRef = db.doc('analytics/visitor');

export async function increaseVisitorCount() {
  const today = new Date();
  const yyyyMMdd = today.toISOString().slice(0, 10); // '2025-05-17'

  const dailyRef = db
    .collection('analytics')
    .doc('daily')
    .collection('dailyCounts')
    .doc(yyyyMMdd);
  const snapshot = await dailyRef.get();

  if (!snapshot.exists) {
    await dailyRef.set({ count: 1 });
  } else {
    await dailyRef.update({
      count: FieldValue.increment(1),
    });
  }
}

export async function getVisitorCount() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyRef = db
    .collection('analytics')
    .doc('daily')
    .collection('dailyCounts')
    .doc(today);
  const snapshot = await dailyRef.get();

  return snapshot.exists ? snapshot.data()?.count ?? 0 : 0;
}

export async function getAllDailyVisitorCounts() {
  const snapshot = await db
    .collection('analytics')
    .doc('daily')
    .collection('dailyCounts')
    .get();
  const result: Record<string, number> = {};

  snapshot.forEach((doc) => {
    result[doc.id] = doc.data().count ?? 0;
  });

  return result;
}

export async function getDailyVisitorCounts(days: number) {
  const dailyRef = db
    .collection('analytics')
    .doc('daily')
    .collection('dailyCounts');
  const today = new Date();

  const result: { date: string; count: number }[] = [];

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i)); // 과거부터 순서대로
    const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

    const doc = await dailyRef.doc(dateStr).get();
    result.push({
      date: dateStr,
      count: doc.exists ? doc.data()?.count ?? 0 : 0,
    });
  }

  return result;
}
