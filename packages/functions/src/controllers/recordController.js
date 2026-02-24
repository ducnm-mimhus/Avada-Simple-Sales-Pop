import {addOneClick, getShopRecord} from '@functions/repositories/recordRepository';
import {getCurrentShopData} from '@functions/helpers/auth';

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function getRecordByShopDomain(ctx) {
  try {
    const currentShop = getCurrentShopData(ctx);
    const shopDomain = currentShop.shopDomain || currentShop.shop;
    if (!shopDomain) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing Shopify Domain!'
      };
    }

    const shopRecords = await getShopRecord(shopDomain);
    ctx.status = 200;
    ctx.body = {
      success: true,
      data: shopRecords
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: err.message
    };
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<void>}
 */
export async function updateRecord(ctx) {
  try {
    const {shopDomain} = ctx.request.body;
    if (!shopDomain) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Missing Shopify Domain!'
      };
    }

    await addOneClick(shopDomain);
    ctx.status = 200;
    ctx.body = {
      success: true
    };
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: err.message
    };
  }
}
