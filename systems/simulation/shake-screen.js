"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var shakeX = Math.floor(Math.random() * entity.shake.x * 2) - entity.shake.x;
		var shakeY = Math.floor(Math.random() * entity.shake.y * 2) - entity.shake.y;
		entity.position.x += shakeX;
		entity.position.y += shakeY;
	}, [ "shake" ]);
};
