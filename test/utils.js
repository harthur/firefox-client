var assert = require('assert'),
    FirefoxClient = require("../index");

var tab;

exports.loadTab = function(url, callback) {
  var client = new FirefoxClient();

  client.connect(function() {
    client.listTabs(function(err, tabs) {
      client.RDPTestHelper.openTab("localhost:3000/"+url, function (err, res) {
        var tabIndex = res.tabIndex;
        client.listTabs(function (err, tabs) {
          var tab= tabs[tabIndex];
          callback(tab);
        });
      });
    });
  });
};
