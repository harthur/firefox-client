var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Node = require("./domnode");

module.exports = DOM;

function DOM(client, actor) {
  this.initialize(client, actor);
  this.walker = null;
}

DOM.prototype = extend(ClientMethods, {
  document: function(cb) {
    this.walkerRequest("document", function(err, resp) {
      var node = new Node(this.client, this.walker, resp.node);
      cb(err, node);
    }.bind(this))
  },

  documentElement: function(cb) {
    this.walkerRequest("documentElement", function(err, resp) {
      var node = new Node(this.client, this.walker, resp.node);
      cb(err, node);
    }.bind(this))
  },

  walkerRequest: function(type, message, cb) {
    this.getWalker(function(err, walker) {
      walker.request(type, message, cb);
    });
  },

  getWalker: function(cb) {
    if (this.walker) {
      return cb(null, this.walker);
    }
    this.request('getWalker', function(err, resp) {
      this.walker = new Walker(this.client, resp.walker);
      cb(err, this.walker);
    }.bind(this))
  }
})

function Walker(client, walker) {
  this.initialize(client, walker.actor);

  this.root = new Node(client, this, walker.root);
}

Walker.prototype = extend(ClientMethods, {});
