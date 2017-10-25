import Router from 'koa-router';
import { base64 } from '../controllers/upload';

const router = new Router({
  prefix: '/upload'
});

router
  .post('/base64', base64)

export default router;
