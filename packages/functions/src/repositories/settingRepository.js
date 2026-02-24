import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const collection = firestore.collection('settings');

/**
 *
 * @param shopId
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id: string}|null>}
 */
export async function getSettingByShopId(shopId) {
  const doc = await collection.doc(shopId).get();

  if (!doc.exists) {
    return null;
  }
  return {id: doc.id, ...doc.data()};
}

/**
 *
 * @param shopId
 * @param setting
 * @returns {Promise<boolean>}
 */
export async function updateSettingByShopId(shopId, setting) {
  const dataToSave = {
    shopId,
    ...setting
  };

  await collection.doc(shopId).set(dataToSave, {merge: true});
  return true;
}
