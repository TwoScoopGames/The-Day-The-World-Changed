"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) {
		var a = entity.text.a;
		a += 0.0007 * elapsed;
		entity.text.a = Math.min(a, 1.0);
	}, [ "text" ]);
};
