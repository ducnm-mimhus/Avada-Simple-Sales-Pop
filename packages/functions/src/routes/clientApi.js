import Router from 'koa-router';
import * as clientApiController from '../controllers/clientApi/clientApiController';
import {updateStatistics} from '@functions/controllers/statisticsController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', clientApiController.getClientData);
router.get('/health', clientApiController.health);
router.post('/statistics', updateStatistics);

export default router;
