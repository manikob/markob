var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({json: false, timestamp: true}),
		new winston.transports.File({filename: require('./const').debugFilePath, json: false})
	],
	exceptionHandlers: [
		new (winston.transports.Console)({json: false, timestamp: true}),
		new winston.transports.File({filename: require('./const').excFilePath, json: false})
	],
	exitOnError: false
});

module.exports = logger;