/* global __filename, __dirname, Promise */
'use strict';

const http = require('http');
const constants = require('../tools/const');
const logger = require('../tools/logger');
const readFile = require('promise').denodeify(require("fs").readFile);
const CmdBuilder = require('../tools/commandBuilder');
const conn = require('../db/db');
const S = require('string');

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

var _traceContent = (session) => {
	var url = session.url;
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
				return S(data[0].toString())
						.replaceAll('{{title}}', data[1])
						.replaceAll('{{content}}', data[2])
						.replaceAll('{{usr}}', session.usr).s;
			}).catch((exc) => logger.error(exc.stack));
};

var _webContent = (session) => {
	// tests
	var url = session.url;
	
	if (url.startsWith('/CUSTOM/')) {
		new CmdBuilder().sendCustom(url.substring(8));
		session.url = constants.urlEndPoint.URL_INDEX;
		return _webContent(session);
	}
	
	switch (url) {
		case constants.urlEndPoint.URL_INDEX:
			return readFile(__dirname + "/../webpages" + url)
					.then((content) => {
						return S(content.toString())
								.replaceAll('{{logLevel}}', logger.level)
								.replaceAll('{{usr}}', session.usr).s;
					});
		case constants.urlEndPoint.URL_LOGSDEBUG:
		case constants.urlEndPoint.URL_LOGSERROR:
			return _traceContent(session);
		case constants.urlEndPoint.URL_SWITCHLOG:
			_switchLog();
			session.url = constants.urlEndPoint.URL_INDEX;
			return _webContent(session);
		case '/' + constants.packetPrefix.ONETIME_MSG:
			new CmdBuilder().sendToAll(constants.packetPrefix.ONETIME_MSG);
			session.url = constants.urlEndPoint.URL_INDEX;
			return _webContent(session);
		case '/' + constants.packetPrefix.RESTART:
			new CmdBuilder().sendToAll(constants.packetPrefix.RESTART);
			session.url = constants.urlEndPoint.URL_INDEX;
			return _webContent(session);
		case '/' + constants.urlEndPoint.URL_UNAUTH:
			return readFile(__dirname + "/../webpages" + url);
		default:
			return readFile(__dirname + "/../webpages/err.html");
	}
};

var _verifyUser = (url) => {
	var idx = url.indexOf('?usr=');
	var imei = idx !== -1 ? url.substring(idx + 5, idx + 20) : '';
	return conn.getUser(imei).then((x) => {
		if (x.length > 0)
			return Promise.resolve({
				url: url.replace('?usr=' + imei, ''),
				usr: imei
			});
		else
			return Promise.resolve({
				url: '/' + constants.urlEndPoint.URL_UNAUTH,
				usr: undefined
			});
	});
};

exports.create = (port) => {
	http.createServer((req, response) => {
		_verifyUser(req.url).then((session) => {
			_webContent(session).then((html) => {
				response.writeHeader(200, {"Content-Type": "text/html"});
				response.write(html);
				response.end();
			}).catch((exc) => logger.error(exc.stack));
		});
	}).listen(port);
};


