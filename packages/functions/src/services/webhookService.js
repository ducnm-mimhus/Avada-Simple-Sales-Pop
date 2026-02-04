import appConfig from '@functions/config/app';
import {initShopify} from '@functions/services/shopifyService';

const WEBHOOK_TOPIC = 'orders/create';
const WEBHOOK_URL = `https://${appConfig.baseUrl}/webhook/orders/create`;

/**
 *
 * @param shopDoc
 * @returns {Promise<void>}
 */
export async function registerWebhook(shopDoc) {
  const shopify = initShopify(shopDoc);
  const {shopifyDomain} = shopDoc;

  try {
    console.log(`[Webhook] Syncing for ${shopifyDomain}...`);

    const existingWebhooks = await shopify.webhook.list({topic: WEBHOOK_TOPIC});
    await cleanupOldWebhooks(shopify, existingWebhooks);
    const isAlreadyRegistered = existingWebhooks.some(hook => hook.address === WEBHOOK_URL);

    if (!isAlreadyRegistered) {
      const response = await shopify.webhook.create({
        topic: WEBHOOK_TOPIC,
        address: WEBHOOK_URL,
        format: 'json'
      });
      console.log(`[Webhook] Registered successfully: ${response.id}`);
    } else {
      console.log(`[Webhook] Already active for ${shopifyDomain}`);
    }
  } catch (error) {
    handleWebhookError(error, shopifyDomain);
  }
}

/**
 *
 * @param shopify
 * @param webhooks
 * @returns {Promise<void>}
 */
async function cleanupOldWebhooks(shopify, webhooks) {
  const outdated = webhooks.filter(hook => hook.address !== WEBHOOK_URL);
  if (outdated.length > 0) {
    await Promise.all(outdated.map(hook => shopify.webhook.delete(hook.id)));
    console.log(`[Webhook] Cleaned up ${outdated.length} old entries.`);
  }
}

/**
 *
 * @param error
 * @param shopDomain
 */
function handleWebhookError(error, shopDomain) {
  console.error(`[Webhook] Registration failed for ${shopDomain}:`);
  const details = error.response?.body;
  console.error(details ? JSON.stringify(details, null, 2) : error.message);
}
