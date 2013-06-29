var events = require("events");

// ClientMethods = extend(events.EventEmitter, {})

var ClientMethods = {
  request: function(type, message, callback) {
    if (!callback) {
      callback = message;
      message = {};
    }
    message.to = this.actor;
    message.type = type;

    console.log("request: ", JSON.stringify(message));
    this.client.makeRequest(message, callback);
  }
}

module.exports = ClientMethods;