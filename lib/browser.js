var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Client = require("./client"),
    StyleSheets = require("./stylesheets"),
    DOM = require("./dom"),
    Logs = require("./logs"),
    Network = require("./network");

module.exports = FirefoxClient;

function FirefoxClient() {
  var client = new Client();
  var actor = 'root';

  this.initialize(client, actor);
}

FirefoxClient.prototype = extend(ClientMethods, {
  connect: function(callback, opts) {
    this.client.connect(callback, opts);

    this.client.expectReply(this.actor, function(packet) {
      console.log("root message:", JSON.stringify(packet));
    });
  },

  listTabs: function(callback) {
    this.request("listTabs", function(resp) {
      var tabs = resp.tabs.map(function(tab) {
        return new Tab(this.client, tab);
      }.bind(this));

      callback(tabs);
    }.bind(this));
  }
})

function Tab(client, tab) {
  this.initialize(client, tab.actor);
  this.tab = tab;
}

Tab.prototype = extend(ClientMethods, {
  get title() {
    return this.tab.title;
  },

  get url() {
    return this.tab.url
  },

  get StyleSheets() {
    if (!this._StyleSheets) {
      this._StyleSheets = new StyleSheets(this.client, this.tab.styleEditorActor);
    }
    return this._StyleSheets;
  },

  get DOM() {
    if (!this._DOM) {
      this._DOM = new DOM(this.client, this.tab.inspectorActor);
    }
    return this._DOM;
  },

  get Logs() {
    if (!this._Logs) {
      this._Logs = new Logs(this.client, this.tab.consoleActor);
    }
    return this._Logs;
  },

  get Network() {
    if (!this._Network) {
      this._Network = new Network(this.client, this.tab.consoleActor);
    }
    return this._Network;
  },

  reload: function(callback) {
    this.request("reload", callback);
  },

  navigateTo: function(url, callback) {
    this.request("navigateTo", { url: url }, callback);
  }
})
