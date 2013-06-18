var util = require("util");
var Client = require("./client");
var ObjectClient = require("./object-client");

module.exports = FirefoxClient;

function FirefoxClient() {
  this.client = new Client();
  this.actor = 'root';
}
util.inherits(FirefoxClient, ObjectClient);

FirefoxClient.prototype = {
  connect: function(callback, opts) {
    this.client.expectReply(this.actor, function(packet) {
      console.log("got the root message", JSON.stringify(packet));
    });

    this.client.connect(callback, opts);
  },

  getTabs: function(callback) {
    this.request("listTabs", {}, function(tabs) {
      var clients = tabs.map(function(tab) {
        return new TabClient(this.client, tab);
      }.bind(this));

      callback(clients);
    });
  },
}

function TabClient(client, tab) {
  this.client = client;
  this.actor = tab.actor;
  this.tab = tab;
}
util.inherits(TabClient, ObjectClient);

TabClient.prototype = {
  get title() {this.tab.title},

  get url() {this.tab.url}
}