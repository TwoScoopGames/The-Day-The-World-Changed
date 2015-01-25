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

var title = makeScene("title");
title.renderer.add(function(entities, context) { // jshint ignore:line
	if (input.button("left") || input.button("right")) {
		title.stop();
		main.start(context);
	}
});

var img = title.entities.add();
img.position = {
	x: 0,
	y: 0
};
img.image = {
	name: "titlescreen",
	sourceX: 0,
	sourceY: 0,
	sourceWidth: 1136,
	sourceHeight: 640,
	destinationX: 0,
	destinationY: 0,
	destinationWidth: 1136,
	destinationHeight: 640
};

function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, title);
loading.start(context);
