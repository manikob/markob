var http = require('http');
var constants = require('../tools/const');
var logger = require('../tools/logger');
var Promise = require('promise');
var read = Promise.denodeify(require("fs").readFile);

logger.info('Starting: ' + __filename);

var _traceContent = function (url) {
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

	return Promise.all([read(__dirname + "/../webpages/traceView.html"), pTitle, pBody])
			.then(function (data) {
				return data[0].toString().replace('{{title}}', data[1])
						.replace('{{content}}', data[2]);
			});
};

var _webContent = function (url) {
	switch (url) {
		case constants.urlEndPoint.URL_INDEX:
			return read(__dirname + "/../webpages/index.html");
		case constants.urlEndPoint.URL_LOGSDEBUG:
		case constants.urlEndPoint.URL_LOGSERROR:
			return _traceContent(url);
		default:
			return read(__dirname + "/../webpages/err.html");
	}
};

exports.create = function (port) {
	http.createServer(function (req, response) {
		_webContent(req.url).then(function (html) {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.write(html);
			response.end();
			response.end();
		});
	}).listen(port);
};


