"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, context) {
		if (entity.rotation !== undefined) {
			context.save();

			var x = entity.position.x + entity.rotation.x;
			var y = entity.position.y + entity.rotation.y;
			context.translate(x, y);
			context.rotate(entity.rotation.angle);
			context.translate(-x, -y);
		}

		var image = data.images.get(entity.image.name);
		if (!image) {
			return;
		}

		context.drawImage(
			image,
			entity.image.sourceX,
			entity.image.sourceY,
			entity.image.sourceWidth,
			entity.image.sourceHeight,
			entity.image.destinationX + entity.position.x,
			entity.image.destinationY + entity.position.y,
			entity.image.destinationWidth,
			entity.image.destinationHeight
		);

		if (entity.rotation !== undefined) {
			context.restore();
		}
	}, ["position", "image"]);
};
