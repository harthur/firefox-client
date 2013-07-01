var events = require("events"),
    extend = require("./extend");

var ClientMethods = extend(events.EventEmitter.prototype, {
  initialize: function(client, actor) {
    this.client = client;
    this.actor = actor;
    console.log("setting actor to ", actor);

    this.client.on('message', function(message) {
      console.log("GOT MESSAGE from client");
      console.log(message.from, this.actor);
      if (message.from == this.actor) {
        console.log("gonna emit ", message.type, message);
        this.emit(message.type, message);
      }
    }.bind(this));
  },

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
})

module.exports = ClientMethods;