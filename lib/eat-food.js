"use strict";

var addSegment = require("./add-segment");

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.collisions.forEach(function(collisionId) {
			data.entities.entities[collisionId].dead = true;
			addSegment(data.entities, entity);
		});
	}, ["playerController2d", "collisions"]);
};
