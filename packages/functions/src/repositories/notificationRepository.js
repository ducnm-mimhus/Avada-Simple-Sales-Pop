import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
const collection = firestore.collection('notifications');
const DEFAULT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png';

/**
 *
 * @param shopId
 * @param limit
 * @param since
 * @returns {Promise<(*&{createdAt, id: *, timestamp})[]|*[]>}
 */
export async function getListNotifications({shopId, limit = null, since = null}) {
  try {
    let query = collection.where('shopId', '==', shopId).orderBy('timestamp', 'desc');
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

/**
 *
 * @param orders
 * @param shopDomain
 * @param productsMap
 * @returns {Promise<FirebaseFirestore.WriteResult[]>}
 */
export async function syncManyOrders({orders = [], shopDomain, productsMap = {}}) {
  if (!orders.length) return;

  const batch = firestore.batch();

  orders.forEach(order => {
    const {customer, line_items, id, billing_address, created_at} = order;
    if (!customer || !line_items?.length) return;

    const firstItem = line_items[0];
    const productId = firstItem.product_id;
    const docRef = collection.doc(`${shopDomain}_${id}`);

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

/**
 *
 * @param notificationData
 * @param docId
 * @returns {Promise<FirebaseFirestore.WriteResult>}
 */
export async function syncOneOrder(notificationData, docId) {
  const dataToSave = {
    ...notificationData,
    timestamp: notificationData.timestamp ? new Date(notificationData.timestamp) : new Date(),
    createdAt: new Date()
  };

  return collection.doc(docId).set(dataToSave, {merge: true});
}

/**
 *
 * @param ids
 * @returns {Promise<FirebaseFirestore.WriteResult[]>}
 */
export async function deleteManyNotifications(ids) {
  const batch = firestore.batch();
  ids.forEach(id => {
    const docRef = collection.doc(id.toString());
    batch.delete(docRef);
  });
  return batch.commit();
}
