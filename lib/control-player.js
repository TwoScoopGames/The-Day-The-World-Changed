"use strict";

var addSegment = require("./add-segment");
var copyEntityComponents = require("./copy-entity-components");

var createdRooms = false;

var prefabs = require("../prefabs");

function createPerson(entities, x, y) {
	var names = [ "person-a", "person-b", "person-c", "person-d" ];
	var index = Math.floor(Math.random() * names.length);

	var person = copyEntityComponents(prefabs[names[index]], entities.add());
	person.position.x = x;
	person.position.y = y;
}

var roomWidth = 20;
var roomHeight = 12;

var wallWidth = 74;
var wallHeight = 71;

function createRoom(entities, rx, ry) {
	var doorWidth = 4;
	var doorStart = (roomWidth - doorWidth) / 2;

	for (var x = 0; x < roomWidth; x++) {
		createWall(entities, rx + x * wallWidth, ry + 0 * wallHeight);
		if (x < doorStart || x > doorStart + doorWidth) {
			createWall(entities, rx + x * wallWidth, ry + (roomHeight - 1) * wallHeight);
		}
	}

	for (var y = 1; y < roomHeight - 1; y++) {
		createWall(entities, rx + 0 * wallWidth, ry + y * wallHeight);
		createWall(entities, rx + (roomWidth - 1) * wallWidth, ry + y * wallHeight);
	}

	for (var i = 0; i < 8; i++) {
		var px = Math.floor(Math.random() * (roomWidth - 2)) + 1;
		var py = Math.floor(Math.random() * (roomHeight - 2)) + 1;
		createPerson(entities, rx + (px * wallWidth), ry + (py * wallHeight));
	}

	[ "bed", "breathing machine", "ekg", "iv", "potted plant" ].forEach(function(prefab) {
		var prop = copyEntityComponents(prefabs[prefab], entities.add());
		var x = Math.floor(Math.random() * (roomWidth - 2)) + 1;
		var y = Math.floor(Math.random() * (roomHeight - 2)) + 1;
		prop.position.x = rx + x * wallWidth;
		prop.position.y = ry + y * wallWidth;
	});
}

function createWall(entities, x, y) {
	var prop = copyEntityComponents(prefabs.wall, entities.add());
	prop.position.x = x;
	prop.position.y = y;
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsed) { // jshint ignore:line
		var forwardSpeed = 0.5;
		var angle = entity.rotation.angle + (Math.PI / 2);
		entity.velocity.x = forwardSpeed * Math.cos(angle);
		entity.velocity.y = forwardSpeed * Math.sin(angle);

		if (!createdRooms) {
			for (var y = 0; y < 1; y++) {
				for (var x = -1; x < 2; x++) {
					var rx = x * roomWidth * wallWidth;
					var ry = y * roomHeight * wallHeight;
					console.log(rx, ry);
					createRoom(data.entities, rx, ry);
				}
			}
			// createRoom(data.entities, 0, 0);
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
