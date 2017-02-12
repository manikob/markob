/* global __filename, __dirname, Promise */

var net = require('net');
var logger = require('../tools/logger');
var constants = require('../tools/const');
var fs = require("fs");

logger.info('Starting: ' + __filename);


var _byteFileLogger = (buf) => {
	if (['info', 'verbose', 'debug', 'silly'].indexOf(logger.level) > -1) {
		fs.writeFile(__dirname + '/../logs/dump/' + parseInt(Date.now().toString() / 1000) + ".trc", buf);
	}
};

var _callBack = (buf) => {
	if (buf.length > 0) {
		switch (buf[0]) {
			case constants.packetPrefix.CLIENT_HEARTBEAT :
				return require('./clientTcpServer').heartBeatResponse();
		}
	}

	return Promise.resolve(Buffer.from([]));
};

exports.create = (port) => {

	net.createServer((socket) => {
		logger.info('Tracker connection established: ' + socket.remoteAddress + ":" + socket.remotePort);

		socket.on('data', (buf) => {

			logger.info('Received data from tracker. Data size: ' + buf.length);
			_byteFileLogger(buf);

			_callBack(buf).then((cBuff) => {
				socket.write(cBuff);
			});
		});

		socket.on('close', () => {
			logger.info('Close connection to tracker');
		});

		socket.on("error", (err) => {
			logger.error('Tracker connection error: ' + err.stack);
		});

	}).listen(port);
};