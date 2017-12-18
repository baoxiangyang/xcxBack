const Koa = require('koa'),
  app = new Koa(),
  router = require('koa-router')(),
  views = require('koa-views'),
  convert = require('koa-convert'),
  json = require('koa-json'),
  bodyparser = require('koa-bodyparser'),
  favicon = require('koa-favicon'),
  mongo = require('./dbs/index.js'),
  process = require('process'),
  path = require('path'),
  fs = require('fs');
import session from 'koa-session2';
import redisStore from './common/store.js';

const index = require('./routes/index'),
  article = require('./routes/article'),
  user = require('./routes/user.js'),
  messageWall = require('./routes/messageWall.js');
// middlewares
app.use(bodyparser());
app.use(convert(json()));

app.use(favicon(__dirname + '/public/images/logo.jpg'));
app.use(require('koa-static')(__dirname + '/public'));


//session
app.use(session({
  key: "xiaobaozongID",
  store: redisStore,
  httpOnly: true
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} ${ctx.status} - ${ms}ms`);  
});

router.use('/', index.routes(), index.allowedMethods());


app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function(err, ctx){
  console.error(err);
});

module.exports = app;