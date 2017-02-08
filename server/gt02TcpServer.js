var net = require('net');
var logger = require('../tools/logger');

logger.info('Starting: ' + __filename);

exports.create = function (port) {

	net.createServer(function (socket) {
		console.log('Connected to server!');

		socket.write("Environment variables:\n");
		Object.keys(process.env).forEach(function (key) {
			socket.write(key + ":" + process.env[key] + "\n");
		});
		socket.end();
	}).listen(port);

};


