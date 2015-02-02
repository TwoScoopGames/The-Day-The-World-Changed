"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.intro2.stop();
	data.sounds.stop("shark-birth");
	data.sounds.stop("hospital-sounds");
	data.sounds.play("go");
	data.scenes.go.start(data.context);
};
