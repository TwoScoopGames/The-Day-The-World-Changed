"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.title.stop();
	data.scenes.intro1.start(data.context);
};
