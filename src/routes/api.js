import Router from 'koa-router';
import { getList, getById, add, del, update } from '../controllers/api';

const router = new Router({
  prefix: '/api'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .del('/:id', del)
  .put('/:id', update);

export default router;
