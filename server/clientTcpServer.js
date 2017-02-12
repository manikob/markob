/* global __filename, Promise */

var net = require('net');
var logger = require('../tools/logger');
var constants = require('../tools/const');

logger.info('Starting: ' + __filename);

var _heartBeatResponse = () => {
	return new Promise((resolve) => {
		var bytes = [constants.packetPrefix.CLIENT_HEARTBEAT];
		resolve(Buffer.from(bytes));
	});
};

var _callBack = (buf) => {
	if (buf.length > 0) {
		switch (buf[0]) {
			case constants.packetPrefix.CLIENT_HEARTBEAT :
				return _heartBeatResponse();
			case constants.packetPrefix.CLIENT_CHECKTRACES :
				return require('../tools/traceReader').getTraces();
		}
	}

	return Promise.resolve(Buffer.from([]));
};

exports.create = (port) => {
	net.createServer((socket) => {
		logger.info('Client connection established: ' + socket.remoteAddress + ":" + socket.remotePort);

		socket.on('data', (buf) => {
			logger.info('Received data from client. Data size: ' + buf.length);
			_callBack(buf).then((cBuff) => {
				socket.write(cBuff);
			});
		});

		socket.on('end', () => {
			logger.info('Connection closed');
		});

	}).listen(port);
};

exports.heartBeatResponse = _heartBeatResponse;


