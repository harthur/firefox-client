var assert = require("assert"),
    utils = require("./utils");

var colors = require("colors");

var tab;
var Logs;

before(function(done) {
  utils.loadTab('logs.html', function(aTab) {
    tab = aTab;
    Logs = aTab.Logs;

    Logs.startLogging(function() {
      done();
    })
  });
});

// Logs - startLogging(), stopLogging(), event:page-error, event:console-api-call

describe('"page-error" event', function() {
  it('should receive "page-error" event with message', function(done) {
    Logs.once('page-error', function(event) {
      assert.equal(event.errorMessage, "ReferenceError: foo is not defined");
      assert.ok(event.sourceName.indexOf("logs.html") > 0);
      assert.equal(event.lineNumber, 10);
      assert.equal(event.columnNumber, 0);
      assert.ok(event.exception);
      done();
    });

    tab.reload();
  })
})

describe('"console-api-call" event', function() {
  it('should receive "console-api-call" for console.log', function(done) {
    Logs.on('console-api-call', function(event) {
      if (event.level == "log") {
        assert.deepEqual(event.arguments, ["hi"]);

        Logs.removeAllListeners('console-api-call');
        done();
      }
    });

    tab.reload();
  })

  it('should receive "console-api-call" for console.dir', function(done) {
    Logs.on('console-api-call', function(event) {
      if (event.level == "dir") {
        var obj = event.arguments[0];
        assert.ok(obj.ownPropertyNames, "dir argument has JSObject methods");

        Logs.removeAllListeners('console-api-call');
        done();
      }
    });

    tab.reload();
  })
})

after(function() {
  Logs.removeAllListeners('console-api-call');
  Logs.removeAllListeners('page-error');

  Logs.stopLogging();
})
