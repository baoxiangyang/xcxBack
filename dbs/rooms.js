//房间表
let Mongoose = require('mongoose'),
	rooms_Schema = new Mongoose.Schema({
		name: {type: String, index: { unique: true, dropDups: true }},
		password: String,
		describe: {type: String, default: ''},
		noMoney: {type: Number, default: 0}, //未结算金额
		money: {type:Number, default: 0}, 	//已结算金额
		creater: { //创建者
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		roommates:[{ //成员列表
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'users'
		}],
		noSettlements:[{ //未结算订单列表
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'bills',
			default: []
		}],
		time: {type: Date, default: Date.now},
	});
const RoomsModel  = Mongoose.model('rooms', rooms_Schema);
module.exports = {
	findById(_id) {
		return RoomsModel.findById(_id);
	},
	findByIdInfo(_id) {
		return RoomsModel.findById(_id, {
			password: 0
		}).populate([{
			path: 'creater',
			select: {
				avatarUrl: 1,
				nickName: 1
			}
		},  {
			path: 'roommates',
			select: {
				avatarUrl: 1,
				nickName: 1
			}
		}]);
	},
	findBills(_id) {
		//根据房间id，返回房间信息，并且获取未结算订单详细信息
		return RoomsModel.findById(_id).populate({path:'noSettlements'});
	},
	createRoom(obj) {
		return new RoomsModel(obj).save();
	},
	getRoomList({find = {}, pageNo = 1, pageSize = 10}) {
		return RoomsModel.find(find, {name: 1, _id: 1})
			.sort({'time': -1}).skip((pageNo - 1) * pageSize).limit(pageSize);
	},
	pushRoomMates(find, userId) {
		//给指定房间添加成员
		return RoomsModel.update(find, {$addToSet: {roommates: userId}});
	},
	pushBill(find, billId, money) {
		//添加未结算订单, 并更新未结算金额
		return RoomsModel.update(find, {$addToSet: {noSettlements: billId}, $inc: {noMoney: money}});
	},
	updateRoom(find, bills, total) {
		return RoomsModel.update(find, {$inc: {money: total, noMoney: -total}, $pull: {noSettlements: {$in: bills}}});
	}
};