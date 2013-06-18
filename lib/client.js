var fs = require("fs"),
    path = require("path"),
    net = require("net"),
    events = require("events"),
    util = require("util");

module.exports = Client;

function Client() {
  util.inherits(this, events.EventEmitter);
}

Client.prototype = {
  connect: function(cb, opts) {
    opts = opts || {}
    var port = opts.port || 6000;
    var host = opts.host || 'localhost';

    this.client = net.createConnection({
      port: port,
      host: host
    });

    this.client.on("connect", cb);
    this.client.on("data", this.onData.bind(this));
    this.client.on("error", this.onError.bind(this));
    this.client.on("end", this.onEnd.bind(this));
    this.client.on("timeout", this.onTimeout.bind(this));

    this._pendingRequests = [];
    this._activeRequests = {};
  },

  /**
   * Set a request to be sent to an actor on the server. If the actor
   * is already handling a request, queue this request until the actor
   * has responded to the previous request.
   */
  makeRequest: function(request, callback) {
    if (!request.to) {
      var type = request.type || "";
      this.emit("error", type + " request packet has no destination.");
    }
    this._pendingRequests.push({ to: request.to,
                                 message: request,
                                 callback: callback });
    this._flushRequests();
  },

  /**
   * Activate (send) any pending requests to actors that don't have an
   * active request.
   */
  _flushRequests: function() {
    this._pendingRequests = this._pendingRequests.filter(function(request) {
      // only one active request per actor at a time
      if (this._activeRequests[request.to]) {
        return true;
      }

      // no active requests for this actor, so activate this one
      this.sendMessage(request.message);
      this.expectReply(request.to, request.callback);

      // remove from pending requests
      return false;
    }.bind(this));
  },

  /**
   * Send a JSON message over the connection to the server.
   */
  sendMessage: function(message) {
    if (!message.to) {
      this.emit("error", "No actor specified in request");
    }
    var str = JSON.stringify(message);
    str = str.length + ":" + str;

    this.client.write(str);
  },

  /**
   * Arrange to hand the next reply from |actor| to |handler|.
   */
  expectReply: function(actor, handler) {
    if (this._activeRequests[actor]) {
      throw Error("clashing handlers for next reply from " + uneval(actor));
    }
    this._activeRequests[actor] = handler;
  },

  /**
   * Handler for a new message coming in. It's either an unsolicited event
   * from the server, or a response to a previous request from the client.
   */
  handleMessage: function(message) {
    if (message.type) {
      // this is an unsolicited event from the server
      console.log("unsolicited event " + message.type);
      return;
    }

    if (this._activeRequests[message.from]) {
      var callback = this._activeRequests[message.from];
      delete this._activeRequests[message.from];

      callback(message);

      this._flushRequests();
    }
    else {
      this.emit("error", "Unexpected response from actor " + message.from);
    }
  },

  /**
   * Called when a new data chunk is received on the connection.
   * Parse data into a message and call message handler.
   */
  onData: function(data) {
    var message = data.toString();

    // TODO: Each response from the server is prepended by len(message) + ':',
    // assume the message is all contained in this one chunk - FOR NOW
    message = message.slice(message.indexOf(":") + 1);

    var packet;
    try {
      packet = JSON.parse(message);
    } catch(e) {
      this.emit("error", "Couldn't parse packet from server as JSON " + e);
      return;
    }
    if (!packet.from) {
      this.emit("error", "Server didn't specify an actor");
    }

    this.handleMessage(packet);
  },

  onError: function(error) {
    console.log("connection error: " + JSON.stringify(error));
  },

  onEnd: function() {
    console.log("connection closed by server");
  },

  onTimeout: function() {
    console.log("connection timeout");
  }
}
