var router = require('koa-router')(),
	config = require('../config/config.js'),
	base = require('../common/base.js'),
	myRequest = base.myRequest;
router.post('login', async function(ctx, next){
	let data = ctx.request.body;
	ctx.session.userInfo = data;
	if(data.code){
		let app = config.app,
			body = {
				appid: app.id,
				secret: app.secret,
				js_code: data.code,
				grant_type: 'authorization_code'
			}
		let userData = await myRequest({url:'/sns/jscode2session', body, type: 'GET'});
		ctx.body = userData;
	}
});
module.exports = router;
