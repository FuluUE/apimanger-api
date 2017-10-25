import Router from 'koa-router';
import { signup, active, sendActiveEmail, signin, forgot } from '../controllers/account';

const router = new Router({
  prefix: '/account'
});

router
  .get('/active', active)
  .post('/active', sendActiveEmail)
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/forgot', forgot)

export default router;
