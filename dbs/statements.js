//结算表
let Mongoose = require('mongoose'),
  statement_Schema =  new Mongoose.Schema({
    totalMoney: Number,      //结算总额
    averageMoney: Number,    //平均额
    startTime: Date,         //结算订单开始时间
    endTime: Date,           //结算订单结束时间
    mateInfos:[{             //订单成员信息
      mate: {
        type : Mongoose.Schema.Types.ObjectId,
        ref : 'users'
      },
      money: Number,          //支出金额
      isStatementer: Boolean  //是否为结算人
    }],
    bills: [{                 //结算订单
      type : Mongoose.Schema.Types.ObjectId,
      ref: 'bills'
    }],
    room: { //结算房间
      type : Mongoose.Schema.Types.ObjectId,
      ref: 'rooms'
    },
    time: {type: Date, default: Date.now}, //结算时间
});
const statementModel = Mongoose.model('statements', statement_Schema);
module.exports = {
  createStatement(data) {
    return new statementModel(data).save();
  },
  findList(find, {limit, pageNo = 1, pageSize = 10}){
    if(limit){
      return statementModel.find(find).sort({time: -1}).limit(limit);
    }else{
      return statementModel.find(find).sort({'time': -1}).skip((pageNo - 1) * pageSize).limit(pageSize);
    }
  },
  findById(_id) {
    return statementModel.findById(_id);
  }
}