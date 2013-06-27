var ClientMethods = {
  request: function(type, message, callback) {
    message = message || {};
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(message, callback);
  }
}

module.exports = ClientMethods;