import Router from 'koa-router';
import * as sampleController from '@functions/controllers/sampleController';
import * as shopController from '@functions/controllers/shopController';
import * as subscriptionController from '@functions/controllers/subscriptionController';
import * as appNewsController from '@functions/controllers/appNewsController';
import {getRecordByShopDomain} from '@functions/controllers/recordController';
import {getApiPrefix} from '@functions/const/app';
import {verifyRequest} from '@functions/middleware/verifyRequest';
import settingController from '@functions/controllers/settingController';
import notificationController from '@functions/controllers/notificationController';

export default function apiRouter(isEmbed = false) {
  const router = new Router({prefix: getApiPrefix(isEmbed)});

  router.get('/samples', sampleController.exampleAction);
  router.get('/shops', shopController.getUserShops);
  router.get('/subscription', subscriptionController.getSubscription);
  router.get('/appNews', appNewsController.getList);

  router.get('/subscriptions', subscriptionController.getList);
  router.post('/subscriptions', subscriptionController.createOne);
  router.put('/subscriptions', subscriptionController.updateOne);
  router.delete('/subscriptions/:id', subscriptionController.deleteOne);

  router.use(verifyRequest);

  router.get('/settings', settingController.getByShopId);
  router.put('/settings', settingController.updateSetting);
  router.get('/notifications', notificationController.getNotifications);
  router.delete('/notifications', notificationController.deleteBulkNotifications);
  router.get('/records', getRecordByShopDomain);

  return router;
}
