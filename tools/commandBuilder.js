/* global Promise */
'use strict';
const constants = require('./const');
const logger = require('./logger');
const ctxManager = require('../tools/const').ctxMgr;

module.exports = function () {

	this.callBackCode = (msgDecoder) => {
		if (msgDecoder.valid()) {
			switch (msgDecoder.operationType()) {
				case constants.packetPrefix.HANDSHAKE:
					return Promise.resolve(constants.packetPrefix.HANDSHAKE_RESP);
				case constants.packetPrefix.LOGIN:
					return Promise.resolve(constants.packetPrefix.LOGIN_RESP);
			}
		}
		return Promise.resolve('');
	};

	this.sendTo = (ctx, code) => {
		if (ctx && code.length > 0) {
			var rawMsg = '';
			switch (code) {
				case constants.packetPrefix.HANDSHAKE_RESP:
					rawMsg = '(' + ctx.id + code + 'HSO' + ')';
					break;
				case constants.packetPrefix.LOGIN_RESP:
				case constants.packetPrefix.ONETIME_MSG:
				case constants.packetPrefix.RESTART_RESP:
					rawMsg = '(' + ctx.id + code + ')';
					break;
			}

			ctx.socket.write(rawMsg);
			logger.info('Send data to tracker: ' + rawMsg.toString());
		}
	};

	this.sendToAll = (code) => {
		for (const ctx of ctxManager.ctxColl.values()) {
			this.sendTo(ctx, code);
		}
	};
};