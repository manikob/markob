/* global __filename, __dirname, Promise */
'use strict';

var net = require('net');
var logger = require('../tools/logger');
var writeFile = require('promise').denodeify(require("fs").writeFile);
var MsgDecoder = require('../tools/msgDecoder');

logger.info('Starting: ' + __filename);


var _byteFileLogger = (buf) => {
	if (['info', 'verbose', 'debug', 'silly'].indexOf(logger.level) > -1) {
		writeFile(__dirname + '/../logs/dump/' + parseInt(Date.now().toString() / 1000) + ".trc", buf).catch((exc) => logger.error(exc.stack));
	}
};

exports.create = (port) => {

	net.createServer((socket) => {
		logger.info('Tracker connection established: ' + socket.remoteAddress + ":" + socket.remotePort);

		socket.on('data', (buf) => {

			logger.info('Received data from tracker. Data size: ' + buf.length);
			_byteFileLogger(buf);

			new MsgDecoder(buf).callBack().then((cBuff) => {
				socket.write(cBuff);
			}).catch((exc) => logger.error(exc));
		});

		socket.on('close', () => {
			logger.info('Close connection to tracker');
		});

		socket.on("error", (err) => {
			logger.error('Tracker connection error: ' + err.stack);
		});

	}).listen(port);
};