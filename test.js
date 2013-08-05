var RDPServer = require("./test/rdp-server.js");
var HTTPServer = require("./test/http-server.js");

RDPServer.listen(5001);
HTTPServer.listen(3000);

var Mocha = require('mocha'),
    fs = require('fs'),
    path = require('path');

var mocha = new Mocha();

function load() {
  fs.readdirSync('test/').filter(function(file){
    // Only keep the test-*.js files
    return file.substr(0,5) === "test-" && file.substr(-3) === '.js';
  }).forEach(function(file){
    console.log("ADD TEST FILE:", file);
    mocha.addFile(
      path.join('test/', file)
    );
  });
}

function purge() {
  mocha.files.forEach(function(file){
      delete require.cache[file];
  });
}

function run(client) {
  try {
    mocha.ui('tdd').run(function(failures){
      console.log("FAILURES: ", failures);
      RDPServer.exitConnectedClient(client);
      purge();
      process.exit(failures > 0 ? 1: 0);
    });
  } catch(e) {
    console.log("EXCEPTION: ", e);
    process.exit(1);
  }
}

RDPServer.on("connected", function (client) {
  mocha.reporter('list');
  load();
  run(client);
});
