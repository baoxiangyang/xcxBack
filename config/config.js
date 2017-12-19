module.exports = {
	mongodb: {
		host: '119.23.70.244',
		user: 'xiaochengxu',
		password: '123456',
		port: 27017,
		dbs: 'xcxdb'
	},
	redis: {
		host: '127.0.0.1',
		password: '123456',
		port: 6379,
		ttl: 60 * 30 //30分钟过期
	},
	app: {
		id: 'wxf80bd9489d156182',
		secret: '4c213c1d9781d6a5faf3a084d9083d38'
	},
	host: 'https://www.xiaobaozong.cn',
	loginStatusTime: 1000 * 60 * 60 * 24 * 15, //登录状态保存时间(ms)
};
