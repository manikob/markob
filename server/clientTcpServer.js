/* global __filename, Promise */
'use strict';

var net = require('net');
var logger = require('../tools/logger');

logger.info('Starting: ' + __filename);

exports.create = (port) => {
	net.createServer((socket) => {
		logger.info('Client connection established: ' + socket.remoteAddress + ":" + socket.remotePort);

		socket.on('data', (buf) => {
			logger.info('Received data from client. Data size: ' + buf.length);
		});

		socket.on('end', () => {
			logger.info('Connection closed');
		});

	}).listen(port);
};