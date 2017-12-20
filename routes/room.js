const router = require('koa-router')(),
  config = require('../config/config.js'),
  base = require('../common/base.js'),
  myRequest = base.myRequest,
  roomdb = require('../dbs/index.js').rooms,
  validator = require('../common/validator.js');
//创建房间
router.post('/createRoom', async function(ctx, next){
  let body = ctx.request.body,
    //参数校验，校验通过返回null,不通过返回 错误数组
    isValidator = validator(body, {
      name :[{ required: true}, {maxLength: 10}],
      password: [{ required: true}, {maxLength: 10}],
      describe: {
        maxLength: 200
      }
    });
    if(isValidator){
      ctx.body = isValidator;
    }else{
      body.creater = ctx.session.userInfo._id;
      let roomData = await roomdb.createRoom(body);
      ctx.body = {
        code: 0,
        _id: roomData._id
      }
    }
});
module.exports = router;