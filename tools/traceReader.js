var Promise = require('promise');
var _lineAmount = 10;

var _fileContent = function (path) {
	return require('read-last-lines').read(path, 2 * _lineAmount).then(function (content) {
		return "LAST " + _lineAmount + " TRACE LINES FROM \"" + path + "\"\n" + content;
	});
};

exports.getTraces = function () {
	return Promise.all([_fileContent(require('./const').debugFilePath),
		_fileContent(require('./const').excFilePath)])
			.then(function (values) {
				return Buffer.from(values.join());
			});
};

exports.fileContent = _fileContent;

