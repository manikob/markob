var net = require('net');
var logger = require('../tools/logger');
var Promise = require('promise');
var constants = require('../tools/const');
var fs = require("fs");

logger.info('Starting: ' + __filename);


var _byteFileLogger = function(buf) {
	if (['info', 'verbose', 'debug', 'silly'].indexOf(logger.level) > -1) {
		fs.writeFile(__dirname + '/../logs/dump/' + parseInt(Date.now().toString()/1000) + ".trc", buf);
	}
};

var _callBack = function (buf) {
	if (buf.length > 0) {
		switch (buf[0]) {
			case constants.packetPrefix.CLIENT_HEARTBEAT :
				return require('./clientTcpServer').heartBeatResponse();
		}
	}

	return Promise.resolve(Buffer.from([]));
};

exports.create = function (port) {

	net.createServer(function (socket) {
		logger.info('Tracker connection established: ' + socket.remoteAddress + ":" + socket.remotePort);
		
		socket.on('data', function (buf) {
			
			logger.info('Received data from tracker. Data size: ' + buf.length);
			_byteFileLogger(buf);
			
			_callBack(buf).then(function (cBuff) {
				socket.write(cBuff);
			});
		});
		
	}).listen(port);

};


