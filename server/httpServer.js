var http = require("http");

exports.create = function (port) {
	http.createServer(function (request, response) {
		response.writeHead(200, {"Content-Type": "text/plain"});

		if (process.env) {
			response.write("Environment variables:\n");
			Object.keys(process.env).forEach(function (key) {
				response.write(key + ":" + process.env[key] + "\n");
			});
		}
		response.end();
	}).listen(port);
};


