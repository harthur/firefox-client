var assert = require("assert"),
    path = require("path"),
    utils = require("./utils");

var StyleSheets;
var styleSheet;

before(function(done) {
  utils.loadTab('stylesheets.html', function(aTab) {
    StyleSheets = aTab.StyleSheets;
    StyleSheets.listStyleSheets(function(err, sheets) {
      assert.strictEqual(err, null);
      styleSheet = sheets[1];
      done();
    })
  });
});

// Stylesheets - listStyleSheets(), addStyleSheet()

describe('listStyleSheets()', function() {
  it('should list all the stylesheets', function(done) {
    StyleSheets.listStyleSheets(function(err, sheets) {
      assert.strictEqual(err, null);

      var hrefs = sheets.map(function(sheet) {
        assert.ok(sheet.update, "sheet has Stylesheet methods");
        return path.basename(sheet.href);
      });
      assert.deepEqual(hrefs, ["null", "stylesheet1.css"]);
      done();
    })
  })
})

describe('addStyleSheet()', function() {
  it('should add a new stylesheet', function(done) {
    var text = "div { font-weight: bold; }";

    StyleSheets.addStyleSheet(text, function(err, sheet) {
      assert.strictEqual(err, null);
      assert.ok(sheet.update, "sheet has Stylesheet methods");
      assert.equal(sheet.ruleCount, 1);
      done();
    })
  })
})

// StyleSheet - update()

describe('StyleSheet', function() {
  it('should have the correct properties', function() {
    assert.equal(path.basename(styleSheet.href), "stylesheet1.css");
    assert.strictEqual(styleSheet.disabled, false);
    assert.equal(styleSheet.ruleCount, 2);
  })
})

describe('StyleSheet.update()', function() {
  it('should update stylesheet', function(done) {
    var text = "main { color: red; }";

    styleSheet.update(text, function(err, resp) {
      assert.strictEqual(err, null);
      // TODO: assert.equal(styleSheet.ruleCount, 1);
      done();
    })
  })
})
