"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.go.stop();
	data.scenes.main.start(data.context);
};
