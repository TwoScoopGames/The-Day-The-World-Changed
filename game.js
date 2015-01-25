"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Splat = require("splatjs");

var animations = require("./animations");
var input = new Splat.Input(require("./inputs"));

var images = new Splat.ImageLoader();
images.loadFromManifest(require("./images"));

var sounds = new Splat.SoundLoader();
sounds.loadFromManifest(require("./sounds"));

var scenes = {};
var systems = require("./systems");

function installSystems(systems, ecs, data) {
	systems.forEach(function(system) {
		if (system.indexOf("splatjs:") === 0) {
			var names = system.substr(8).split(".");

			var func = names.reduce(function(obj, name) {
				return obj[name];
			}, Splat.systems);
			func(ecs, data);
		} else {
			require(system)(ecs, data);
		}
	});
}

var main = makeScene("main");
main.entities.load(require("./entities"));

function makeScene(name) {
	var scene = new Splat.Scene();
	var data = {
		animations: animations,
		canvas: canvas,
		entities: scene.entities,
		images: images,
		input: input,
		scenes: scenes,
		sounds: sounds
	};
	scenes[name] = scene;
	installSystems(systems.simulation, scene.simulation, data);
	installSystems(systems.renderer, scene.renderer, data);
	return scene;
}

function fullScreenImage(scene, name) {
	var img = scene.entities.add();
	img.position = {
		x: 0,
		y: 0
	};
	img.image = {
		name: name,
		sourceX: 0,
		sourceY: 0,
		sourceWidth: 1136,
		sourceHeight: 640,
		destinationX: 0,
		destinationY: 0,
		destinationWidth: 1136,
		destinationHeight: 640
	};
	return img;
}

function arrows(scene) {
	var img = scene.entities.add();
	img.position = {
		x: 929,
		y: 498
	};
	img.image = {
		name: name,
		sourceX: 0,
		sourceY: 0,
		sourceWidth: 186,
		sourceHeight: 126,
		destinationX: 0,
		destinationY: 0,
		destinationWidth: 186,
		destinationHeight: 126
	};
	img.animation = {
		"time": 0,
		"frame": 0,
		"loop": true,
		"speed": 0.3,
		"name": "arrows-right-f2"
	};
	return img;
}

var title = makeScene("title");
title.renderer.add(function(entities, context) { // jshint ignore:line
	if (input.button("left") || input.button("right")) {
		scenes.title.stop();
		scenes.intro1.start(context);
	}
});
fullScreenImage(title, "titlescreen");
arrows(title);

var intro1 = makeScene("intro1");
fullScreenImage(intro1, "intro-1");
arrows(intro1);

var words = intro1.entities.add();
words.position = {
	x: 500,
	y: 200
};
words.timers = {
	showText: {
		running: true,
		time: 0,
		max: 1000,
		script: "./lib/add-text-1"
	}
};
words.seq = 0;

intro1.renderer.add(function(entities, context) { // jshint ignore:line
	var isPressed  = input.button("left") || input.button("right");
	if (words.lastPressed === false && isPressed && words.text !== undefined) {
		words.text.a = 0;
		if (words.seq === 0) {
			words.text.text = "I'm pregnant.";
		} else if (words.seq === 1) {
			words.text.text = "What do we do now?";
			words.position.x = 200;
			words.position.y = 410;
		} else if (words.seq === 2) {
			scenes.intro1.stop();
			scenes.sixMonths.start(context);
		}
		words.seq++;
	}
	words.lastPressed = isPressed;
});

var sixMonths = makeScene("sixMonths");
fullScreenImage(sixMonths, "black-screen");
arrows(sixMonths);
var words2 = sixMonths.entities.add();
words2.position = {
	x: 300,
	y: 300
};
words2.timers = {
	showText: {
		running: true,
		time: 0,
		max: 1000,
		script: "./lib/add-text-2"
	}
};
sixMonths.renderer.add(function(entities, context) { // jshint ignore:line
	var isPressed  = input.button("left") || input.button("right");
	if (words2.lastPressed === false && isPressed && words2.text !== undefined) {
		scenes.sixMonths.stop();
		scenes.intro2.start(context);
	}
	words2.lastPressed = isPressed;
});


var intro2 = makeScene("intro2");
fullScreenImage(intro2, "intro-2");
arrows(intro2);

var legs = intro2.entities.add();
legs.position = {
	x: 98,
	y: 214
};
legs.image = {
	name: "legs",
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 940,
	sourceHeight: 426,
	destinationX: 0,
	destinationY: 0,
	destinationWidth: 940,
	destinationHeight: 426
};

var doctor = intro2.entities.add();
doctor.position = {
	x: 357,
	y: 0
};
doctor.velocity = {
	x: 0,
	y: 0.05
};
doctor.image = {
	name: "doctor-intro1",
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 446,
	sourceHeight: 640,
	destinationX: 0,
	destinationY: 0,
	destinationWidth: 446,
	destinationHeight: 640
};
doctor.timers = {
	doctor: {
		running: true,
		time: 0,
		max: 3000,
		script: "./lib/doctor-freak-out"
	},
	stop: {
		running: true,
		time: 0,
		max: 6000,
		script: "./lib/doctor-stop"
	}
};

intro2.renderer.add(function(entities, context) { // jshint ignore:line
	var isPressed  = input.button("left") || input.button("right");
	if (intro2.lastPressed === false && isPressed) {
		scenes.intro2.stop();
		scenes.main.start(context);
	}
	intro2.lastPressed = isPressed;
});

function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, title);
loading.start(context);
