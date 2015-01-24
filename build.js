var browserify = require("browserify");
var fs = require("fs");

var b = browserify();
b.add("./game.js");

var scripts = require("./scripts");
scripts.forEach(function(script) {
	b.require(script);
});

var systems = require("./systems");
systems.simulation.forEach(function(system) {
	if (system.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(system);
});
systems.renderer.forEach(function(system) {
	if (system.indexOf("splatjs:") === 0) {
		return;
	}
	b.require(system);
});

var out = fs.createWriteStream("./index.js");
b.bundle().pipe(out);
