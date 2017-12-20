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
		roommate:[{
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
	createRoom(obj) {
		return new RoomsModel(obj).save();
	}
};