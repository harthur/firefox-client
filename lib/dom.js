var extend = require("./extend");
var ClientMethods = require("./client-methods");

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
      callback(this.walker);
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

function Node(client, walker, node) {
  this.initialize(client, node.actor);
  this.walker = walker;

  walker.on('newMutations', function(event) {
    console.log("on new mutations! ", JSON.stringify(event));
  });

  ['nodeType', 'nodeName', 'namespaceURI', 'attrs']
  .forEach(function(attr) {
    this[attr] = node[attr];
  }.bind(this));
}

Node.prototype = extend(ClientMethods, {
  parentNode: function(callback) {
    this.parents(function(nodes) {
      callback(nodes[0]);
    })
  },

  parents: function(callback) {
    this.requestArray('parents', callback);
  },

  children: function(callback) {
    this.requestArray('children', callback);
  },

  siblings: function(callback) {
    this.requestArray('siblings', callback);
  },

  nextSibling: function(callback) {
    this.requestNode('nextSibling', callback);
  },

  previousSibling: function(callback) {
    this.requestNode('previousSibling', callback);
  },

  querySelector: function(selector, callback) {
    this.requestNode('querySelector', { selector: selector }, callback);
  },

  querySelectorAll: function(selector, callback) {
    this.requestList('querySelectorAll', { selector: selector }, callback);
  },

  innerHTML: function(callback) {
    this.nodeRequest('innerHTML', function(resp) {
      callback(resp.value);
    })
  },

  outerHTML: function(callback) {
    this.nodeRequest('outerHTML', function(resp) {
      callback(resp.value);
    })
  },

  getAttribute: function(name) {
    for (var i in this.attrs) {
      var attr = this.attrs[i];
      if (attr.name == name) {
        return attr.value;
      }
    }
  },

  setAttribute: function(name, value, callback) {
    var mods = [{
      attributeName: name,
      newValue: value
    }];
    this.request('modifyAttributes', { modifications: mods }, callback);
  },

  requestNode: function(type, message, callback) {
    if (!callback) {
      callback = message;
      message = {};
    }
    this.nodeRequest(type, message, function(resp) {
      var node = null;
      if (resp.node) {
        node = new Node(this.client, this.walker, resp.node);
      }
      callback(node);
    }.bind(this));
  },

  requestList: function(type, message, callback) {
    if (!callback) {
      // oh em gee
      callback = message;
      message = {};
    }
    this.nodeRequest(type, message, function(resp) {
      var list = new NodeList(this.client, this.walker, resp.list);

      list.items(callback);
    }.bind(this));
  },

  requestArray: function(type, message, callback) {
    if (!callback) {
      callback = message;
      message = {};
    }

    this.nodeRequest(type, message, function(resp) {
      var nodes = resp.nodes.map(function(form) {
        return new Node(this.client, this.walker, form);
      }.bind(this));

      callback(nodes);
    }.bind(this));
  },

  nodeRequest: function(type, message, callback) {
    if (!callback) {
      callback = message;
      message = {};
    }
    message.node = this.actor;

    this.walker.request(type, message, callback);
  }
});

function NodeList(client, walker, list) {
  this.client = client;
  this.walker = walker;
  this.actor = list.actor;
}

NodeList.prototype = extend(ClientMethods, {
  items: function(callback) {
    this.request('items', function(resp) {
      var nodes = resp.nodes.nodes.map(function(form) {
        return new Node(this.client, this.walker, form);
      }.bind(this));

      callback(nodes);
    });
  }
});
