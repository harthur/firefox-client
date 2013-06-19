var fs = require("fs"),
    path = require("path"),
    net = require("net"),
    events = require("events"),
    util = require("util");

module.exports = Client;

function Client() {
  this._remainingLength = 0;
  this._messagePart = "";
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
      throw new Error(type + " request packet has no destination.");
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
      throw new Error("No actor specified in request");
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
      throw new Error("Unexpected response from actor " + message.from);
    }
  },

  /**
   * Called when a new data chunk is received on the connection.
   * Parse data into message(s) and call message handler for any full
   * messages that are read in.
   */
  onData: function(data) {
    var string = data.toString();

    console.log("\ntotal length:", string.length);
    console.log("\ndata:<>" + string + "<>");

    while (string.length) {
      var len = this._remainingLength;
      console.log("len from last time:", len);
      if (!len) {
        // beginning of a message is preceded by len(message) + ":"
        var index = string.indexOf(":");
        len = parseInt(string.slice(0, index));

        string = string.slice(index + 1);
      }

      var message = string.slice(0, len);

      string = string.slice(len + 1);
      this._remainingLength = len - message.length;
      console.log("remaining:", this._remainingLength, "from", len, "-", message.length);

      if (this._remainingLength) {
        console.log("message need more chunks", this._remainingLength);
        console.log("string:<>" + string + "<>");
        // message isn't all contained in this chunk
        this._messagePart += message;
        return;
      }

      // we read in the end of a message
      this._messagePart = "";

      var packet;
      try {
        packet = JSON.parse(message);
      } catch(e) {
        throw new Error("Couldn't parse packet from server as JSON " + e
          + "message: <>" + message + "<>");
        return;
      }
      if (!packet.from) {
        throw new Error("error", "Server didn't specify an actor");
      }

      this.handleMessage(packet);
    }
  },

  onError: function(error) {
    console.error("connection error: " + JSON.stringify(error));
  },

  onEnd: function() {
    console.log("connection closed by server");
  },

  onTimeout: function() {
    console.log("connection timeout");
  }
}
