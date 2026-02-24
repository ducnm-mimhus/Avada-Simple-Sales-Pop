import App from 'koa';
import router from '../routes/clientApi';
import cors from 'koa2-cors';

const clientApi = new App();

clientApi.proxy = true;

clientApi.use(async (ctx, next) => {
  if (ctx.req.body && !ctx.request.body) {
    ctx.request.body = ctx.req.body;
  }
  await next();
});

clientApi.use(cors());
clientApi.use(router.routes());
clientApi.use(router.allowedMethods());

export default clientApi;
