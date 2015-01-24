"use strict";

var addSegment = require("./add-segment");

function angleToVectors(angle, magnitude) {
	var x = magnitude * Math.cos(angle);
	var y = magnitude * Math.sin(angle);
	return { x: x, y: y };
}

function addGib(entities, entity, images) {
	var gibs = [ "person-a-gib1", "person-a-gib2", "person-a-gib3", "person-a-gib4", "person-a-gib5" ];
	var name = gibs[Math.floor(Math.random() * gibs.length)];
	var image = images.get(name);

	var gib = entities.add();
	gib.position = {
		x: entity.position.x,
		y: entity.position.y
	};
	gib.size = {
		width: image.width,
		height: image.height
	};
	gib.velocity = angleToVectors(Math.random() * Math.PI * 2, 1);
	gib.friction = {
		x: 0.97,
		y: 0.97
	};

	// var rotateSpeed = 0.01;
	// gib.rotation = {
	// 	x: image.width / 2,
	// 	y: image.height / 2,
	// 	angle: 0,
	// 	velocity: (Math.random() * rotateSpeed) - (rotateSpeed / 2),
	// 	friction: 0.99
	// };

	// gib.collisions = [];

	gib.image = {
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": 0,
		"sourceHeight": 0,
		"destinationX": 0,
		"destinationY": 0,
		"destinationWidth": image.width,
		"destinationHeight": image.height
	};
	gib.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 1,
		"name": name
	};
}

function addGibs(entities, entity, images) {
	var n = 4 + (Math.random() * 8);
	for (var i = 0; i < n; i++) {
		addGib(entities, entity, images);
	}
}

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.collisions.forEach(function(collisionId) {
			var food = data.entities.entities[collisionId];
			food.dead = true;

			addSegment(data.entities, entity);
			addGibs(data.entities, food, data.images);
		});
	}, ["playerController2d", "collisions"]);
};