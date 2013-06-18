var FirefoxClient = require("./lib/firefox-client.js");

var client = new FirefoxClient();

client.connect(function() {
  client.getTabs(function(tabs) {
    for (tab in tabs) {
      console.log(tabs[tab].url);
    }
  });
});
