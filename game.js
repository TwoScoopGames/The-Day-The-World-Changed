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

var scenes = {};
var currentScene;

function switchScene(name) {
	if (currentScene !== undefined) {
		currentScene.stop();
	}
	currentScene = scenes[name];
	currentScene.start(context);
}

function makeScene(name, sceneData) {
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
		sounds: sounds,
		switchScene: switchScene
	};
	scenes[name] = scene;

	installSystems(systems.simulation, scene.simulation, data);
	installSystems(systems.renderer, scene.renderer, data);

	if (typeof sceneData.onEnter === "string") {
		scene.onEnter = require(sceneData.onEnter).bind(scene, data);
	}
	if (typeof sceneData.onExit === "string") {
		scene.onExit = require(sceneData.onExit).bind(scene, data);
	}

	return scene;
}

var first;
var sceneList = require("./scenes");
Object.keys(sceneList).forEach(function(scene) {
	var s = makeScene(scene, sceneList[scene]);
	if (sceneList[scene].first) {
		first = s;
	}
});

function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, first);
currentScene = first;
loading.start(context);
