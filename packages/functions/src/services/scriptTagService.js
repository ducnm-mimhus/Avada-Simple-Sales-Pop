import appConfig from '@functions/config/app';
import {initShopify} from '@functions/services/shopifyService';

const SCRIPT_FILE_NAME = 'avada-sale-pop.min.js';
const SCRIPT_URL = `https://${appConfig.baseUrl}/scripttag/${SCRIPT_FILE_NAME}`;

/**
 *
 * @param shopDoc
 * @returns {Promise<void>}
 */
export async function registerScriptTag(shopDoc) {
  const shopify = initShopify(shopDoc);
  const shopDomain = shopDoc.shopifyDomain;

  try {
    const existingTags = await shopify.scriptTag.list();
    await cleanupOldTags(shopify, existingTags);

    const isAlreadyRegistered = existingTags.some(tag => tag.src === SCRIPT_URL);
    if (!isAlreadyRegistered) {
      await shopify.scriptTag.create({
        event: 'onload',
        src: SCRIPT_URL
      });
      console.log(`[ScriptTag] Registered successfully for ${shopDomain}`);
    } else {
      console.log(`[ScriptTag] Already exists for ${shopDomain}`);
    }
  } catch (err) {
    console.error(`[ScriptTag] Registration failed for ${shopDomain}:`, err.message);
  }
}

/**
 *
 * @param shopify
 * @param tags
 * @returns {Promise<void>}
 */
async function cleanupOldTags(shopify, tags) {
  const outdatedTags = tags.filter(
    tag => tag.src.includes(SCRIPT_FILE_NAME) && tag.src !== SCRIPT_URL
  );

  if (outdatedTags.length > 0) {
    await Promise.all(outdatedTags.map(tag => shopify.scriptTag.delete(tag.id)));
    console.log(`[ScriptTag] Cleaned up ${outdatedTags.length} old tags.`);
  }
}
