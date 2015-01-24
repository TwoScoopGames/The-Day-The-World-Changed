var browserify = require("browserify");
var fs = require("fs");

var b = browserify();
b.add("./game.js");

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
