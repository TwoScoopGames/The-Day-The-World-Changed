"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var parent = data.entities.entities[entity.follow.id];
		entity.position.x = parent.position.x + entity.follow.distance;
		entity.position.y = parent.position.y + entity.follow.distance;
	}, ["position", "rotation", "follow"]);
};
