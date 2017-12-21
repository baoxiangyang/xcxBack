//房间表
let Mongoose = require('mongoose'),
	rooms_Schema = new Mongoose.Schema({
		name: {type: String, index: { unique: true, dropDups: true }},
		password: String,
		describe: {type: String, default: ''},
		creater: {
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'users'
		},
		roommates:[{
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'users'
		}],
		billList:[{
			type : Mongoose.Schema.Types.ObjectId,
			ref : 'bills'
		}],
		time: {type: Date, default: Date.now},
	});
const RoomsModel  = Mongoose.model('rooms', rooms_Schema);
module.exports = {
	findById(_id) {
		return RoomsModel.findById(_id);
	},
	createRoom(obj) {
		return new RoomsModel(obj).save();
	},
	getRoomList({find = {}, pageNo = 1, pageSize = 10}) {
		return RoomsModel.find(find, {name: 1, _id: 1})
			.sort({'time': -1}).skip((pageNo - 1) * pageSize).limit(pageSize);
	},
	pushRoomMates(find, userId) {
		return RoomsModel.update(find, {$addToSet: {roommates: userId}});
	}
};