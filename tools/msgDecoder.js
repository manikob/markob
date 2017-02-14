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
};