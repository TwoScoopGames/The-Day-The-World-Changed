"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) {
		entity.rotation.angle += entity.rotation.velocity * elapsed;
	}, ["rotation"]);
};
