import Router from 'koa-router';
import { getList, set, add, del, edit } from '../controllers/project';

const router = new Router({
  prefix: '/project'
});

router
  .get('/', getList)
  .post('/', add)
  .put('/set', set)
  .put('/:id', edit)
  .del('/:id', del);

export default router;
