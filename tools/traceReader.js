/* global Promise */

//var Promise = require('promise');
const _lineAmount = 10;

var _fileContent = (path) => {
	return require('read-last-lines').read(path, _lineAmount).then((content) => {
		return "LAST " + _lineAmount + " TRACE LINES FROM \"" + path + "\"\n" + content;
	});
};

exports.getTraces = () => {
	return Promise.all([_fileContent(require('./const').debugFilePath),
		_fileContent(require('./const').excFilePath)])
			.then((values) => {
				return Buffer.from(values.join());
			});
};

exports.fileContent = _fileContent;