var FirefoxClient = require("./lib/firefox-client.js");

var client = new FirefoxClient();

client.connect(function() {
  console.log("going to list tabs");
  client.listTabs(function(tabs) {
    var tab = tabs[0];
    testTab(tab);
  });
});

function testTab(tab) {
  testReload(tab);
}

function testReload(tab) {
  tab.reload();
}

function testStyleSheets(tab) {
  tab.StyleSheets.addStyleSheet("* { color: red; } ", function(sheet) {
    console.log("added style sheet to document ", sheet.ruleCount);
  });
}
