var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    JSObject = require("./jsobject");

module.exports = Console;

function Console(client, actor) {
  this.initialize(client, actor);

  this.on("consoleAPICall", this.onConsoleAPI.bind(this));
  this.on("pageError", this.onPageError.bind(this));
}

Console.prototype = extend(ClientMethods, {
  types: ["PageError", "ConsoleAPI"],

  startLogging: function(callback) {
    this.request('startListeners', { listeners: this.types }, callback);
  },

  stopLogging: function(callback) {
    this.request('stopListeners', { listeners: this.types }, callback);
  },

  onConsoleAPI: function(event) {
    this.emit("console-api-call", event.message);
  },

  onPageError: function(event) {
    this.emit("page-error", event.pageError);
  },

  getCachedLogs: function(callback) {
    var message = {
      messageTypes: this.types
    };
    this.request('getCachedMessages', message, callback, 'messages');
  },

  clearCachedLogs: function(callback) {
    this.request('clearMessagesCache', callback);
  },

  evaluateJS: function(text, callback) {
    var message = { messageTypes: this.types };
    this.request('evaluateJS', { text: text }, function(resp) {
      var result = resp.result;
      if (result && result.type == "object") {
        // TODO: write objectify function
        resp.result = new JSObject(this.client, result);
      }
      if (callback) {
        callback(resp);
      }
    }.bind(this))
  }
})
