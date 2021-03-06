const router = require('koa-router')(),
  {rooms, users, bills, statements} = require('../dbs/index.js');
//创建房间
router.post('/createRoom', async function(ctx, next){
  let body = ctx.request.body;
    //参数校验，校验通过返回null,不通过返回 错误数组
    /*isValidator = validator(body, {
      name :[{ required: true}, {maxLength: 10}, {minLength: 2}],
      password: [{ required: true}, {maxLength: 10}, {minLength: 3}],
      describe: {maxLength: 200 }
    });*/
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
});

//获取房间列表
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

//加入房间，还未添加校验代码，需要校验 password, roomid
router.post('/joinRoom', async function(ctx, next){
  let {password, roomid} = ctx.request.body;
  try {
    let roomData = await rooms.findById(roomid);
    if(!roomData){
      ctx.body = {
        code: -3,
        msg: '加入房间失败，请重试'
      }
      return;
    }
    if(roomData.password !== password){
      ctx.body = {
        code: -4,
        msg: '口令输入错误，请重新输入'
      }
      return;
    }
    //密码校验通过，将房间id，添加到用户表中，将用户id添加到房间成员表中
    let userid = ctx.session.userInfo._id,
    [foo, bar] = await Promise.all([users.pushRoom({_id: userid}, roomid), rooms.pushRoomMates({_id: roomid}, userid)]);
    ctx.body = {
      code: 0
    }
    //发送模板消息通知其他成员
  }catch(error) {
    console.error(error);
    ctx.body = {
      code: -5,
      msg: '加入房间失败，请重试'
    }
  }
})

//查询未结算订单，未结算金额
router.post('/findNoSettlements', async function(ctx, next){
  let {roomId, pageNo = 1, pageSize = 10} = ctx.request.body,
  //根据房间id，查询房间信息
  roomData = await rooms.findById(roomId);
  if(!roomData){
    ctx.body = {
      code: -10,
      msg: '房间不存在，或已删除，请重新选择'
    }
  }
  //未结算订单，分页查询。(倒序分页查询)
  let billArr = roomData.noSettlements.reverse().splice((pageNo-1) * pageSize, pageSize),
  //根据_id 数组查询订单信息
  billList = [];
  if(billArr.length){
    billList = await bills.findBillList(billArr);
  }
  ctx.body = {
    code: 0,
    total: roomData.noMoney,
    billList,
    name: roomData.name
  }
});

//订单结算
router.post('/settlement', async function(ctx, next){
  let {roomId}= ctx.request.body, userid = ctx.session.userInfo._id,
    //获取房间信息，订单信息
    roomData = await rooms.findBills(roomId),
    //订单保存信息
    saveData = {
      room: roomId,
      totalMoney: 0,
      averageMoney: 0,
      startTime: '',
      endTime: '',
      mateInfos: [],
      bills: []
    };
    if(!roomData || !roomData.noSettlements.length){
      ctx.body = {
        code: -11,
        msg: '没有需要结算的订单'
      }
      return;
    }
    roomData.roommates.push(roomData.creater);
    //统计用户消费
    saveData.mateInfos = roomData.roommates.map(function(id){
      let tempData = {
        mate: id,
        money: 0,
        isStatementer: userid == id ? true : false
      };
      for(let i = 0, len = roomData.noSettlements.length; i < len; i++){
        let item = roomData.noSettlements[i];
        if(item.creater.toString() == id.toString()){
          tempData.money += item.money
        }
      }
      return tempData;
    });
    //计算需要保存的数据
    for(let i = 0, len = roomData.noSettlements.length; i < len; i++){
      let item = roomData.noSettlements[i];
      saveData.totalMoney += item.money;
      saveData.bills.push(item._id);
      (i == 0) && (saveData.startTime = item.time);
      (i == (len-1)) && (saveData.endTime = item.time);
    }
    saveData.totalMoney = parseFloat(saveData.totalMoney.toFixed(2));
    saveData.averageMoney = parseFloat((saveData.totalMoney / (saveData.mateInfos.length)).toFixed(2));
    //保存结算表; 批量修改订单结算状态; 修改房间 未结算列表，未结算金额，已结算金额
    let [saveResult, updateBill, updateRoom] = await Promise.all([
        statements.createStatement(saveData),
        bills.updateSettlement(saveData.bills),
        rooms.updateRoom({_id: roomId}, saveData.bills, saveData.totalMoney)
      ]);
    ctx.body = {
      code: 0,
      msg: '结算成功'
    }
});

//获取房间详情
router.post('/info', async function(ctx, next){
  try{
    let { roomId } = ctx.request.body,
    roomInfo = await rooms.findByIdInfo(roomId);
    ctx.body = {
      code: 0,
      data: roomInfo
    }
  }catch(e) {
    console.error(e);
    ctx.body = {
      code: -12,
      msg: '获取信息失败，请重试'
    }
  }

});
module.exports = router;