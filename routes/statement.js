// 结算订单路由
const router = require('koa-router')(),
  {statements} = require('../dbs/index.js');

//获取房间结算订单;
router.post('/list', async function(ctx, next){
  try{
    let {roomId, limit, pageNo} = ctx.request.body,
      list = await statements.findList({room: roomId}, {pageNo, limit});
    ctx.body = {
      code: 0,
      data: list
    }
  }catch(e){
    console.error(e);
    ctx.body = {
      code: -13,
      msg: '获取失败，请重试'
    }
  }
});

//获取结算详情
router.post('/info', async function(ctx, next){
  try{
    let {statementId} = ctx.request.body,
      infoData = await statements.findById(statementId);

  }catch(e) {
    console.error(e);
    ctx.body = {
      code: -14,
      msg: '获取失败，请重试'
    }
  }
});

module.exports = router;