"use strict";

module.exports = function(entity, data) { // jshint ignore:line
	if (entity.text === undefined) {
		return;
	}
	entity.text.a = 0;
	if (entity.seq === 0) {
		entity.text.text = "I'm pregnant.";
	} else if (entity.seq === 1) {
		entity.text.text = "What do we do now?";
		entity.position.x = 200;
		entity.position.y = 410;
	} else if (entity.seq === 2) {
		data.switchScene("sixMonths");
	}
	entity.seq++;
};
