/* global Promise */
'use strict';

//var Promise = require('promise');
const _lineAmount = 10;

var _fileContent = (path) => {
	return require('read-last-lines').read(path, _lineAmount).then((content) => {
		return "LAST " + _lineAmount + " TRACE LINES FROM \"" + path + "\"\n" + content;
	});
};

exports.fileContent = _fileContent;