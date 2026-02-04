import {updateShopById} from '@functions/repositories/shopRepository';
import {publishTopicAsync} from '@functions/helpers/pubsub/publishTopic';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function appUninstalled(ctx) {
  const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
  try {
    await updateShopById(shopifyDomain, {
      status: 'uninstalled',
      isInstalled: false,
      isActiveInstall: false,
      uninstalledAt: new Date()
    });
    ctx.body = {success: true};
  } catch (e) {
    console.error(`Uninstalled Error [${shopifyDomain}]:`, e);
    ctx.body = {success: false, error: e.message};
  }
  ctx.status = 200;
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function listenNewOrder(ctx) {
  const shopifyDomain = ctx.get('X-Shopify-Shop-Domain');
  const orderData = ctx.request.body;

  ctx.status = 200;
  ctx.body = {success: true};

  await publishTopicAsync('backgroundHandling', {
    type: 'PROCESS_WEBHOOK_ORDER',
    shopDomain: shopifyDomain,
    orderData: orderData
  });
}
