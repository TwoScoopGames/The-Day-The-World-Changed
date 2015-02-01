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

function loadScript(script) {
	if (script.indexOf("splatjs:") === 0) {
		var names = script.substr(8).split(".");

		return names.reduce(function(obj, name) {
			return obj[name];
		}, Splat.systems);
	} else {
		return require(script);
	}
}

function installSystems(systems, ecs, data) {
	systems.forEach(function(system) {
		loadScript(system)(ecs, data);
	});
}

var entities = require("./entities");
makeScene("main");

function makeScene(name) {
	var scene = new Splat.Scene();
	scene.entities.load(entities[name]);
	var data = {
		animations: animations,
		canvas: canvas,
		context: context,
		entities: scene.entities,
		images: images,
		input: input,
		require: loadScript,
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
		scenes.title.stop();
		sounds.play("crickets", true);
		scenes.intro1.start(context);
	}
});

var intro1 = makeScene("intro1");
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
			sounds.stop("crickets");
			sounds.play("hospital-sounds", true);
			scenes.sixMonths.start(context);
		}
		words.seq++;
	}
	words.lastPressed = isPressed;
});

var sixMonths = makeScene("sixMonths");

sixMonths.renderer.add(function(entities, context) { // jshint ignore:line
	var words2 = entities[2];
	var isPressed  = input.button("left") || input.button("right");
	if (words2.lastPressed === false && isPressed && words2.text !== undefined) {
		scenes.sixMonths.stop();
		sounds.play("shark-birth", true);
		scenes.intro2.start(context);
	}
	words2.lastPressed = isPressed;
});


var intro2 = makeScene("intro2");

intro2.renderer.add(function(entities, context) { // jshint ignore:line
	var isPressed  = input.button("left") || input.button("right");
	if (intro2.lastPressed === false && isPressed) {
		scenes.intro2.stop();
		sounds.stop("shark-birth");
		sounds.stop("hospital-sounds");
		sounds.play("go");
		scenes.go.start(context);
	}
	intro2.lastPressed = isPressed;
});

var go = makeScene("go");
go.renderer.add(function(entities, context) { // jshint ignore:line
	var isPressed  = input.button("left") || input.button("right");
	if (go.lastPressed === false && isPressed) {
		scenes.go.stop();
		sounds.play("Wake_-_67_-_Duckbag", true);
		scenes.main.start(context);
	}
	go.lastPressed = isPressed;
});

makeScene("end");

function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, title);
loading.start(context);
