import {getShopByShopifyDomain} from '@functions/repositories/shopRepository';
import {handleInstall} from '@functions/services/installationService';
import {registerWebhook} from '@functions/services/webhookService';
import {initShopify} from '@functions/services/shopifyService';
import {processAndSaveOrder} from '@functions/services/notificationService';

/**
 * Background handler for PubSub messages
 *
 * Usage:
 *   publishTopic('backgroundHandling', {
 *     type: 'processOrder',
 *     shopId: '...',
 *     data: {...}
 *   })
 *
 * @param event - CloudEvent with PubSub message
 * @returns {Promise<void>}
 */
export default async function subscribeBackgroundHandling(event) {
  try {
    const message = event.data.message.data
      ? Buffer.from(event.data.message.data, 'base64').toString()
      : '{}';
    const payload = JSON.parse(message);
    const {type, shopDomain, orderData} = payload;

    const shopDoc = await getShopByShopifyDomain(shopDomain);
    if (!shopDoc) {
      console.error('Shop not found!');
      return;
    }

    switch (type) {
      case 'SYNC_INITIAL_DATA':
        await handleInstall(shopDoc);
        await registerWebhook(shopDoc);
        break;

      case 'PROCESS_WEBHOOK_ORDER':
        const shopify = initShopify(shopDoc);
        await processAndSaveOrder({shopify, shopDomain, orderData});
        break;

      default:
        console.log('Unknown shop type ', type);
    }
  } catch (e) {
    console.error('Background handling error:', e);
    throw e;
  }
}
