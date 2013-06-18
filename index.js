var fs = require("fs"),
    path = require("path"),
    net = require("net"),
    events = require("events"),
    util = require("util");

module.exports = function(options) {
   return new Client(options);
}

/*
function ObjectClient(client, actorId) {
  this._client = client;
  this._actorId = actorId;
}

ObjectClient.prototype = {
  sendMessage: function() {
  }
} */

function Client() {
  util.inherits(this, events.EventEmitter);
}

Client.prototype = {
  connect: function(host, port, cb) {
    port = port || 6000;
    host = host || 'localhost';

    this.client = net.createConnection({
      port: port,
      host: host
    });

    this.client.on("connect", this.onConnect);
    this.client.on("data", this.onData);
    this.client.on("error", this.onError);
    this.client.on("end", this.onEnd);
    this.client.on("timeout", this.onTimeout);

    this._pendingRequests = [];
    this._activeRequests = new Map;

    /*
     * As the first thing on the connection, expect a greeting packet from
     * the connection's root actor.
     */
    this.mainRoot = null;
    this.expectReply("root", function(packet) {
       // this.mainRoot = new RootClient(this, packet);
       console.log("got the root message");
    });
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
  }

  /**
   * Activate (send) any pending requests to actors that don't have a currently
   * active request.
   */
  _flushRequests: function() {
    this._pendingRequests = this._pendingRequests.filter(function(request) {
      // only one active request per actor at a time
      if (this._activeRequests.has(request.to)) {
        return true;
      }

      // no active requests for this actor, so activate this one
      this.sendMessage(request.message);
      this.expectReply(request.to, request.callback);

      // remove from pending requests
      return false;
    });
  },

  /**
   * Send a JSON message over the connection to the server.
   */
  sendMessage: function(message) {
    if (!message.to) {
      this.emit("error", "No actor specified in request");
    }
    this.client.write(JSON.stringify(message), cb);
  },

  /**
   * Arrange to hand the next reply from |actor| to |handler|.
   */
  expectReply: function(actor, handler) {
    if (this._activeRequests.has(actor)) {
      throw Error("clashing handlers for next reply from " + uneval(actor));
    }
    this._activeRequests.set(actor, handler);
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

    if (this._activeRequests.has(message.from)) {
      var callback = this._activeRequests.get(message.from);
      this._activeRequests.delete(message.from);

      callback(message);

      this._flushRequests();
    }
    else {
      this.emit("error", "Unexpected response from actor " + message.from);
    }
  },

  onConnect: function() {
    console.log("connection established");
  },

  onData: function(data) {
    console.log("data received", data.toString());

    var packet;
    try {
      packet = JSON.parse(data);
    } catch(e) {
      this.emit("error", "Couldn't parse packet from server as JSON");
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
