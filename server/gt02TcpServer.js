/* global __filename, __dirname, Promise */
'use strict';

var net = require('net');
var logger = require('../tools/logger');
var writeFile = require('promise').denodeify(require("fs").writeFile);
var MsgDecoder = require('../tools/msgDecoder');
var CmdBuilder = require('../tools/commandBuilder');
var CtxManager = new require('../tools/socketContext');

logger.info('Starting: ' + __filename);

var ctxManager = new CtxManager();
var cmdBuilder = new CmdBuilder();

var _byteFileLogger = (buf) => {
	if (['info', 'verbose', 'debug', 'silly'].indexOf(logger.level) > -1) {
		writeFile(__dirname + '/../logs/dump/' + Date.now().toString() + ".trc", buf).catch((exc) => logger.error(exc.stack));
	}
};

exports.create = (port) => {

	net.createServer((socket) => {
		logger.info('Tracker connection established: ' + socket.remoteAddress + ":" + socket.remotePort);
		ctxManager.add(socket);

		socket.on('data', (buf) => {

			logger.info('Received data from tracker. Data size: ' + buf.length);
			_byteFileLogger(buf);

			var msgDecoder = new MsgDecoder(buf);
			if (msgDecoder.valid()) {
				ctxManager.getContext(socket).setId(msgDecoder.operationID());
			}
			cmdBuilder.callBack(msgDecoder)
					.then((cBuff) => socket.write(cBuff))
					.catch((exc) => logger.error(exc));
		});

		socket.on('close', () => {
			ctxManager.remove(socket);
			logger.info('Close connection to tracker');
		});

		socket.on("error", (err) => {
			logger.error('Tracker connection error: ' + err.stack);
		});

	}).listen(port);
};