var assert = require("assert"),
    utils = require("./utils");

var Console;
var Obj;

before(function(done) {
  utils.loadTab('dom.html', function(aTab) {
    Console = aTab.Console;
    Console.evaluateJS('x = {a: 2, b: {c: 3}}', function(resp) {
      Obj = resp.result;
      done();
    });
  });
});

// JSObject - ownPropertyNames(), ownPropertyDescriptor(), prototype(), properties()

describe('ownPropertyNames()', function() {
  it('should fetch property names', function(done) {
    Obj.ownPropertyNames(function(names) {
      assert.deepEqual(names, ['a', 'b']);
      done();
    })
  })
});

describe('ownPropertyDescriptor()', function() {
  it('should fetch descriptor for property', function(done) {
    Obj.ownPropertyDescriptor('a', function(desc) {
      console.log("desc", desc);
      testDescriptor(desc);
      assert.equal(desc.value, 2);
      done();
    })
  })

  /* TODO: doesn't call callback if not defined property - Server side problem
  it('should be undefined for nonexistent property', function(done) {
    Obj.ownPropertyDescriptor('g', function(desc) {
      console.log("desc", desc);
      done();
    })
  }) */
})

describe('ownProperties()', function() {
  it('should fetch all own properties and descriptors', function(done) {
    Obj.ownProperties(function(props) {
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
    Obj.prototype(function(proto) {
      assert.ok(proto.ownProperties, "prototype has JSObject methods");
      done();
    })
  })
})


function testDescriptor(desc) {
  assert.strictEqual(desc.configurable, true);
  assert.strictEqual(desc.enumerable, true);
  assert.strictEqual(desc.writable, true);
}