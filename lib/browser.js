var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Client = require("./client"),
    Tab = require("./tab"),
    SimulatorApps = require("./simulator");

const DEFAULT_PORT = 6000;
const DEFAULT_HOST = "localhost";

module.exports = FirefoxClient;

function FirefoxClient() {
  var client = new Client();
  var actor = 'root';

  client.on("end", this.onEnd.bind(this));
  client.on("timeout", this.onTimeout.bind(this));

  this.initialize(client, actor);
}

FirefoxClient.prototype = extend(ClientMethods, {
  connect: function(port, host, cb) {
    if (typeof port == "function") {
      // (cb)
      cb = port;
      port = DEFAULT_PORT;
      host = DEFAULT_HOST;

    }
    if (typeof host == "function") {
      // (port, cb)
      cb = host;
      host = DEFAULT_HOST;
    }
    // (port, host, cb)

    this.client.connect(port, host, cb);

    this.client.expectReply(this.actor, function(packet) {
      // root message
    });
  },

  onEnd: function() {
    this.emit("end");
  },

  onTimeout: function() {
    this.emit("timeout");
  },

  selectedTab: function(cb) {
    this.request("listTabs", function(resp) {
      var tab = resp.tabs[resp.selected];
      return new Tab(this.client, tab);
    }.bind(this), cb);
  },

  listTabs: function(cb) {
    this.request("listTabs", function(resp) {
      return resp.tabs.map(function(tab) {
        return new Tab(this.client, tab);
      }.bind(this));
    }.bind(this), cb);
  },

  listApps: function(cb) {
    this.getSimulatorApps(function(err, apps) {
      if (err || !apps) {
        cb(new Error("Can't list apps, no simulator attached"));
        return;
      }
      apps.listApps(cb);
    })
  },

  getSimulatorApps: function(cb) {
    if (this._SimulatorApps) {
      cb(null, this._SimulatorApps);
      return;
    }
    this.request("listTabs", function(err, resp) {
      if (err) {
        return cb(err);
      }

      var actor = resp.simulatorWebappsActor;
      this._SimulatorApps = new SimulatorApps(this.client, actor);

      cb(null, this._SimulatorApps);
    }.bind(this));
  }
})