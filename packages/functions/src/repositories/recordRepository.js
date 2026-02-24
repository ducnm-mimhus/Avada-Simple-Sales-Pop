import {FieldValue, Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const collection = firestore.collection('clicks');

/**
 *
 * @param shopDomain
 * @returns {Promise<FirebaseFirestore.DocumentData|{clicks: number}>}
 */
export async function getShopRecord(shopDomain) {
  const doc = await collection.doc(shopDomain).get();
  if (!doc.exists) return {clicks: 0};
  return doc.data();
}

/**
 *
 * @param shopDomain
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export async function addOneClick(shopDomain) {
  const docRef = collection.doc(shopDomain);

  return docRef.set(
    {
      clicks: FieldValue.increment(1),
      lastClickAt: FieldValue.serverTimestamp()
    },
    {merge: true}
  );
}
