var http = require("http");
var isHeroku = process.env ? true : false;

exports.create = function (port) {
	http.createServer(function (request, response) {
		response.writeHead(200, {"Content-Type": "text/plain"});

		if (isHeroku) {
			response.write("Environments:\n");
			response.write(process.env.PORT);
		}
		response.end();
	}).listen(port);
};


