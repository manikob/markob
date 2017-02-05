var net = require('net');

exports.create = function (port) {
	net.createServer(function (socket) {
		
		socket.write("Environment variables:\n");
		Object.keys(process.env).forEach(function (key) {
			socket.write(key + ":" + process.env[key] + "\n");
		});
		socket.end();
		
	}).listen(port);
};


