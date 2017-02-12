/* global Promise */

'use strict';
var constants = require('./const');

module.exports = function(buff) {

	this.bBuff = buff;
	this.sBuff = buff.length > 0 ? buff.toString() : '';

	var _valid = () => {
		return new RegExp(constants.patterns.BASE_PATTERN).test(this.sBuff);
	};
	
	var _operationType = () => { return this.sBuff.substring(13, 17); };
	var _operationID = () => { return this.sBuff.substring(1,13); };
	var _handshakeResp = () => { return '(' + _operationID() + constants.packetPrefix.HANDSHAKE_RESP + 'HSO' + ')'; };
	
	this.callBack = () => {
		if (_valid) {
			switch(_operationType()) {
				case constants.packetPrefix.HANDSHAKE:
					return Promise.resolve(_handshakeResp());
			}
		}
		return Promise.resolve(Buffer.from([]));
	};
};


