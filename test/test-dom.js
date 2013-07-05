var assert = require("assert"),
    utils = require("./utils");

    var colors = require("colors");

var doc;
var DOM;
var node;
var firstNode;
var lastNode;

before(function(done) {
  utils.loadTab('dom.html', function(aTab) {
    DOM = aTab.DOM;
    DOM.document(function(aDoc) {
      doc = aDoc;
      doc.querySelectorAll(".item", function(items) {
        firstNode = items[0];
        node = items[1];
        lastNode = items[2];
        done();
      })
    })
  });
});

// DOM - document(), documentElement()

describe('document()', function() {
  it('should get document node', function(done) {
    DOM.document(function(doc) {
      assert.equal(doc.nodeName, "#document");
      assert.equal(doc.nodeType, 9);
      done();
    })
  })
})

describe('documentElement()', function() {
  it('should get documentElement node', function(done) {
    DOM.documentElement(function(elem) {
      assert.equal(elem.nodeName, "HTML");
      assert.equal(elem.nodeType, 1);
      done();
    })
  })
})

// Node - parentNode(), parent(), siblings(), nextSibling(), previousSibling(),
// querySelector(), querySelectorAll(), innerHTML(), outerHTML(), getAttribute(),
// setAttribute()

describe('parentNode()', function() {
  it('should get parent node', function(done) {
    node.parentNode(function(parent) {
      assert.equal(parent.nodeName, "SECTION");
      assert.ok(parent.querySelector, "parent has node methods");
      done();
    })
  })

  it('should be null for document parentNode', function(done) {
    doc.parentNode(function(parent) {
      assert.strictEqual(parent, null);
      done();
    })
  })
})

describe('parents()', function() {
  it('should get ancestor nodes', function(done) {
    node.parents(function(ancestors) {
      var names = ancestors.map(function(ancestor) {
        assert.ok(ancestor.querySelector, "ancestor has node methods");
        return ancestor.nodeName;
      })
      assert.deepEqual(names, ["SECTION","MAIN","BODY","HTML","#document"]);
      done();
    })
  })
})

describe('children()', function() {
  it('should get child nodes', function(done) {
    node.children(function(children) {
      var ids = children.map(function(child) {
        assert.ok(child.querySelector, "child has node methods");
        return child.getAttribute("id");
      })
      assert.deepEqual(ids, ["child1","child2"]);
      done();
    })
  })
})

describe('siblings()', function() {
  it('should get sibling nodes', function(done) {
    node.siblings(function(siblings) {
      var ids = siblings.map(function(sibling) {
        assert.ok(sibling.querySelector, "sibling has node methods");
        return sibling.getAttribute("id");
      })
      assert.deepEqual(ids, ["test1","test2","test3"]);
      done();
    })
  })
})

describe('nextSibling()', function() {
  it('should get next sibling node', function(done) {
    node.nextSibling(function(sibling) {
      assert.equal(sibling.getAttribute("id"), "test3");
      assert.ok(sibling.querySelector, "next sibling has node methods");
      done();
    })
  })

  it('should be null if no next sibling', function(done) {
    lastNode.nextSibling(function(sibling) {
      assert.strictEqual(sibling, null);
      done();
    })
  })
})

describe('previousSibling()', function() {
  it('should get next sibling node', function(done) {
    node.previousSibling(function(sibling) {
      assert.equal(sibling.getAttribute("id"), "test1");
      assert.ok(sibling.querySelector, "next sibling has node methods");
      done();
    })
  })

  it('should be null if no prev sibling', function(done) {
    firstNode.previousSibling(function(sibling) {
      assert.strictEqual(sibling, null);
      done();
    })
  })
})

describe('querySelector()', function() {
  it('should get first child node', function(done) {
    node.querySelector("*", function(child) {
      assert.equal(child.getAttribute("id"), "child1");
      assert.ok(child.querySelector, "parent has node methods");
      done();
    })
  })

  it('should be null if no nodes with selector', function(done) {
    node.querySelector("blarg", function(resp) {
      assert.strictEqual(resp, null);
      done();
    })
  })
})

describe('querySelectorAll()', function() {
  it('should get all child nodes', function(done) {
    node.querySelectorAll("*", function(children) {
      var ids = children.map(function(child) {
        assert.ok(child.querySelector, "sibling has node methods");
        return child.getAttribute("id");
      })
      assert.deepEqual(ids, ["child1", "child2"]);
      done();
    })
  })

  it('should be empty list if no nodes with selector', function(done) {
    node.querySelectorAll("blarg", function(resp) {
      assert.deepEqual(resp, []);
      done();
    })
  })
})

describe('innerHTML()', function() {
  it('should get innerHTML of node', function(done) {
    node.innerHTML(function(text) {
      assert.equal(text, '\n          <div id="child1"></div>\n'
                   + '          <div id="child2"></div>\n      ');
      done();
    })
  })
})

describe('outerHTML()', function() {
  it('should get outerHTML of node', function(done) {
    node.outerHTML(function(text) {
      assert.equal(text, '<div id="test2" class="item">\n'
                   + '          <div id="child1"></div>\n'
                   + '          <div id="child2"></div>\n      '
                   + '</div>');
      done();
    })
  })
})
