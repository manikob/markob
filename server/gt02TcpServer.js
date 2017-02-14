/* global __filename, __dirname, Promise */
'use strict';

const net = require('net');
const logger = require('../tools/logger');
const writeFile = require('promise').denodeify(require("fs").writeFile);
const MsgDecoder = require('../tools/msgDecoder');
const CmdBuilder = require('../tools/commandBuilder');
const ctxManager = require('../tools/const').ctxMgr;

logger.info('Starting: ' + __filename);

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
		//socket.setKeepAlive(true);

		socket.on('data', (buf) => {

			logger.info('Received data from tracker. Data size: ' + buf.length);
			_byteFileLogger(buf);

			var msgDecoder = new MsgDecoder(buf);
			if (msgDecoder.valid()) {
				var ctx = ctxManager.getContext(socket);
				ctx.setId(msgDecoder.operationID());

				cmdBuilder.callBackCode(msgDecoder)
						.then((code) => cmdBuilder.sendTo(ctx, code))
						.catch((exc) => logger.error(exc));
			}
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