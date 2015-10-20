/* @wolfram77 */
/* RUN - build and run the server */

// required modules
var childProcess = require('child_process');
var fs = require('fs');
var $serial = require('./mods/code/serial');


// check if directory exists
var dirExists = function(path) {
	try { return fs.lstatSync(path).isDirectory(); }
	catch(e) { return false; }
};


// run shell command (serial)
var shell = function(cmd, fn) {
	var c = childProcess.exec(cmd, fn);
	c.stdout.pipe(process.stdout);
	c.stderr.pipe(process.stderr);
};

// has dependencies?
var hasDeps = function() {
	if(!dirExists('node_modules')) return false;
	var pkg = JSON.parse(fs.readFileSync('package.json'));
	var deps = (Object.keys(pkg.dependencies||{})).concat(Object.keys(pkg.devDependencies||{}));
	for(var i=0; i<deps.length; i++)
		if(!dirExists('node_modules/'+deps[i])) return false;
	return true;
};

// run program
var run = function() {
	var shellser = new $serial();
	if(!hasDeps()) shellser.run(function() {
		console.log('\x1b[36m'+'run> installing dependencies'+'\x1b[0m');
		shell('npm install', function() { console.log('\n'); shellser.end(); });
	});
	shellser.run(function() {
		console.log('\x1b[36m'+'run> starting server'+'\x1b[0m');
		shell('node index', function() { console.log('\x1b[36m'+'run> server stopped'+'\x1b[0m'); shellser.end(); });
	});
};

// ready
run();