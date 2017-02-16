/* global Promise */
'use strict';
const constants = require('./const');
const logger = require('./logger');
const ctxManager = require('../tools/const').ctxMgr;
const S = require('string');

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
				case constants.packetPrefix.RESTART:
					rawMsg = '(' + ctx.id + code + ')';
					break;
			}

			ctx.socket.write(rawMsg);
			logger.info('Send data to tracker(' + ctx.ip() + '): ' + rawMsg.toString());
		}
	};

	this.sendToAll = (code) => {
		for (const ctx of ctxManager.ctxColl.values()) {
			if (!ctx.isDirty()) {
				this.sendTo(ctx, code);
			}
		}
	};

	this.sendCustom = (rawMsg) => {
		for (const ctx of ctxManager.ctxColl.values()) {
			if (!ctx.isDirty()) {
				ctx.socket.write(rawMsg);
				logger.info('Send data to tracker(' + ctx.ip() + '): ' + rawMsg.toString());
			}
		}
	};
};