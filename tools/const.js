/* global __dirname */

const packetPrefix = {
	GT_MSGDATA: 0x10,
	GT_HEARTBEAT: 0x1A,
	GT_RESPONSE: 0x1C,
	CLIENT_HEARTBEAT: 0x1A,
	CLIENT_CHECKTRACES: 0x1B
};

const urlEndPoint = {
	URL_INDEX: "/index.html",
	URL_LOGSDEBUG: "/logsDebug",
	URL_LOGSERROR: "/logsError",
	URL_SWITCHLOG: "/switchLog"
};

module.exports.packetPrefix = packetPrefix;
module.exports.urlEndPoint = urlEndPoint;
module.exports.debugFilePath = __dirname + '/../logs/debug.log';
module.exports.excFilePath = __dirname + '/../logs/exceptions.log';


