//订单表
let Mongoose = require('mongoose'),
  bills_Schema = new Mongoose.Schema({
    creater: { //创建者
      type : Mongoose.Schema.Types.ObjectId,
      ref : 'users'
    },
    money: Number, //订单金额
    type: Number, //订单类型 0 '日常用品' 1'腐败聚会', 2'生活缴费', 3 '其他'
    detail: String, //订单描述
    isSettlement: {type: Number, default: 0}, //订单是否被结算，0 为结算，1已结算
    room: { //属于房间
      type : Mongoose.Schema.Types.ObjectId,
      ref : 'rooms'
    },
    time: {type: Date, default: Date.now},
  });
const billsModel  = Mongoose.model('bills', bills_Schema);
module.exports = {
  findById(_id) {
    return billsModel.findById(_id);
  },
  findBillList(idArr) {
    //根据_id数组查询订单
    return billsModel.find({_id:{$in:idArr}}, {__v: 0}).populate({
      path: 'creater', select: {nickName: 1, avatarUrl: 1, _id: 0}
    });
  },
  createBill(obj) {
    return new billsModel(obj).save();
  },
  getBillList({find = {}, pageNo = 1, pageSize = 10}) {
    return billsModel.find(find, {name: 1, _id: 1})
      .sort({'time': -1}).skip((pageNo - 1) * pageSize).limit(pageSize);
  }
};