"use strict";

var addSegment = require("./add-segment");

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var forwardSpeed = 0.5;
		var angle = entity.rotation.angle + (Math.PI / 2);
		entity.velocity.x = forwardSpeed * Math.cos(angle);
		entity.velocity.y = forwardSpeed * Math.sin(angle);

		var angularSpeed = 0.005;
		entity.rotation.velocity = 0.0;
		if (data.input.button(entity.playerController2d.left)) {
			entity.rotation.velocity = -angularSpeed;
		}
		if (data.input.button(entity.playerController2d.right)) {
			entity.rotation.velocity = angularSpeed;
		}

		if (data.input.button(entity.playerController2d.down)) {
			addSegment(data.entities, entity);
		}
	}, ["playerController2d", "rotation", "velocity"]);
};
