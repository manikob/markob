/* global __filename, __dirname, Promise */
'use strict';

const net = require('net');
const logger = require('../tools/logger');
const writeFile = require('promise').denodeify(require("fs").writeFile);
const MsgDecoder = require('../tools/msgDecoder');
const CmdBuilder = require('../tools/commandBuilder');
const constants = require('../tools/const');
const ctxManager = constants.ctxMgr;

logger.info('Starting: ' + __filename);

var cmdBuilder = new CmdBuilder();

var _byteFileLogger = (buf) => {
	if (['info', 'verbose', 'debug', 'silly'].indexOf(logger.level) > -1) {
		writeFile(__dirname + '/../logs/dump/' + Date.now().toString() + ".trc", buf).catch((exc) => logger.error(exc.stack));
	}
};

var _messageSplitter = (buf) => {
	return buf 
			? buf.toString().split(constants.patterns.SPLIT_MSG).filter((x) => x && x.length > 0)
			: [];
};

exports.create = (port) => {

	net.createServer((socket) => {
		logger.info('Tracker connection established: ' + socket.remoteAddress + ":" + socket.remotePort);
		ctxManager.cleanUp();
		ctxManager.add(socket);

		socket.on('data', (buffer) => {

			logger.info('Received data from tracker. Data size: ' + buffer.length);
			_byteFileLogger(buffer);
			
			_messageSplitter(buffer).forEach((buf) => {
				var msgDecoder = new MsgDecoder(buf);
				var ctx = ctxManager.getContext(socket);
				if (msgDecoder.operationType() === constants.packetPrefix.RESTART_RESP) {
					ctx.setDirty();
				} else if (msgDecoder.valid() && !ctx.isDirty()) {
					ctx.setId(msgDecoder.operationID());

					cmdBuilder.callBackCode(msgDecoder)
							.then((code) => cmdBuilder.sendTo(ctx, code))
							.catch((exc) => logger.error(exc));
				}
			});
		});

		socket.on('close', () => {
			ctxManager.remove(socket);
			logger.info('Close connection to tracker');
		});

		socket.on("error", (err) => {
			logger.error('Tracker connection error: ' + err.stack);
		});

	}).listen(port)
	  .on('error', (err) => {
		  logger.error('Tracker connection error: ' + err.stack);
		  ctxManager.clear();
	  }).on('close', () => {
		  logger.error('Close connection to tracker');
		  ctxManager.clear();
	  });
};