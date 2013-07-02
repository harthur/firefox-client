var events = require("events"),
    extend = require("./extend");

var ClientMethods = extend(events.EventEmitter.prototype, {
  initialize: function(client, actor) {
    this.client = client;
    this.actor = actor;

    this.client.on('message', function(message) {
      if (message.from == this.actor) {
        this.emit(message.type, message);
      }
    }.bind(this));
  },

  request: function(type, message, callback) {
    if (!message) {
      message = {};
    }
    if (typeof message == "function") {
      callback = message;
      message = {};
    }
    if (!callback) {
      callback = function() {};
    }
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(message, callback);
  }
})

module.exports = ClientMethods;