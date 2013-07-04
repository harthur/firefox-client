var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    StyleSheets = require("./stylesheets"),
    DOM = require("./dom"),
    Logs = require("./logs"),
    Network = require("./network"),
    Console = require("./console");

module.exports = Tab;

function Tab(client, tab) {
  this.initialize(client, tab.actor);

  this.tab = tab;
  this.updateInfo(tab);

  this.on("tabNavigated", this.onTabNavigated.bind(this));
}

Tab.prototype = extend(ClientMethods, {
  updateInfo: function(form) {
    this.url = form.url;
    this.title = form.title;
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

  get Console() {
    if (!this._Console) {
      this._Console = new Console(this.client, this.tab.consoleActor);
    }
    return this._Console;
  },

  onTabNavigated: function(event) {
    if (event.state == "start") {
      this.emit("before-navigate", { url: event.url });
    }
    else if (event.state == "stop") {
      this.updateInfo(event);

      this.emit("navigate", { url: event.url, title: event.title });
    }
  },

  attach: function(callback) {
    this.request("attach", callback);
  },

  detach: function(callback) {
    this.request("detach", callback);
  },

  reload: function(callback) {
    this.request("reload", callback);
  },

  navigateTo: function(url, callback) {
    this.request("navigateTo", { url: url }, callback);
  }
})
