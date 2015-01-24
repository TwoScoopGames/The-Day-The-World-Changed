"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.movement2d.up = data.input.button(entity.playerController2d.up);
		entity.movement2d.down = data.input.button(entity.playerController2d.down);
		entity.rotation.velocity = 0.0;
		if (data.input.button(entity.playerController2d.left)) {
			entity.rotation.velocity = 0.01;
		}
		if (data.input.button(entity.playerController2d.right)) {
			entity.rotation.velocity = -0.01;
		}
	}, ["playerController2d"]);
};
