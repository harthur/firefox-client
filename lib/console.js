var select = require("js-select"),
    extend = require("./extend"),
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

  /**
   * Response object:
   *   -empty-
   */
  startListening: function(callback) {
    this.request('startListeners', { listeners: this.types }, callback);
  },

  /**
   * Response object:
   *   -empty-
   */
  stopListening: function(callback) {
    this.request('stopListeners', { listeners: this.types }, callback);
  },

  /**
   * Event object:
   *   level - "log", etc.
   *   filename - file log was called in
   *   lineNumber - line number of log call
   *   functionName - function log called from
   *   timeStamp - ms timestamp of log call
   *   arguments - array of args to log call
   *   private -
   */
  onConsoleAPI: function(event) {
    var message = this.transformConsoleCall(event.message);

    this.emit("console-api-call", message);
  },

  /**
   * Event object:
   *   errorMessage - string error message
   *   sourceName - file error
   *   lineText
   *   lineNumber - line number of error
   *   columnNumber - column number of error
   *   category - usually "content javascript",
   *   timeStamp - time in ms of error occurance
   *   warning - whether it's a warning
   *   error - whether it's an error
   *   exception - whether it's an exception
   *   strict -
   *   private -
   */
  onPageError: function(event) {
    this.emit("page-error", event.pageError);
  },

  /**
   * Response object: array of page error or console call objects.
   */
  getCachedLogs: function(callback) {
    var message = {
      messageTypes: this.types
    };
    this.request('getCachedMessages', message, function(resp) {
      select(resp, ".messages > *").update(this.transformConsoleCall);
      return resp.messages;
    }, callback);
  },

  /**
   * Response object:
   *   -empty-
   */
  clearCachedLogs: function(callback) {
    this.request('clearMessagesCache', callback);
  },

  /**
   * Response object:
   *   input - original input
   *   result - result of the evaluation, a value or JSObject
   *   timestamp - timestamp in ms of the evaluation
   *   exception - any exception as a result of the evaluation
   */
  evaluateJS: function(text, callback) {
    this.request('evaluateJS', { text: text }, function(resp) {
      return select(resp, ".result").update(this.createJSObject.bind(this));
    }.bind(this), callback)
  },

  transformConsoleCall: function(message) {
    return select(message, ".arguments > *").update(this.createJSObject.bind(this));
  }
})
