let mongoose = require('mongoose');
	mongoose.Promise = global.Promise;
let mongoConfig = require('../config/config.js').mongodb,
db = mongoose.connect(`mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.dbs}`, {useMongoClient: true}),
rooms = require('./rooms'),
users = require('./users'),
bills = require('./bills.js');


db.then(() => {
	console.log('连接成功');
}, (err) => {
	console.log('连接错误', err);
});

module.exports = Object.assign({users, rooms, bills});
