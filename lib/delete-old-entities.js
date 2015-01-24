"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) {
		entity.age.ms += elapsed;
		if (entity.age.ms >= entity.age.max) {
			entity.dead = true;
		}
	}, [ "age" ]);
};
