import Router from 'koa-router';
import * as clientApiController from '../controllers/clientApi/clientApiController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', clientApiController.getClientData);
router.get('/health', clientApiController.health);

export default router;
