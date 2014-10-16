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
      if (err) return cb(err);

      var node = new Node(this.client, this.walker, resp.node);
      cb(null, node);
    }.bind(this))
  },

  documentElement: function(cb) {
    this.walkerRequest("documentElement", function(err, resp) {
      var node = new Node(this.client, this.walker, resp.node);
      cb(err, node);
    }.bind(this))
  },

  querySelector: function(selector, cb) {
    this.document(function(err, node) {
      if (err) return cb(err);

      node.querySelector(selector, cb);
    })
  },

  querySelectorAll: function(selector, cb) {
    this.document(function(err, node) {
      if (err) return cb(err);

      node.querySelectorAll(selector, cb);
    })
  },

  getComputedStyle: function(node, cb) {
    this.styleRequest("getComputed", { node: node.actor },
                      this.pluck('computed'), cb);
  },

  getUsedFontFaces: function(node, options, cb) {
    var message = {
      node: node.actor,
      includePreviews: options.includePreviews,
      previewText: options.previewText,
      previewFontSize: options.previewFontSize
    };

    this.styleRequest("getUsedFontFaces", message,
                      this.pluck('fontFaces'), cb);
  },

  getFontPreview: function(node, font, cb) {
    this.styleRequest("getFontPreview", { node: node.actor, font: font }, cb);
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
  },

  styleRequest: function(type, message, transform, cb) {
    this.getStyle(function(err, style) {
      if (err) throw err;

      style.request(type, message, transform, cb);
    })
  },

  getStyle: function(cb) {
    if (this.style) {
      return cb(null, this.style);
    }
    this.request('getPageStyle', function(err, resp) {
      this.style = new Style(this.client, resp.pageStyle);
      cb(err, this.style);
    }.bind(this))
  }
})

function Walker(client, walker) {
  this.initialize(client, walker.actor);

  this.root = new Node(client, this, walker.root);
}

Walker.prototype = extend(ClientMethods, {});

function Style(client, style) {
  this.initialize(client, style.actor);
}

Style.prototype = extend(ClientMethods, {});
