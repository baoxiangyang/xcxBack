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
    time: {type: Date, default: Date.now}, //结算时间
});
const statementModel = Mongoose.model('statements', statement_Schema);
module.exports = {
  createStatement(data) {
    return new statementModel(data).save();
  }
}