import Router from 'koa-router';
import account from './account';
import group from './group';
import api from './api';
import tag from './tag';
import upload from './upload';
import project from './project';
import ApiError from '../errors/ApiError';

const router = new Router({
  prefix: '/api'
});

router.use(account.routes());
router.use(group.routes());
router.use(api.routes());
router.use(tag.routes());
router.use(upload.routes());
router.use(project.routes());

router.all('*', async () => {
  throw new ApiError('NOT_FOUND');
});

export default router;
