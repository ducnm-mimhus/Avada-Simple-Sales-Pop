import App from 'koa';
import * as errorService from '@functions/services/errorService';
import router from '@functions/routes/webhook';

const api = new App();
api.proxy = true;

api.use(async (ctx, next) => {
  if (ctx.req.body) {
    ctx.request.body = ctx.req.body;
  }
  if (ctx.req.rawBody) {
    ctx.request.rawBody = ctx.req.rawBody;
  }
  await next();
});

api.use(router.allowedMethods());
api.use(router.routes());

api.on('error', errorService.handleError);

export default api;
