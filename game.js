"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Splat = require("splatjs");

var animations = require("./animations");
var input = new Splat.Input(require("./inputs"));

var images = new Splat.ImageLoader();
images.loadFromManifest(require("./images"));

var sounds = new Splat.SoundLoader();
console.log(sounds);
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

var title = makeScene("title");
title.renderer.add(function(entities, context) { // jshint ignore:line
	if (input.button("left") || input.button("right")) {
		scenes.title.stop();
		scenes.intro1.start(context);
	}
});
fullScreenImage(title, "titlescreen");

var intro1 = makeScene("intro1");
fullScreenImage(intro1, "intro-1");

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
	if (words.lastPressed === false && isPressed) {
		words.text.a = 0;
		if (words.seq === 0) {
			words.text.text = "I'm pregnant.";
		} else if (words.seq === 1) {
			words.text.text = "What do we do now?";
			words.position.x = 200;
			words.position.y = 410;
		} else if (words.seq === 2) {
			intro1.stop();
			main.start(context);
		}
		words.seq++;
	}
	words.lastPressed = isPressed;
});


function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, title);
loading.start(context);
