import {
  getStatisticsByShopDomain,
  updateStatisticsByShopDomain
} from '@functions/repositories/statisticsRepository';
import {getCurrentShopData} from '@functions/helpers/auth';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function getStatistics(ctx) {
  try {
    const currentShop = getCurrentShopData(ctx);
    const shopDomain = currentShop.shopDomain || currentShop.shop;
    const {days} = ctx.query;
    const data = await getStatisticsByShopDomain(shopDomain, days);
    ctx.status = 200;
    ctx.body = {success: true, data};
  } catch (err) {
    ctx.status = 500;
    ctx.body = {success: false, message: err.message};
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function updateStatistics(ctx) {
  try {
    const {shopDomain, impressions, clicks} = ctx.request.body;
    if (!shopDomain) {
      ctx.status = 400;
      ctx.body = {success: false, message: 'Missing Shopify Domain!'};
      return;
    }

    await updateStatisticsByShopDomain(shopDomain, {impressions, clicks});
    ctx.status = 200;
    ctx.body = {success: true};
  } catch (err) {
    ctx.status = 500;
    ctx.body = {success: false, message: err.message};
  }
}
