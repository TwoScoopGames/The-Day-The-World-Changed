"use strict";

module.exports = function(src, dest) {
	var clone = JSON.parse(JSON.stringify(src));
	Object.keys(clone).forEach(function(key) {
		if (key === "id") {
			return;
		}
		dest[key] = clone[key];
	});
	return dest;
};
