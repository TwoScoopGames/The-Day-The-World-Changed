"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.intro2.stop();
	data.scenes.go.start(data.context);
};
