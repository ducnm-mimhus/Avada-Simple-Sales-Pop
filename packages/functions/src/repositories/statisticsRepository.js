import {FieldValue, Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const collection = firestore.collection('statistics');

/**
 *
 * @param shopDomain
 * @param days
 * @returns {Promise<{chartData: *[], totalClicks: number, totalImpressions: number}>}
 */
export async function getStatisticsByShopDomain(shopDomain, days = 7) {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  const snapshot = await collection
    .doc(shopDomain)
    .collection('daily')
    .where('date', '>=', startDate.toISOString().split('T')[0])
    .orderBy('date', 'asc')
    .get();

  if (snapshot.empty) {
    return {totalImpressions: 0, totalClicks: 0, chartData: []};
  }

  const chartData = [];
  let totalImpressions = 0;
  let totalClicks = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    totalImpressions += data.impressions || 0;
    totalClicks += data.clicks || 0;
    chartData.push({
      date: data.date,
      impressions: data.impressions || 0,
      clicks: data.clicks || 0
    });
  });

  return {totalImpressions, totalClicks, chartData};
}

/**
 *
 * @param shopDomain
 * @param impressions
 * @param clicks
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export async function updateStatisticsByShopDomain(shopDomain, {impressions = 0, clicks = 0}) {
  const today = new Date().toISOString().split('T')[0];
  const docRef = collection
    .doc(shopDomain)
    .collection('daily')
    .doc(today);

  return docRef.set(
    {
      date: today,
      impressions: FieldValue.increment(impressions),
      clicks: FieldValue.increment(clicks),
      lastUpdateAt: FieldValue.serverTimestamp()
    },
    {merge: true}
  );
}
