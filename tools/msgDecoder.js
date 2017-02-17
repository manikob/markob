/* global Promise */
'use strict';
var constants = require('./const');

module.exports = function (buff) {

	this.bBuff = buff;
	this.sBuff = buff.length > 0 ? buff.toString() : '';

	this.valid = () => {
		return new RegExp(constants.patterns.SINGLE_MSG).test(this.sBuff);
	};

	this.operationID = () => {
		return this.sBuff.substring(0, 12);
	};
	this.operationType = () => {
		return this.sBuff.substring(12, 16);
	};

	var _hasImei = () => {
		return [constants.packetPrefix.HANDSHAKE, constants.packetPrefix.LOGIN].indexOf(this.operationType()) != -1;
	};

	this.imei = () => {
		return _hasImei() ? this.sBuff.substring(16, 16 + 15) : undefined;
	};
};