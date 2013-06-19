var FirefoxClient = require("./lib/firefox-client.js");

var client = new FirefoxClient();

client.connect(function() {
  console.log("going to list tabs");
  client.listTabs(function(tabs) {
    var tab = tabs[0];

    tab.StyleSheets.addStyleSheet("* { color: red; } ", function(sheet) {
      console.log("added style sheet to document ", sheet.ruleCount);
    });
  });
});
