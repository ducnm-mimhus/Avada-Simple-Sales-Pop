const {getListNotifications} = require('../repositories/notificationRepository');
const {getCurrentShopData} = require('@functions/helpers/auth');
const {deleteManyNotifications} = require('@functions/repositories/notificationRepository');

/**
 * API lấy danh sách thông báo
 * @param ctx
 * @returns {Promise<{data: ([]|(*&{id: *})[]), status: string}>}
 */
async function getNotifications(ctx) {
  try {
    const currentShop = getCurrentShopData(ctx);
    const shopId = currentShop.shopId || currentShop.shop;

    if (!shopId) {
      ctx.status = 401;
      return (ctx.body = {
        status: 'Error',
        message: 'Unauthorized: Shop ID is missing'
      });
    }

    const notifications = await getListNotifications({shopId});
    ctx.status = 200;
    return (ctx.body = {
      status: 'Successfully',
      data: notifications
    });
  } catch (error) {
    console.error('Controller Error:', error);
    ctx.status = 500;
    ctx.body = {
      status: 'Error',
      message: error.message
    };
  }
}

async function deleteBulkNotifications(ctx) {
  try {
    const ids = ctx.request.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'No notifications IDs provided'
      };
      return;
    }

    await deleteManyNotifications(ids);
    ctx.status = 200;
    ctx.body = {
      success: true
    };
  } catch (err) {
    console.error('Failed to delete bulk notifications', err);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: err.message
    };
  }
}

module.exports = {getNotifications, deleteBulkNotifications};
