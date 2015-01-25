"use strict";

var copyEntityComponents = require("./copy-entity-components");

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

function getSegmentAnimation(current) {
	var anims = ["shark-body1", "shark-body2-f10", "shark-body3"];
	var index = (anims.indexOf(current) + 1) % anims.length;
	return anims[index];
}

function addSegment(entities, parent) {
	var follower = findFollower(entities.entities, parent);

	var newSegment = copyEntityComponents(follower, entities.add());
	newSegment.animation.name = getSegmentAnimation(newSegment.animation.name);
	newSegment.animation.frame = 0;
	follower.follow.id = newSegment.id;
	follower.timers = {
		regib: {
			running: true,
			time: 0,
			max: 1000,
			script: "./lib/add-collisions"
		}
	};
}

module.exports = addSegment;
