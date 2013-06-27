var extend = require("./extend");
var ClientMethods = require("./client-methods");

module.exports = DOM;

function DOM(client, actor) {
  this.client = client;
  this.actor = actor;
}

DOM.prototype = extend(ClientMethods, {
  walkerActor: function(callback) {
    if (this.walkerActor) {
      callback(this.walkerActor);
    }
    this.request('getWalker', {}, function(walker) {
      this.walkerActor = walker.actor;
      callback(this.walkerActor);
    }.bind(this))
  },

  getRoot: function(callback) {
    this.walkerActor(function(actor) {
      callback(new Node(this.client, actor.root));
    }.bind(this));
  }
})

function Node(client, actor) {
  this.client = client;
  this.actor = actor;
}

Node.prototype = extend(ClientMethods, {
  querySelector: function(selector, callback) {
    this.request('querySelector', { selector: selector }, function(actor) {
      return new Node(this.client, actor)
    }.bind(this));
  }
})
