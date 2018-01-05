const router = require('koa-router')(),
  {rooms, bills} = require('../dbs/index.js');

//创建订单
router.post('/createBill', async function(ctx, next){
  let saveData = ctx.request.body;
  saveData.creater = ctx.session.userInfo._id;
  try {
    let saveBill = await bills.createBill(saveData),
      updateRoom = await rooms.pushBill({_id: saveData.room}, saveBill._id, saveData.money);

    ctx.body = {
      code: 0,
      _id: saveBill._id,
      msg: ''
    }
  }catch(error) {
    console.error(error);
    ctx.body = {
      code: -9,
      msg: '保存账单失败，请重试'
    }
  }
});

module.exports = router;