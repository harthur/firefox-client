var assert = require("assert"),
    utils = require("./utils");

var Console;

before(function(done) {
  utils.loadTab('dom.html', function(aTab) {
    Console = aTab.Console;
    done();
  });
});

// Console - evaluateJS()

describe('evaluateJS()', function() {
  it('should evaluate expr to number', function(done) {
    Console.evaluateJS('6 + 7', function(resp) {
      assert.equal(resp.result, 13);
      done();
    })
  })

  it('should evaluate expr to boolean', function(done) {
    Console.evaluateJS('!!window', function(resp) {
      assert.strictEqual(resp.result, true);
      done();
    })
  })

  it('should evaluate expr to string', function(done) {
    Console.evaluateJS('"hello"', function(resp) {
      assert.equal(resp.result, "hello");
      done();
    })
  })

  it('should evaluate expr to JSObject', function(done) {
    Console.evaluateJS('x = {a: 2, b: "hello"}', function(resp) {
      assert.ok(resp.result.ownPropertyNames, "result has JSObject methods");
      done();
    })
  })

  it('should evaluate to undefined', function(done) {
    Console.evaluateJS('x = {a: 2, b: "hello"}', function(resp) {
      assert.ok(resp.result.ownPropertyNames, "result has JSObject methods");
      done();
    })
  })

  it('should have exception in response', function(done) {
    Console.evaluateJS('blargh', function(resp) {
      assert.equal(resp.exception.class, "Error"); // TODO: error should be JSObject
      assert.equal(resp.exceptionMessage, "ReferenceError: blargh is not defined");
      done();
    })
  })
})
