var assert = require("assert"),
    utils = require("./utils");

var Console;
var obj;
var func;

before(function(done) {
  utils.loadTab('dom.html', function(aTab) {
    Console = aTab.Console;
    Console.evaluateJS('x = {a: 2, b: {c: 3}}', function(resp) {
      obj = resp.result;

      var input = 'y = function testfunc(a, b) { return a + b; }';
      Console.evaluateJS(input, function(resp) {
        func = resp.result;
        console.log(func);
        done();
      })
    });
  });
});

// JSObject - ownPropertyNames(), ownPropertyDescriptor(), prototype(), properties()

describe('ownPropertyNames()', function() {
  it('should fetch property names', function(done) {
    obj.ownPropertyNames(function(names) {
      assert.deepEqual(names, ['a', 'b']);
      done();
    })
  })
});

describe('ownPropertyDescriptor()', function() {
  it('should fetch descriptor for property', function(done) {
    obj.ownPropertyDescriptor('a', function(desc) {
      console.log("desc", desc);
      testDescriptor(desc);
      assert.equal(desc.value, 2);
      done();
    })
  })

  /* TODO: doesn't call callback if not defined property - Server side problem
  it('should be undefined for nonexistent property', function(done) {
    obj.ownPropertyDescriptor('g', function(desc) {
      console.log("desc", desc);
      done();
    })
  }) */
})

describe('ownProperties()', function() {
  it('should fetch all own properties and descriptors', function(done) {
    obj.ownProperties(function(props) {
      testDescriptor(props.a);
      assert.equal(props.a.value, 2);

      testDescriptor(props.b);
      assert.ok(props.b.value.ownProperties, "prop value has JSObject methods");
      done();
    })
  })
})

describe('prototype()', function() {
  it('should fetch prototype as an object', function(done) {
    obj.prototype(function(proto) {
      assert.ok(proto.ownProperties, "prototype has JSObject methods");
      done();
    })
  })
})

describe('Function objects', function() {
  it('sould have correct properties', function() {
    assert.equal(func.class, "Function");
    assert.equal(func.name, "testfunc");
    assert.ok(func.ownProperties, "function has JSObject methods")
  })
})

function testDescriptor(desc) {
  assert.strictEqual(desc.configurable, true);
  assert.strictEqual(desc.enumerable, true);
  assert.strictEqual(desc.writable, true);
}