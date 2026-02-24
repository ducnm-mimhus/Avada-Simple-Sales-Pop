import Router from 'koa-router';
import * as clientApiController from '../controllers/clientApi/clientApiController';
import {updateRecord} from '@functions/controllers/recordController';

const router = new Router({
  prefix: '/clientApi'
});

router.get('/notifications', clientApiController.getClientData);
router.get('/health', clientApiController.health);
router.post('/records', updateRecord);

export default router;
