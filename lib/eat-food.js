"use strict";

var addSegment = require("./add-segment");
var getCamera = require("./get-camera");

function angleToVectors(angle, magnitude) {
	var x = magnitude * Math.cos(angle);
	var y = magnitude * Math.sin(angle);
	return { x: x, y: y };
}

function addGib(entities, entity, images) {
	var gibs = entity.gibs;
	var name = gibs[Math.floor(Math.random() * gibs.length)];
	var image = images.get(name);

	var gib = entities.add();
	gib.gibs = [ "people-gib1", "people-gib2", "people-gib3", "people-gib4", "people-gib5", "people-gib6" ];
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
	if (entity.regib !== undefined) {
		gib.timers = {
			regib: {
				running: true,
				time: 0,
				max: 1000,
				script: "./lib/add-collisions"
			}
		};
	} else {
		gib.timers = {
			fadeAway: {
				running: true,
				time: 0,
				max: 300 + Math.random() * 700,
				script: "./lib/delete-old-entities"
			}
		};
	}

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

function hasPeople(entities) {
	var keys = Object.keys(entities);
	for (var i = 0; i < keys.length; i++) {
		var entity = entities[keys[i]];
		if (entity.dead !== true && entity.animation !== undefined && entity.animation.name.indexOf("person") === 0) {
			return true;
		}
	}
	return false;
}

module.exports = function(ecs, data) { // jshint ignore:line
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		entity.collisions.forEach(function(collisionId) {
			var food = data.entities.entities[collisionId];
			food.dead = true;

			var sounds = [ "wall-eat1", "wall-eat2", "wall-eat3", "wall-eat4" ];
			if (food.sounds !== undefined) {
				sounds = food.sounds;
			}

			var camera = getCamera(data.entities.entities);
			var shake = 10;
			if (food.animation.name.indexOf("person") === 0) {
				shake = 20;
			}

			camera.shake = {
				x: shake,
				y: shake
			};
			camera.timers = {
				shake: {
					running: true,
					time: 0,
					max: 100,
					script: "./lib/delete-shake"
				}
			};

			data.sounds.play(sounds[Math.floor(Math.random() * sounds.length)]);

			if (food.animation.name.indexOf("person") === 0) {
				addSegment(data.entities, entity);
			}
			addGibs(data.entities, food, data.images);

			if (!hasPeople(data.entities.entities)) {
				data.scenes.main.stop();
				data.scenes.end.start(data.context);
			}
		});
	}, ["playerController2d", "collisions"]);
};
