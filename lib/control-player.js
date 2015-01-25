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

function createRoom(entities, rx, ry) {
	var width = 20;
	var height = 12;

	var wallWidth = 74;
	var wallHeight = 71;

	var doorWidth = 4;
	var doorStart = (width - doorWidth) / 2;

	for (var x = 0; x < width; x++) {
		createWall(entities, rx + x * wallWidth, ry + 0 * wallHeight);
		if (x < doorStart || x > doorStart + doorWidth) {
			createWall(entities, rx + x * wallWidth, ry + (height - 1) * wallHeight);
		}
	}

	for (var y = 1; y < height - 1; y++) {
		createWall(entities, rx + 0 * wallWidth, ry + y * wallHeight);
		createWall(entities, rx + (width - 1) * wallWidth, ry + y * wallHeight);
	}

	for (var i = 0; i < 8; i++) {
		var px = Math.floor(Math.random() * (width - 2)) + 1;
		var py = Math.floor(Math.random() * (height - 2)) + 1;
		createPerson(entities, rx + (px * wallWidth), ry + (py * wallHeight));
	}

	[ "breathing machine", "ekg", "iv", "potted plant" ].forEach(function(prefab) {
		var prop = copyEntityComponents(prefabs[prefab], entities.add());
		var x = Math.floor(Math.random() * (width - 2)) + 1;
		var y = Math.floor(Math.random() * (height - 2)) + 1;
		prop.position.x = x * wallWidth;
		prop.position.y = y * wallWidth;
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
			createRoom(data.entities, 0, 0);
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
