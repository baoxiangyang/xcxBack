const router = require('koa-router')(),
	config = require('../config/config.js'),
	base = require('../common/base.js'),
	myRequest = base.myRequest,
	db = require('../dbs/index.js');
router.post('login', async function(ctx, next){
	let data = ctx.request.body, userInfo = null;
	data.userInfo = data.userInfo || {};
	try {
		if(data.code){
			let app = config.app,
				body = {
					appid: app.id,
					secret: app.secret,
					js_code: data.code,
					grant_type: 'authorization_code'
				},
			 	codeSession = await myRequest({url:'/sns/jscode2session', body, type: 'GET'});
			//判断用户是否存在
			let findData = await db.users.findUserOne({openid: codeSession.openid});
			if(findData){
				//存在的时候更新数据
				await db.users.updateUserInfo({openid: codeSession.openid}, codeSession);
				userInfo = findData;
			}else{
				//不存在的时候直接插入
				userInfo = await db.users.saveUserInfo(Object.assign(data.userInfo, codeSession));
			}
			ctx.session.userInfo = Object.assign(userInfo, data.userInfo);
		}else{
			if(ctx.session.userInfo){
				userInfo = ctx.session.userInfo;
			}else{
				userInfo = await db.users.findById(data.userId);
				if(!userInfo){
					ctx.body = {
						code: -6,
						msg: '用户不存在'
					}
					return;
				}
				ctx.session.userInfo = Object.assign(userInfo, data.userInfo);
			}
		}
		ctx.body = {
			code: 0,
			userId: userInfo._id,
			roomList: userInfo.roomList
		};
	}catch(e) {
		ctx.body = {
			code: -7,
			msg: '获取用户信息失败,请重试'
		}
	}
});
module.exports = router;
