"use strict";

var addSegment = require("./add-segment");

var createdRooms = false;

function createPerson(entities, x, y) {
	var animations = [ "person-a", "person-b", "person-c", "person-d"];
	var gibs = [
		[ "person-a-gib1", "person-a-gib2", "person-a-gib3", "person-a-gib4", "person-a-gib5" ],
		[ "person-b-gib1", "person-b-gib2", "person-b-gib3", "person-b-gib4", "person-b-gib5" ],
		[ "person-c-gib1", "person-c-gib2", "person-c-gib3", "person-c-gib4", "person-c-gib5" ],
		[ "person-d-gib1", "person-d-gib2", "person-d-gib3", "person-d-gib4", "person-d-gib5" ]
	];
	var index = Math.floor(Math.random() * animations.length);

	var person = entities.add();

	person.regib = true;
	person.position = {
		x: x,
		y: y
	};
	person.sounds = [
		"male-scream1",
		"male-scream2"
	];
	person.size = {
		"width": 75,
		"height": 81
	};
	person.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 1,
		"name": animations[index]
	};
	person.gibs = gibs[index];
	person.image = {
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": 0,
		"sourceHeight": 0,
		"destinationX": -21,
		"destinationY": -117,
		"destinationWidth": 115,
		"destinationHeight": 200
	};
	person.collisions = [];
}

function createRoom(entities, images, rx, ry) {
	var width = 20;
	var height = 12;

	var image = images.get("wall");
	var wallWidth = 74;
	var wallHeight = 71;

	var doorWidth = 4;
	var doorStart = (width - doorWidth) / 2;

	for (var x = 0; x < width; x++) {
		createWall(entities, image, rx + x * wallWidth, ry + 0 * wallHeight);
		if (x < doorStart || x > doorStart + doorWidth) {
			createWall(entities, image, rx + x * wallWidth, ry + (height - 1) * wallHeight);
		}
	}

	for (var y = 1; y < height - 1; y++) {
		createWall(entities, image, rx + 0 * wallWidth, ry + y * wallHeight);
		createWall(entities, image, rx + (width - 1) * wallWidth, ry + y * wallHeight);
	}

	for (var i = 0; i < 8; i++) {
		var px = Math.floor(Math.random() * (width - 2)) + 1;
		var py = Math.floor(Math.random() * (height - 2)) + 1;
		createPerson(entities, rx + (px * wallWidth), ry + (py * wallHeight));
	}
}

function createWall(entities, image, x, y) {
	var wall = entities.add();
	wall.position = {
		x: x,
		y: y
	};
	wall.size = {
		width: 74,
		height: 71
	};

	wall.collisions = [];

	wall.image = {
		"sourceX": 0,
		"sourceY": 0,
		"sourceWidth": 0,
		"sourceHeight": 0,
		"destinationX": 0,
		"destinationY": wall.size.height - image.height,
		"destinationWidth": image.width,
		"destinationHeight": image.height
	};
	wall.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 1,
		"name": "wall"
	};
	wall.gibs = [ "wall-gib1",  "wall-gib2",  "wall-gib3", "wall-gib4" ];
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var forwardSpeed = 0.5;
		var angle = entity.rotation.angle + (Math.PI / 2);
		entity.velocity.x = forwardSpeed * Math.cos(angle);
		entity.velocity.y = forwardSpeed * Math.sin(angle);

		if (!createdRooms) {
			createRoom(data.entities, data.images, 0, 0);
			createdRooms = true;
		}

		var angularSpeed = 0.005;
		entity.rotation.velocity = 0.0;
		if (data.input.button(entity.playerController2d.left)) {
			entity.rotation.velocity = -angularSpeed;
		}
		if (data.input.button(entity.playerController2d.right)) {
			entity.rotation.velocity = angularSpeed;
		}

		if (data.input.button(entity.playerController2d.down)) {
			addSegment(data.entities, entity);
		}
	}, ["playerController2d", "rotation", "velocity"]);
};
