#!/usr/bin/env node

var path = require('path'),
	pkg  = require(path.join(__dirname, '..', 'package.json')),
	DEFAULT_DEPTH = 1;

// Parse command line options
var program = require('commander');

program
    .version(pkg.version)
    .option('-d, --depth <depth>', 'Depth to which data the data structure should be summarized. Defaults to 1.', parseInt)
    .parse(process.argv);

var depth = program.depth === undefined ? DEFAULT_DEPTH : program.depth,
	showSizes = require(path.join(__dirname, '..', 'jsonsize'));

// Read data from stdin
function readInput() {
	process.stdin.resume();
    var text = "";
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (d) {
      text += d;
    });
    process.stdin.on('end', function () {
      var obj = JSON.parse(text);
      var output = showSizes(obj, depth);
      process.stdout.write(JSON.stringify(output, null, 4));
    });
}

readInput();

