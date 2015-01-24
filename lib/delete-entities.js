"use strict";

module.exports = function(ecs, data) {
	ecs.add(function(entities, elapsed) { // jshint ignore:line
		var keys = Object.keys(entities);
		for (var i = 0; i < keys.length; i++) {
			var entity = entities[keys[i]];
			if (entity.dead) {
				delete data.entities.entities[entity.id];
			}
		}
	});
};
