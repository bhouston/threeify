import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import compress from 'koa-compress';
import logger from 'koa-logger';
import mount from 'koa-mount';
import serve from 'koa-static';
import staticCache from 'koa-static-cache';

import { ASSETS_ROOT, EXAMPLES_ROOT, HOST, PORT } from './config.js';
import { getExampleDescriptions } from './getExampleDescriptions.js';

console.log('EXAMPLES_ROOT', EXAMPLES_ROOT);
console.log('ASSETS_ROOT', ASSETS_ROOT);
(async () => {
  console.log('Specifying Server...');
  const app = new Koa();
  const router = new Router();

  app.use(logger());
  app.use(cors());
  app.use(
    compress({
      filter() {
        return true;
      }
    })
  );

  app.use(mount('/assets', staticCache(ASSETS_ROOT, { maxAge: 60 })));
  app.use(mount('/js', serve(EXAMPLES_ROOT + '/dist')));
  app.use(mount('/', serve(EXAMPLES_ROOT + '/public')));

  router.get('/api/examples', async (ctx: Koa.Context) => {
    const examples = await getExampleDescriptions(EXAMPLES_ROOT + '/src');
    ctx.response.body = examples;
    ctx.response.status = 200;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log('Starting server...');
  const server = app.listen(PORT, () => {
    console.log(`Server running ${HOST}:${PORT}`);
  });

  let isClosed = false;
  const closeGracefully = async (signal: NodeJS.Signals) => {
    console.warn(`Received signal: ${signal}.`);
    if (isClosed) return;
    isClosed = true;
    console.log('Closing server...');
    server.close();
    console.log('Exiting...');
    process.exit(0);
  };

  // handle Ctrl-C, nodemon restart, and Docker stop
  ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'exit'].forEach((signal) => {
    process.on(signal, closeGracefully);
  });
})();
