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

  request: function(type, message, callback, property) {
    // message argument is optional
    if (!message) {
      message = {};
    }
    if (typeof message == "function") {
      property = callback;
      callback = message;
      message = {};
    }
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(message, function(resp) {
      delete resp.from;

      if (property && resp[property] !== undefined) {
        resp = resp[property];
      }

      if (callback) {
        callback(resp);
      }
    });
  }
})

module.exports = ClientMethods;