/* global __filename */

// process.argv[0] - node
// process.argv[1] - app name
// process.argv[2] - gt02 tcp port
// process.argv[3] - client tcp port
// process.argv[4] - client http port

var logger = require('./tools/logger');
logger.info('Starting: ' + __filename);

if (process.argv.length < 5) {
	console.log('Incorrect attributes:\n');
	console.log('Example: node main.js [gt02Port] [clientTcpPort] [clientHttpPort]');

} else {
	require('./server/gt02TcpServer').create(process.argv[2]);
	require('./server/clientTcpServer').create(process.argv[3]);
	require('./server/clientHttpServer').create(process.argv[4]);
}