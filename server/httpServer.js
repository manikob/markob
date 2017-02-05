var net = require('net');

exports.create = function (port) {
	net.createServer(function (socket) {
		if (process.env) {
			socket.write("Environment variables:\n");
			Object.keys(process.env).forEach(function (key) {
				socket.write(key + ":" + process.env[key] + "\n");
			});
		}
	}).listen(port);
	
//	http.createServer(function (request, response) {
//		response.writeHead(200, {"Content-Type": "text/plain"});


//		if (process.env) {
//			response.write("Environment variables:\n");
//			Object.keys(process.env).forEach(function (key) {
//				response.write(key + ":" + process.env[key] + "\n");
//			});
//		}
//		response.end();
//	}).listen(port);
};


