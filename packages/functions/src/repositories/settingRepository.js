const {db} = require('../config/firebaseConfig');
const collection = db.collection('settings');

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
