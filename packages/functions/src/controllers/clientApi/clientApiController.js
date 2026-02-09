import {getSettingByShopId} from '@functions/repositories/settingRepository';
import {getListNotifications} from '@functions/repositories/notificationRepository';
import {INITIAL_SETTINGS} from '../../../../INTINAL_SETTING';

/**
 * Health check endpoint for client API
 * @param ctx
 * @returns {Promise<{success: boolean, timestamp: string}>}
 */
export async function health(ctx) {
  return (ctx.body = {
    success: true,
    timestamp: new Date().toISOString()
  });
}

/**
 *
 * @param ctx
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function getClientData(ctx) {
  try {
    const {shopDomain, since} = ctx.query;
    if (!shopDomain) {
      return (ctx.body = {success: false, message: 'Missing Shopify Domain!'});
    }
    ctx.set('Cache-Control', 'public, max-age=0, s-maxage=30');
    const settingData = await getSettingByShopId(shopDomain);
    const finalSetting = settingData ? {...INITIAL_SETTINGS, ...settingData} : INITIAL_SETTINGS;
    const notificationsData = await getListNotifications({
      shopId: shopDomain,
      limit: finalSetting.maxPopsDisplay,
      since: since
    });

    ctx.status = 200;
    ctx.body = {
      data: {
        setting: finalSetting,
        notifications: notificationsData
      }
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message
    };
  }
}
