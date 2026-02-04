const {db} = require('../config/firebaseConfig');
const SETTING_COLLECTION = db.collection('settings');

/**
 *
 * @param shopId
 * @returns {Promise<{[p: string]: FirebaseFirestore.DocumentFieldValue, id: string}|null>}
 */
async function getSettingByShopId(shopId) {
  const doc = await SETTING_COLLECTION.doc(shopId).get();

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
async function updateSettingByShopId(shopId, setting) {
  const dataToSave = {
    shopId,
    ...setting
  };

  await SETTING_COLLECTION.doc(shopId).set(dataToSave, {merge: true});
  return true;
}

module.exports = {getSettingByShopId, updateSettingByShopId};
