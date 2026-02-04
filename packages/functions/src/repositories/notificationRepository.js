const {db} = require('../config/firebaseConfig');
const NOTIFICATION_COLLECTION = db.collection('notifications');
const DEFAULT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png';

async function getListNotifications(shopId, limit = null, since = null) {
  try {
    let query = NOTIFICATION_COLLECTION.where('shopId', '==', shopId).orderBy('timestamp', 'desc');
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        query = query.where('timestamp', '>', sinceDate);
      }
    }

    if (limit) {
      query = query.limit(Number(limit));
    }

    const snapshot = await query.get();
    if (snapshot.empty) return [];

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate().toISOString() || null,
        createdAt: data.createdAt?.toDate().toISOString() || null
      };
    });
  } catch (err) {
    console.error(`[Repo] getListNotifications Error for ${shopId}:`, err);
    return [];
  }
}

async function syncManyOrder({orders = [], shopDomain, productsMap = {}}) {
  if (!orders.length) return;

  const batch = db.batch();

  orders.forEach(order => {
    const {customer, line_items, id, billing_address, created_at} = order;
    if (!customer || !line_items?.length) return;

    const firstItem = line_items[0];
    const productId = firstItem.product_id;
    const docRef = NOTIFICATION_COLLECTION.doc(`${shopDomain}_${id}`);

    const notificationData = {
      shopDomain,
      shopId: shopDomain,
      productId,
      productName: firstItem.title,
      productImage: productsMap[productId] || DEFAULT_IMAGE,
      firstName: customer.first_name || 'Someone',
      city: billing_address?.city || 'Secret City',
      country: billing_address?.country || '',
      timestamp: new Date(created_at),
      createdAt: new Date()
    };
    batch.set(docRef, notificationData, {merge: true});
  });

  return batch.commit();
}

async function syncOneOrder(notificationData, docId) {
  const dataToSave = {
    ...notificationData,
    timestamp: notificationData.timestamp ? new Date(notificationData.timestamp) : new Date(),
    createdAt: new Date()
  };

  return NOTIFICATION_COLLECTION.doc(docId).set(dataToSave, {merge: true});
}

async function deleteManyNotifications(ids) {
  const batch = db.batch();
  ids.forEach(id => {
    const docRef = NOTIFICATION_COLLECTION.doc(id.toString());
    batch.delete(docRef);
  });
  return batch.commit();
}

module.exports = {getListNotifications, syncManyOrder, syncOneOrder, deleteManyNotifications};
