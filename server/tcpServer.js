var http = require("http");

exports.create = function(port) {
	http.createServer(function(request, response) {
	  response.writeHead(200, {"Content-Type": "text/plain"});
	  response.write("It's alive!");
	  response.end();
	}).listen(port);
};


