import {initShopify} from '@functions/services/shopifyService';
import {INITIAL_SETTINGS} from '../../../INTINAL_SETTING';
import {syncManyOrder} from '@functions/repositories/notificationRepository';
import {updateSettingByShopId} from '@functions/repositories/settingRepository';

/**
 *
 * @param shopDoc
 * @returns {Promise<void>}
 */
export async function handleInstall(shopDoc) {
  const {shopifyDomain} = shopDoc;
  console.log(`[Install] Starting initialization for: ${shopifyDomain}`);

  const shopify = initShopify(shopDoc);

  try {
    await Promise.all([
      syncInitialOrders(shopify, shopifyDomain),
      createDefaultSettings(shopifyDomain)
    ]);

    console.log(`[Install] Successfully initialized for: ${shopifyDomain}`);
  } catch (error) {
    console.error(`[Install] Error for ${shopifyDomain}:`, error);
  }
}

/**
 *
 * @param shopify
 * @param shopDomain
 * @returns {Promise<void>}
 */
async function syncInitialOrders(shopify, shopDomain) {
  try {
    const orders = await shopify.order.list({limit: 50, status: 'any'});
    if (!orders.length) return;
    const productIds = [
      ...new Set(orders.map(order => order.line_items[0]?.product_id).filter(Boolean))
    ];
    const productsMap = await fetchProductsImageMap(shopify, productIds);

    await syncManyOrder({orders, shopDomain, productsMap});
  } catch (error) {
    console.error(`[Install] Order Sync Error for ${shopDomain}:`, error);
  }
}

/**
 *
 * @param shopify
 * @param productIds
 * @returns {Promise<{}>}
 */
async function fetchProductsImageMap(shopify, productIds) {
  const productsMap = {};
  if (!productIds.length) return productsMap;

  const products = await shopify.product.list({
    ids: productIds.join(','),
    fields: 'id,image'
  });

  products.forEach(p => {
    if (p.image?.src) productsMap[p.id] = p.image.src;
  });

  return productsMap;
}

async function createDefaultSettings(shopDomain) {
  return updateSettingByShopId(shopDomain, INITIAL_SETTINGS);
}
