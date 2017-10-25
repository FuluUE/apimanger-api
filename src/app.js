import Koa from 'koa';
import cors from 'kcors';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import serve from 'koa-static';
import routes from './routes';
import mongoose from './config/mongoose';
import responseFormat from './middlewares/responseFormat';
import authorize from './middlewares/authorize';
import config from './config';

mongoose();

const app = new Koa();
app.use(async (ctx, next) => {
  // 响应开始时间
  const start = new Date();
  // 响应间隔时间
  let ms;
  try {
    // 开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    // 记录响应日志
    // logger.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date() - start;
    // 记录异常日志
    // logger.ctxError(ctx, error, ms);
  }
});
app.use(serve('./upload'));

app.use(cors({ credentials: true }));
app.keys = ['hengkxnote'];
const CONFIG = {
  key: 'note',
  maxAge: 86400000
};
app.use(session(CONFIG, app));

app.use(bodyParser());
app.use(responseFormat('^/api'));
app.use(authorize());
app.use(routes.routes());
// app.on('error', (err, ctx) => {
//   console.log('server error', err, ctx)
//   // logger.error('server error', err, ctx);
// });
if (!module.parent) app.listen(config.port || 3000);

export default app;
