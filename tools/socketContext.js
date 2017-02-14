/* global Promise */
'use strict';

var _context = function (sck) {
	this.socket = sck;
	this.id;
	this.dirty = false;

	this.ip = () => {
		return this.socket.remoteAddress;
	};

	this.setId = (newId) => {
		this.id = newId;
	};

	this.getId = () => {
		return this.id;
	};
	
	this.setDirty = () => {
		this.socket.pause();
		this.dirty = true;
	};
	
	this.isDirty = () => {
		return this.dirty;
	};
};

module.exports = function () {
	this.ctxColl = new Map();
	
	this.cleanUp = () => {
		var toRemove = [];
		this.ctxColl.forEach((val, key) => {
			if (val.isDirty()) 
				toRemove.push(key);
		});
		
		toRemove.forEach((key) => this.ctxColl.delete(key));
	};
	
	this.add = (socket) => {
		this.ctxColl.set(socket, new _context(socket));
	};
	this.remove = (socket) => {
		this.ctxColl.delete(socket);
	};

	this.getContext = (socket) => {
		return this.ctxColl.get(socket);
	};

	this.clear = () => {
		this.ctxColl.clear();
	};
};