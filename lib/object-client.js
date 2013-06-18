/**
 * ObjectClient is a base class for any object communicating
 * with a associated actor on the server.
 */
function ObjectClient() {}

ObjectClient.prototype = {
  request: function(type, message, callback) {
    message = message || {};
    message.to = this.actor;
    message.type = type;

    this.client.makeRequest(request, callback);
  }
}

module.exports = ObjectClient;
