var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Node = require("./domnode");

module.exports = DOM;

function DOM(client, actor) {
  this.initialize(client, actor);
  this.walker = null;
}

DOM.prototype = extend(ClientMethods, {
  document: function(callback) {
    this.walkerRequest("document", function(resp) {
      var node = new Node(this.client, this.walker, resp.node);
      callback(node);
    }.bind(this))
  },

  documentElement: function(callback) {
    this.walkerRequest("documentElement", function(resp) {
      var node = new Node(this.client, this.walker, resp.node);
      callback(node);
    }.bind(this))
  },

  walkerRequest: function(type, message, callback) {
    this.getWalker(function(walker) {
      walker.request(type, message, callback);
    });
  },

  getWalker: function(callback) {
    if (this.walker) {
      return callback(this.walker);
    }
    this.request('getWalker', function(resp) {
      this.walker = new Walker(this.client, resp.walker);
      callback(this.walker);
    }.bind(this))
  }
})

function Walker(client, walker) {
  this.initialize(client, walker.actor);

  this.root = new Node(client, this, walker.root);
}

Walker.prototype = extend(ClientMethods, {});
