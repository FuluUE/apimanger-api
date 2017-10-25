import Router from 'koa-router';
import { getList, add, del, edit } from '../controllers/group';

const router = new Router({
  prefix: '/group'
});

router
  .get('/', getList)
  .post('/', add)
  .put('/:id', edit)
  .del('/:id', del);

export default router;
