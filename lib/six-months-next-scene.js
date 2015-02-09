"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.sixMonths.stop();
	data.scenes.intro2.start(data.context);
};
