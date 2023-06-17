import crypto from 'node:crypto';

import cors from '@koa/cors';
import Router from '@koa/router';
import Koa from 'koa';
import logger from 'koa-logger';
import serve from 'koa-static';
import proxy from 'koa-proxies';
import mount from 'koa-mount';
import compress from 'koa-compress';
import staticCache from 'koa-static-cache';

import { HOST, PORT, EXAMPLES_ROOT } from './config';
import { getExampleDescriptions } from 'getExampleDescriptions';

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

  app.use(mount('/', serve(EXAMPLES_ROOT + '/public')));
  app.use(mount('/js', serve(EXAMPLES_ROOT + '/dist')));
  app.use(
    mount('/assets', staticCache(EXAMPLES_ROOT + '../assets', { maxAge: 60 }))
  );

  router.get('/api/examples', async (ctx: Koa.Context) => {
    const examples = await getExampleDescriptions('../../examples/src');
    ctx.response.body = {
      message: 'Hello World!',
      random: crypto.randomBytes(16).toString('hex')
    };
    ctx.response.status = 200;
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(serve('../../examples/public'));
  if (process.env.NODE_ENV === 'production') {
    app.use(serve('../../examples/public'));
  } else {
    app.use(
      proxy('/', {
        target: 'http://127.0.0.1:8001/',
        changeOrigin: true
      })
    );
  }

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
