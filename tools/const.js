/* global __dirname */
'use strict';
const CtxManager = require('../tools/socketContext');

const packetPrefix = {
	HANDSHAKE: 'BP00',
	HANDSHAKE_RESP: 'AP01',

	ONETIME_MSG: 'AP00',
	ONETIME_RESP: 'BP04',

	LOGIN: 'BP05',
	LOGIN_RESP: 'AP05',
	
	RESTART: 'AT00',
	RESTART_RESP: 'BT00',
	
	ISOCHRONIC_CONF: 'AR00',
	ISOCHRONIC_RESP: 'BS08'
};

const urlEndPoint = {
	URL_INDEX: '/index.html',
	URL_UNAUTH: '/unaccess.html',
	URL_LOGSDEBUG: '/logsDebug',
	URL_LOGSERROR: '/logsError',
	URL_SWITCHLOG: '/switchLog'
};

const patterns = {
	SINGLE_MSG: '\\d{12}B[A-Z]{1}\\d{2}.*',
	SPLIT_MSG: /\)\(|\(|\)/
};

const debugFileFolder = __dirname + '/../logs';

module.exports.ctxMgr = new CtxManager();
module.exports.contexts = [];
module.exports.packetPrefix = packetPrefix;
module.exports.urlEndPoint = urlEndPoint;
module.exports.patterns = patterns;
module.exports.debugFileFolder = debugFileFolder;
module.exports.dumpFileFolder = debugFileFolder + '/dump';
module.exports.debugFilePath = debugFileFolder + '/debug.log';
module.exports.excFilePath = debugFileFolder + '/exceptions.log';