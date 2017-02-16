'use strict';
const winston = require('winston');
const constants = require('./const');
const fs = require("fs");

// create log dir
if (!fs.existsSync(constants.debugFileFolder)) {
	fs.mkdirSync(constants.debugFileFolder);
}

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({json: false, timestamp: true}),
		new winston.transports.File({filename: constants.debugFilePath, json: false})
	],
	exceptionHandlers: [
		new (winston.transports.Console)({json: false, timestamp: true}),
		new winston.transports.File({filename: constants.excFilePath, json: false})
	],
	exitOnError: false
});

module.exports = logger;