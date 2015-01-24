"use strict";

function findFollower(entities, parent) {
	var keys = Object.keys(entities);
	for (var i = 0; i < keys.length; i++) {
		var entity = entities[keys[i]];
		if (entity.follow !== undefined && entity.follow.id === parent.id && !entity.camera) {
			return entity;
		}
	}
	return undefined;
}

function getSegmentAnimation() {
	var anims = ["shark-body1", "shark-body2", "shark-body3"];
	var index = Math.floor(Math.random() * 3);
	return anims[index];
}

function addSegment(entities, parent) {
	var follower = findFollower(entities.entities, parent);

	var clone = JSON.parse(JSON.stringify(follower));
	var newSegment = entities.add();
	Object.keys(clone).forEach(function(key) {
		if (key === "id") {
			return;
		}
		newSegment[key] = clone[key];
	});
	newSegment.animation.name = getSegmentAnimation();

	follower.follow.id = newSegment.id;
}

module.exports = addSegment;
