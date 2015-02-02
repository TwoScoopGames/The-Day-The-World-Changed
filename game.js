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
makeScene("intro1");
makeScene("sixMonths");
makeScene("intro2");

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
