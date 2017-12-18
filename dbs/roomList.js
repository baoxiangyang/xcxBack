//房间表
let Mongoose = require('mongoose'),
	statistics_Schema = new Mongoose.Schema({
		name: {type: String, index: { unique: true, dropDups: true }},
		password: {type: String, default: ''},
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
			ref : 'billList'
		}],
		time: {type: Date, default: Date.now},
	});
const StatisticsModel  = Mongoose.model('roomLists', statistics_Schema);
module.exports = {
	insertStatistic(data) {
		return StatisticsModel(data).save();
	},
	findStatistic(data) {
		return StatisticsModel.find(data);
	}
};