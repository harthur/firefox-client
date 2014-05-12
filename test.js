var assert = require('assert'),
    FirefoxClient = require("./index");


var url = "http://harthur.github.io/bugzilla-todos";

loadUrl(url, function(tab) {
  tab.StyleSheets.getStyleSheets(function(err, sheets) {
    sheets[1].getMediaRules(function(err, rules) {
      console.log("media rules: ", rules.length);
      console.log("first one: ", rules[0]);
    });
  });
})

/**
 * Helper functions
 */
function loadUrl(url, callback) {
  getFirstTab(function(tab) {
    console.log("GOT TAB");
    tab.navigateTo(url);

    tab.once("navigate", function() {
      console.log("NAVIGATED");
      callback(tab);
    });
  });
}

function getFirstTab(callback) {
  var client = new FirefoxClient({log: true});

  client.connect(function() {
    client.listTabs(function(err, tabs) {
      if (err) throw err;

      var tab = tabs[0];

      // attach so we can receive load events
      tab.attach(function(err) {
        if (err) throw err;
        callback(tab);
      })
    });
  });
}