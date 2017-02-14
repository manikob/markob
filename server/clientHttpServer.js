/* global __filename, __dirname, Promise */
'use strict';

const http = require('http');
const constants = require('../tools/const');
const logger = require('../tools/logger');
const readFile = require('promise').denodeify(require("fs").readFile);
const ctxManager = require('../tools/const').ctxMgr;
const CmdBuilder = require('../tools/commandBuilder');

logger.info('Starting: ' + __filename);

var _switchLog = () => {
	var logLevels = ['error', 'info', 'debug'];
	var idx = logLevels.indexOf(logger.level);
	if (idx == -1 || idx == 2) {
		logger.level = logLevels[0];
	} else {
		logger.level = logLevels[idx + 1];
	}
};

var _traceContent = (url) => {
	var pBody;
	var pTitle;
	if (constants.urlEndPoint.URL_LOGSDEBUG === url) {
		pBody = require('./../tools/traceReader').fileContent(constants.debugFilePath);
		pTitle = Promise.resolve(constants.debugFilePath);
	} else if (constants.urlEndPoint.URL_LOGSERROR === url) {
		pBody = require('./../tools/traceReader').fileContent(constants.excFilePath);
		pTitle = Promise.resolve(constants.excFilePath);
	} else {
		pBody = Promise.resolve('');
		pTitle = Promise.resolve('Unknown file name');
	}

	return Promise.all([readFile(__dirname + "/../webpages/traceView.html"), pTitle, pBody])
			.then((data) => {
				return data[0].toString().replace('{{title}}', data[1])
						.replace('{{content}}', data[2]);
			}).catch((exc) => logger.error(exc.stack));
};

var _webContent = (url) => {
	switch (url) {
		case constants.urlEndPoint.URL_INDEX:
			return readFile(__dirname + "/../webpages/index.html")
					.then((content) => {
						return content.toString().replace('{{logLevel}}', logger.level);
					});
		case constants.urlEndPoint.URL_LOGSDEBUG:
		case constants.urlEndPoint.URL_LOGSERROR:
			return _traceContent(url);
		case constants.urlEndPoint.URL_SWITCHLOG:
			_switchLog();
			return _webContent(constants.urlEndPoint.URL_INDEX);
		case '/' + constants.packetPrefix.ONETIME_MSG:
			new CmdBuilder().sendToAll(constants.packetPrefix.ONETIME_MSG);
			return _webContent(constants.urlEndPoint.URL_INDEX);
		case '/' + constants.packetPrefix.RESTART:
			new CmdBuilder().sendToAll(constants.packetPrefix.RESTART);
			return _webContent(constants.urlEndPoint.URL_INDEX);
		default:
			return readFile(__dirname + "/../webpages/err.html");
	}
};

exports.create = (port) => {
	http.createServer((req, response) => {
		_webContent(req.url).then((html) => {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.write(html);
			response.end();
			response.end();
		}).catch((exc) => logger.error(exc.stack));
	}).listen(port);
};


