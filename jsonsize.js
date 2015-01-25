/**
 * showJsonSizes({ a: 'abc', b: 1234 }, 0) => '16 Bytes'
 * showJsonSizes({ a: 'abc', b: 1234 }, 1) => { a: '5 Bytes', b: '4 Bytes'}
 * showJsonSizes({ a: 'abc', b: 1234 }, -1) => { a: '5 Bytes', b: '4 Bytes'} // negative depth values means show sizes for leaves only
 * showJsonSizes([ 1234, 'abc', 'abcdefg'], 1) => ['4 Bytes' , '5 Bytes', '9 Bytes']
 */
function showJsonSizes(obj, depth) {
	// If we have a scalar, return the formatted byte size directly
	if (isScalar(obj) || depth === 0) {
		return typeof obj + ': ' + formatByteSize(jsonByteSize(obj));
	}
	if (depth === undefined) {
		depth = 1;
	}
	if (isArray(obj)) {
		return showJsonArraySizes(obj, depth);
	} else {
		return showJsonObjectSizes(obj, depth);
	}
}

function showJsonArraySizes(a, depth) {
	var result = [],
	    i = 0,
    	len = a.length;
	for (; i < len; i += 1) {
		result.push(showJsonSizes(a[i], depth - 1));
	}
	if (depth >= 1) {
		result.push('TOTAL: ' + formatByteSize(arrayByteSize(a)));
	}
	return result;
}

function showJsonObjectSizes(o, depth) {
	var result = {};
	for (var p in o) {
		result[p] = showJsonSizes(o[p], depth - 1);
	}
	if (depth >= 1) {
		result['TOTAL'] = formatByteSize(objByteSize(o));
	}
	return result;
}

function objByteSize(o) {
	var size = 0,
	    commaSize = 0;
	for (var p in o) {
		size += p.length + jsonByteSize(o[p]) + 3 + commaSize; // +3 because of colon and quotes around key
		commaSize = 1;
	}
	return size + 2; // +2 because of braces
}

function arrayByteSize(a) {
	var size = 0,
	    commaSize = 0;
	for (var i = 0, len = a.length; i < len; i += 1) {
		size += jsonByteSize(a[i]) + commaSize;
		commaSize = 1;
	}
	return size + 2; // +2 because of brackets
}

function jsonByteSize(obj) {
	if (obj === undefined) {
		return 9;
	}
	if (obj === null) {
		return 4;
	}
	var t = typeof obj;
	switch (t) {
		case 'string': return stringByteSize(obj) + 2; // +2 because of quotes
		case 'object': return isArray(obj)? arrayByteSize(obj) : objByteSize(obj);
		case 'number': return new Number(obj).toString().length;
		case 'boolean': return obj ? 4 : 5;
	}

	return 0;
}

function stringByteSize(s) {
	return s.replace(/</g, '|u003C')
	        .replace(/>/g, '|u003E')
	        .replace(/"/g, '|u0022')
	        .replace(/'/g, '|u0022')
	        .replace(/&/g, '|u0026')
	        .length;
}

function isScalar(o) {
	return (/string|number|boolean/).test(typeof o);
}

function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

function formatByteSize(bytes) {
	if (bytes == 0) {
		return '0 Byte';
	}
	var k = 1000,
	    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
	    i = Math.floor(Math.log(bytes) / Math.log(k));
	    num = (bytes / Math.pow(k, i)).toPrecision(3);
    num = num.replace(/0+$/, '');
    num = num.replace(/\.$/, '');
	return num + ' ' + sizes[i];
}

module.exports = showJsonSizes;
