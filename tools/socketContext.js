/* global Promise */
'use strict';

var _context = function (sck) {
	this.socket = sck;
	this.id;

	this.ip = () => {
		return this.socket.remoteAddress;
	};

	this.setId = (newId) => {
		this.id = newId;
	};

	this.getId = () => {
		return this.id;
	};
};

module.exports = function () {

	this.ctxColl = new Map();
	this.add = (socket) => {
		this.ctxColl.set(socket, new _context(socket));
	};
	this.remove = (socket) => {
		this.ctxColl.delete(socket);
	};

	this.getContext = (socket) => {
		return this.ctxColl.get(socket);
	};
};