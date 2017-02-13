/* global Promise */
'use strict';
var constants = require('./const');

module.exports = function () {

	this.oneTimeCallingMsg = () => {
		return '(' + this.msgDecoder.operationID() + constants.packetPrefix.ONETIME_MSG + ')';
	};

	var _handshakeResp = (id) => {
		return '(' + id + constants.packetPrefix.HANDSHAKE_RESP + 'HSO' + ')';
	};
	
	var _loginResponse = (id) => {
		return '(' + id + constants.packetPrefix.LOGIN_RESP + ')';
	};

	this.callBack = (msgDecoder) => {
		if (msgDecoder.valid()) {
			switch (msgDecoder.operationType()) {
				case constants.packetPrefix.HANDSHAKE:
					return Promise.resolve(_handshakeResp(msgDecoder.operationID()));
				case constants.packetPrefix.LOGIN:
					return Promise.resolve(_loginResponse(msgDecoder.operationID()));
			}
		}

		return Promise.resolve(Buffer.from([]));
	};
};