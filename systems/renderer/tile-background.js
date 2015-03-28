"use strict";

var getCamera = require("../../lib/get-camera");

function getScreenTopLeft(camera) {
	if (camera === undefined) {
		return { x: 0, y: 0 };
	}
	var x = camera.position.x + camera.camera.x;
	var y = camera.position.y + camera.camera.y;
	return { x: x, y: y };
}

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.add(function(entities, context) { // jshint ignore:line
		var f1 = data.images.get("floor-1");
		var f2 = data.images.get("floor-2");

		var screen = getScreenTopLeft(getCamera(data.entities.entities));
		var startX = Math.floor(screen.x / f1.width) * f1.width;
		var startY = Math.floor(screen.y / f1.height) * f1.height;

		for (var y = startY; y <= screen.y + data.canvas.height; y += f1.height) {
			for (var x = startX; x <= screen.x + data.canvas.width; x += f1.width) {
				var tile = (Math.floor(x / f1.width) + Math.floor(y / f1.height)) % 2;
				context.drawImage(tile === 0 ? f1 : f2, x, y, f1.width, f1.height);
			}
		}
	});
};
