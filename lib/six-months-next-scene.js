"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.sixMonths.stop();
	data.sounds.play("shark-birth", true);
	data.scenes.intro2.start(data.context);
};
