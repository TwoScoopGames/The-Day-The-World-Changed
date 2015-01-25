"use strict";

module.exports = function(entity) {
	entity.velocity.y = -0.05;
	entity.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 3,
		"name": "doctor-intro2-f2"
	};
	entity.position.x -= 26;
	entity.image.destinationWidth = 645;
};
