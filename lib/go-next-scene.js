"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	data.scenes.go.stop();
	data.sounds.play("Wake_-_67_-_Duckbag", true);
	data.scenes.main.start(data.context);
};