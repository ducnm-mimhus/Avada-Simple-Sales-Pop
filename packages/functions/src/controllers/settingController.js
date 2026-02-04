const {getSettingByShopId, updateSettingByShopId} = require('../repositories/settingRepository');
const {getCurrentShopData} = require('@functions/helpers/auth');

/**
 *
 * @param ctx
 * @returns {Promise<{data: FirebaseFirestore.DocumentFieldValue, status: string}|{message: string, status: string}>}
 */
async function getByShopId(ctx) {
  try {
    const currentShop = getCurrentShopData(ctx);
    const shopId = currentShop.shopId || currentShop.shop;
    if (!shopId) {
      ctx.status = 401;
      return (ctx.body = {
        status: 'Error',
        message: 'False in get setting!'
      });
    }

    const shopSetting = await getSettingByShopId(shopId);
    if (!shopSetting) {
      ctx.status = 404;
      return (ctx.body = {
        status: 'Error',
        message: 'Shop ID not found'
      });
    }

    ctx.status = 200;
    return (ctx.body = {
      status: 'Successfully',
      data: shopSetting
    });
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      status: 'Error',
      message: e.message
    };
  }
}

/**
 *
 * @param ctx
 * @returns {Promise<{message, status: string}|{status: string}|{message: string, status: string}>}
 */
async function updateSetting(ctx) {
  try {
    const currentShop = getCurrentShopData(ctx);
    const shopId = currentShop.shopId || currentShop.shop;
    // eslint-disable-next-line no-unused-vars
    const {id, ...settingData} = ctx.request.body;
    if (!shopId) {
      ctx.status = 401;
      return (ctx.body = {
        status: 'Error',
        message: 'False in update setting!'
      });
    }

    const isUpdated = await updateSettingByShopId(shopId, settingData);
    if (!isUpdated) {
      ctx.status = 404;
      return (ctx.body = {
        status: 'Error',
        message: 'Shop ID not found'
      });
    }

    ctx.status = 200;
    return (ctx.body = {
      success: true
    });
  } catch (e) {
    ctx.status = 500;
    return (ctx.body = {
      status: 'Error',
      message: e.message
    });
  }
}

module.exports = {
  getByShopId,
  updateSetting
};
