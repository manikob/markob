var net = require('net');
var logger = require('../tools/logger');
var constants = require('../tools/const');
var Promise = require('promise');

logger.info('Starting: ' + __filename);

var _heartBeatResponse = function () {
	return new Promise(function (resolve) {
		var bytes = [constants.packetPrefix.CLIENT_HEARTBEAT];
		resolve(Buffer.from(bytes));
	});
};

var _callBack = function (buf) {
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

exports.create = function (port) {
	net.createServer(function (socket) {
		logger.info('Client connection established: ' + socket.remoteAddress + ":" + socket.remotePort);

		socket.on('data', function (buf) {
			logger.info('Received data from client. Data size: ' + buf.length);
			_callBack(buf).then(function (cBuff) {
				socket.write(cBuff);
			});
		});

		socket.on('end', function () {
			logger.info('Connection closed');
		});

	}).listen(port);
};


