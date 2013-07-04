var assert = require('assert'),
    FirefoxClient = require("../index");

exports.loadTab = function(url, callback) {
  var client = new FirefoxClient();

  client.connect(function() {
    client.listTabs(function(tabs) {
      // take over the first tab
      var tab = tabs[0];

      tab.attach(function() {
        tab.navigateTo(url);
      });

      tab.once("navigate", function() {
        callback(tab);
      });
    });
  });
};