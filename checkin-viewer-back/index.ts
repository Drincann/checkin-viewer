import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaRouter from 'koa-router';
import cors from '@koa/cors';
import { Manager } from './utils';
import { config } from './config';
import _ from 'lodash';
import koaStatic from 'koa-static';
import { join } from 'path';

const app = new Koa();
const manager = new Manager();
let cache: { [id: number]: { name: string }[] | null | undefined } = {};
app.use(async (ctx, next) => {
  const start = new Date().getTime();
  await next();
  const ms = new Date().getTime() - start;
  console.log(`${ctx.method} ${ctx.path} ${ms}ms`)

}).use(cors()).use(koaStatic(join(__dirname, 'public'))).use(bodyParser())
  .use(
    new koaRouter()
      .post('/api/getAccessableQueryList', async ctx => {
        try {
          ctx.body = { code: 0, data: config.querys.map(query => _.pick(query, ['id', 'displayName'])), message: '', };

        } catch (error) {
          ctx.status = 500;
          ctx.body = { code: 1, data: null, message: (error as any)?.message, };
        }
      })
      .post('/api/queryNotCheckinList', async ctx => {
        // if (ctx.request.body?.id === 0) { ctx.body = [{ name: '高厉害' }]; }
        // else { ctx.body = []; }
        // return;/
        try {
          if (ctx.request.body?.id === undefined) {
            ctx.status = 400;
            ctx.body = { code: 0, data: null, message: 'id is required', };
            return;
          }
          if (!cache[ctx.request.body?.id]) {
            cache[ctx.request.body?.id] = (await manager.getList(ctx.request.body?.id))
              ?.map(user => ({ name: _.pick(user, ['uname']).uname }));
            setTimeout(() => {
              cache[ctx.request.body?.id] = null;
            }, 1000 * 120);
          }

          ctx.body = { code: 1, data: cache[ctx.request.body?.id], message: '', };

        } catch (error) {
          ctx.status = 500;
          ctx.body = { code: 1, data: null, message: (error as any)?.message, };
        }
      }).routes()
  )
  .listen(8080);

