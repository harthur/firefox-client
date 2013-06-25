module.exports = StyleSheets;

function StyleSheets(client, actor) {
  this.client = client;
  this.actor = actor;
}

StyleSheets.prototype = {
  listStyleSheets: function(callback) {
    var client = this.client;

    this.request("getStyleSheets", {}, function(resp) {
      var sheets = resp.styleSheets.map(function(sheet) {
        return new StyleSheet(client, sheet);
      })
      callback(sheets);
    });
  },

  addStyleSheet: function(text, callback) {
    this.request("newStyleSheet", { text: text }, function(resp) {
      var sheet = new StyleSheet(this.client, resp.styleSheet);
      callback(sheet);
    }.bind(this));
  },

  // TODO: temp - until settle on inheritence impl
  request: function(type, message, callback) {
    message = message || {};
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(message, callback);
  }
}

function StyleSheet(client, sheet) {
  this.client = client;
  this.sheet = sheet;
}

StyleSheet.prototype = {
  get actor() {
    return this.sheet.actor;
  },

  get href() {
    return this.sheet.href;
  },

  get disabled() {
    return this.sheet.disabled;
  },

  get ruleCount() {
    return this.sheet.ruleCount;
  },

  // TODO: temp - until settle on inheritence impl
  request: function(type, message, callback) {
    message = message || {};
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(message, callback);
  }
}