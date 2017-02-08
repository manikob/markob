// process.argv[0] - node
// process.argv[1] - app name
// process.argv[2] - gt02 port
// process.argv[3] - client/http port

var logger = require('./tools/logger');
logger.info('Starting: ' + __filename);

if (process.argv.length < 4) {
	console.log('Incorrect attributes:\n');
	console.log('Example: node main.js [gt02Port] [client/httpPort]');
	
} else {
	require('./server/gt02TcpServer').create(process.argv[2]);
	require('./server/clientTcpServer').create(process.argv[3]);
}