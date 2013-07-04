var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Client = require("./client"),
    Tab = require("./tab");

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