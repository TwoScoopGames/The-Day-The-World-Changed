"use strict";

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var Splat = require("splatjs");

var main = new Splat.Scene();

var entities = require("./entities");
main.entities.load(entities);

var animations = require("./animations");
var input = new Splat.Input(require("./inputs"));

var images = new Splat.ImageLoader();
images.loadFromManifest(require("./images"));

var sounds = new Splat.SoundLoader();
console.log(sounds);
sounds.loadFromManifest(require("./sounds"));

var data = {
	animations: animations,
	canvas: canvas,
	entities: main.entities,
	images: images,
	input: input,
	sounds: sounds
};

function installSystems(systems, ecs) {
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
var systems = require("./systems");
installSystems(systems.simulation, main.simulation);
installSystems(systems.renderer, main.renderer);

function percentLoaded() {
	return (images.loadedImages + sounds.loadedSounds) / (images.totalImages + sounds.totalSounds);
}
var loading = Splat.loadingScene(canvas, percentLoaded, main);
loading.start(context);
