const router = require('koa-router')(),
  config = require('../config/config.js'),
  {myRequest} = require('../common/base.js'),
  {rooms, users} = require('../dbs/index.js'),
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
      try {
        let roomData = await rooms.createRoom(body),
          pushUserRoomList = await users.pushRoom({_id: ctx.session.userInfo._id}, roomData._id);
        ctx.body = {
          code: 0,
          _id: roomData._id
        }
      }catch(e){
        if(e.code == 11000){
          ctx.body = {
            code: 11000,
            msg: '房间名称已存在,请重新输入'
          }
        }else{
          console.error(e);
          ctx.body = {
            code: -1,
            msg: '内部错误请重试'
          }
        }
      }
    }
});

router.post('/getRoomList', async function(ctx, next){
  try{
    let body = ctx.request.body, find = {};
    if(body.name){
      find.name = body.name;
    }
    let list = await rooms.getRoomList({find, pageNo: body.pageNo});
    ctx.body = {
      code: 0,
      roomList: list
    };
  }catch(e){
    console.error(e);
    ctx.body = {
      code: -1,
      msg: '获取房间列表，请下拉刷新重试'
    }
  };
  
});
module.exports = router;