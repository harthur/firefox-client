var extend = require("./extend");
var ClientMethods = require("./client-methods");

module.exports = StyleSheets;

function StyleSheets(client, actor) {
  this.initialize(client, actor);
}

StyleSheets.prototype = extend(ClientMethods, {
  listStyleSheets: function(callback) {
    var client = this.client;

    this.request('getStyleSheets', function(resp) {
      var sheets = resp.styleSheets.map(function(sheet) {
        return new StyleSheet(client, sheet);
      })
      callback(sheets);
    });
  },

  addStyleSheet: function(text, callback) {
    this.request('newStyleSheet', { text: text }, function(resp) {
      var sheet = new StyleSheet(this.client, resp.styleSheet);
      callback(sheet);
    }.bind(this));
  }
})

function StyleSheet(client, sheet) {
  this.initialize(client, sheet.actor);
  this.sheet = sheet;
}

StyleSheet.prototype = extend(ClientMethods, {
  get href() {
    return this.sheet.href;
  },

  get disabled() {
    return this.sheet.disabled;
  },

  get ruleCount() {
    return this.sheet.ruleCount;
  },

  update: function(text, callback) {
    this.request('update', { text: text }, callback);
  }
})