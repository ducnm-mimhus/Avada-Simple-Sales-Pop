import {syncOneOrder} from '@functions/repositories/notificationRepository';

const DEFAULT_PRODUCT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png';

/**
 *
 * @param shopify
 * @param productId
 * @returns {Promise<*|string|string>}
 */
async function getProductImageUrl(shopify, productId) {
  if (!productId || !shopify) return DEFAULT_PRODUCT_IMAGE;

  try {
    const product = await shopify.product.get(productId, {fields: 'image'});
    return product?.image?.src || DEFAULT_PRODUCT_IMAGE;
  } catch (e) {
    console.warn(`[Product Image] Not found for ID: ${productId}. Using placeholder.`);
    return DEFAULT_PRODUCT_IMAGE;
  }
}

/**
 *
 * @param shopify
 * @param shopDomain
 * @param orderData
 * @returns {Promise<void>}
 */
export async function processAndSaveOrder({shopify, shopDomain, orderData}) {
  try {
    const {customer, line_items, id: orderId, billing_address, created_at, name} = orderData;
    if (!customer || !line_items?.length) return;

    const firstItem = line_items[0];
    const imageUrl = await getProductImageUrl(shopify, firstItem.product_id);

    const docId = `${shopDomain}_${orderId}`;
    const notificationData = {
      shopDomain,
      shopId: shopDomain,
      productId: firstItem.product_id,
      productName: firstItem.title,
      productImage: imageUrl,
      firstName: customer.first_name || 'Someone',
      city: billing_address?.city || 'Secret City',
      country: billing_address?.country || '',
      timestamp: created_at
    };

    await syncOneOrder(notificationData, docId);
    console.log(`[Notification] Order processed and saved: ${name}`);
  } catch (error) {
    console.error('[Notification] Error processing order:', error);
  }
}
