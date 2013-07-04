var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    JSObject = require("./jsobject");

module.exports = Console;

function Console(client, actor) {
  this.initialize(client, actor);
}

Console.prototype = extend(ClientMethods, {
  evaluateJS: function(text, callback) {
    var message = { messageTypes: this.types };
    this.request('evaluateJS', { text: text }, function(resp) {
      var result = resp.result;
      if (result && result.type == "object") {
        // TODO: write objectify function
        resp.result = new JSObject(this.client, result);
      }
      callback(resp);
    }.bind(this))
  }
})
