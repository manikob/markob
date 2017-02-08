
var packetPrefix = { 
	GT_MSGDATA : 0x10,
	GT_HEARTBEAT : 0x1A,
	GT_RESPONSE : 0x1C,
	
	CLIENT_HEARTBEAT : 0x1A,
	CLIENT_CHECKTRACES : 0x1B
};

module.exports.packetPrefix = packetPrefix;
module.exports.debugFilePath = __dirname + '/../logs/debug.log';
module.exports.excFilePath = __dirname + '/../logs/exceptions.log';


