/* global Promise */
'use strict';
var constants = require('./const');

module.exports = function (buff) {

	this.bBuff = buff;
	this.sBuff = buff.length > 0 ? buff.toString() : '';

	this.valid = () => {
		return new RegExp(constants.patterns.BASE_PATTERN).test(this.sBuff);
	};

	this.operationID = () => {
		return this.sBuff.substring(1, 13);
	};
	this.operationType = () => {
		return this.sBuff.substring(13, 17);
	};
};