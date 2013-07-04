var assert = require("assert"),
    utils = require("./utils");

// DOM - document(), documentElement()
// Node - parentNode(), parent(), siblings(), nextSibling(), previousSibling(),
// querySelector(), querySelectorAll(), innerHTML(), outerHTML(), getAttribute(),
// setAttribute()

var DOM;
before(function(done) {
  utils.loadTab('dom.html', function(aTab) {
    DOM = aTab.DOM;
    done();
  });
});


describe('document()', function() {
  it('should get document node', function() {
    DOM.document(function(doc) {
      assert.equal(doc.nodeName, "#document");
      done();
    })
  })
})
