/* global Promise */
'use strict';

const _lineAmount = 10;

var _fileContent = (path) => {
	return require('read-last-lines').read(path, _lineAmount).then((content) => {
		return "LAST " + _lineAmount + " TRACE LINES FROM \"" + path + "\"\n" + content;
	}).catch(() => {
		return "LAST " + _lineAmount + " TRACE LINES FROM \"" + path + "\"\n";
	});
};

exports.fileContent = _fileContent;