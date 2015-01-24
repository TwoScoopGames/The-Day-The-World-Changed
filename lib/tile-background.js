"use strict";

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.add(function(entities, context) { // jshint ignore:line
		var f1 = data.images.get("floor-1");
		var f2 = data.images.get("floor-2");

		var w = Math.floor(data.canvas.width / f1.width);
		var h = Math.floor(data.canvas.height / f1.height);
		for (var y = 0; y < h; y++) {
			for (var x = 0; x < w; x++) {
				var tile = (x + y) % 2;
				context.drawImage(tile === 0 ? f1 : f2, x * f1.width, y * f1.height, f1.width, f1.height);
			}
		}
	});
};
