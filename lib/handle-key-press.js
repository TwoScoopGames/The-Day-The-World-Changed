"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, context) { // jshint ignore:line
		var isPressed = false;
		for (var i = 0; i < entity.onKeyPress.keys.length; i++) {
			if (data.input.button(entity.onKeyPress.keys[i])) {
				isPressed = true;
				break;
			}
		}

		if (entity.onKeyPress.lastPressed === false && isPressed) {
			var script = data.require(entity.onKeyPress.script);
			script(entity, data);
		}

		entity.onKeyPress.lastPressed = isPressed;
	}, [ "onKeyPress" ]);
};
