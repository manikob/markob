var srv = require("./server/tcpServer");
process.argv.forEach(function (val, index) {
	console.log(index + ': ' + val);
});
srv.create(process.argv[2] || 8080);