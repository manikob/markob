var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
	
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write("Environment variables:<br>");
	Object.keys(process.env).forEach(function (key) {
		res.write(key + ":" + process.env[key] + "<br>");
	});
	res.end();
	console.log('Http server is created');
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	console.log('A client is connected!');
});

server.listen(process.env.PORT || 8080);