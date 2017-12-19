let Mongoose = require('mongoose'),
	user_Schema =  new Mongoose.Schema({
		openid: {type: String, index: { unique: true, dropDups: true }},
		session_key: String,
		nickName: String, //昵称
		avatarUrl: String, //头像
		gender:  String, // 1时是男性，值为2时是女性，值为0时是未知
		city: String, //城市
		province: String, //省份
		country: String, //国家
		level: {type: Number, default: 10},
		time: {type: Date, default: Date.now},
		roomList: [{
			type : Mongoose.Schema.Types.ObjectId,
			ref: 'roomList'
		}]
});
const UserModel = Mongoose.model('users', user_Schema);

module.exports = {
	findUserInfo({userName, email, password, loginStatus}, showInfo = {__v: 0}){
		let findObj = null;
		if(!userName && !email && !password && !loginStatus){
			throw Error('请至少输入一个查询条件');
		}
		if(userName || email){
			if(password){
				findObj = {$or:[{userName: userName, password: password}, {email: userName, password: password}]};
			}else{
				findObj = {$or:[{userName: userName}, {email:email}]};
			}
		}else{
			findObj = {loginStatus: loginStatus};
		}
		return UserModel.find(findObj, showInfo);
	},
	findUserOne(findObj) {
		return UserModel.findOne(findObj);
	},
	saveUserInfo(obj){
		return new UserModel(obj).save();
	},
	updateUserInfo(find, updata){
		return UserModel.update(find, {$set:updata});
	}
};
