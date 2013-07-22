var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Client = require("./client"),
    Tab = require("./tab");

const DEFAULT_PORT = 6000;
const DEFAULT_HOST = "localhost";

module.exports = FirefoxClient;

function FirefoxClient() {
  var client = new Client();
  var actor = 'root';

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
  }
})