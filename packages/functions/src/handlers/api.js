import App from 'koa';
import createErrorHandler from '@functions/middleware/errorHandler';
import * as errorService from '@functions/services/errorService';
import apiRouter from '@functions/routes/api';
import render from 'koa-ejs';
import path from 'path';
import {verifyEmbedRequest} from '@avada/core';
import shopifyConfig from '@functions/config/shopify';
import appConfig from '@functions/config/app';
import shopifyOptionalScopes from '@functions/config/shopifyOptionalScopes';
import {getShopByShopifyDomain} from '@functions/repositories/shopRepository';
import {registerWebhook} from '@functions/services/webhookService';
import {publishTopicAsync} from '@functions/helpers/pubsub/publishTopic';

const api = new App();

api.use(async (ctx, next) => {
  if (ctx.req.body) {
    ctx.request.body = ctx.req.body;
  }
  await next();
});

api.proxy = true;

render(api, {
  cache: true,
  debug: false,
  layout: false,
  root: path.resolve(__dirname, '../../views'),
  viewExt: 'html'
});

api.use(createErrorHandler());

/**
 *
 * @param ctx
 * @param logSource
 * @returns {Promise<{realToken: *, shop: *}>}
 */
const getShopData = async (ctx, logSource) => {
  const shopDomain =
    ctx.state.shopify?.shop || ctx.state.shopifySession?.shop || ctx.state.user?.shopId;
  const shopDoc = await getShopByShopifyDomain(shopDomain);
  if (!shopDoc) {
    throw new Error(`[${logSource}] Shop not found in DB: ${shopDomain}`);
  }
  return {shop: shopDoc};
};

api.use(
  verifyEmbedRequest({
    returnHeader: true,
    apiKey: shopifyConfig.apiKey,
    scopes: shopifyConfig.scopes,
    secret: shopifyConfig.secret,
    hostName: appConfig.baseUrl,
    isEmbeddedApp: true,
    optionalScopes: shopifyOptionalScopes,
    accessTokenKey: shopifyConfig.accessTokenKey,

    afterLogin: async ctx => {
      try {
        const {shop} = await getShopData(ctx, 'After Login');
        // await Promise.all([registerWebhook(shop, realToken), registerScriptTag(shop, realToken)]);
        await registerWebhook(shop);
      } catch (e) {
        console.error('After Login Error:', e);
      }
    },

    afterInstall: async ctx => {
      try {
        const {shop} = await getShopData(ctx, 'After Install');
        // await Promise.all([
        //   handleInstall(shop, realToken),
        //   registerWebhook(shop, realToken),
        //   registerScriptTag(shop, realToken)
        // ]);
        publishTopicAsync('backgroundHandling', {
          type: 'SYNC_INITIAL_DATA',
          shopDomain: shop.shopifyDomain
        });
      } catch (e) {
        console.error('After Install Error:', e);
      }
    },

    initialPlan: {
      id: 'free',
      name: 'Free',
      price: 0,
      trialDays: 0,
      features: {}
    }
  })
);

const router = apiRouter(true);
api.use(router.allowedMethods());
api.use(router.routes());

api.on('error', errorService.handleError);

export default api;
