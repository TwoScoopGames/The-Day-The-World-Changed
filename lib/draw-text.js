"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, context) { // jshint ignore:line
		context.fillStyle = "rgba(" + entity.text.r + ", " + entity.text.g + ", " + entity.text.b + ", " + entity.text.a + ")";
		context.font = entity.text.font;
		context.fillText(entity.text.text, entity.position.x, entity.position.y);
	}, [ "text", "position" ]);
};
