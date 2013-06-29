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
  //testReload(tab);
  //testNavigateTo(tab);
  testDOM(tab);
}

function testReload(tab) {
  tab.reload();
}

function testNavigateTo(tab) {
  tab.navigateTo("http://www.google.com");
}

function testStyleSheets(tab) {
  tab.StyleSheets.addStyleSheet("* { color: red; } ", function(sheet) {
    console.log("added style sheet to document ", sheet.ruleCount);
  });
}

function testDOM(tab) {
  tab.DOM.document(function(doc) {
    doc.querySelector(".event", function(node) {
      node.outerHTML(function(html) {
        console.log(html);
      });

      node.siblings(function(siblings) {
        console.log(siblings.length);
      });

      node.previousSibling(function(sibling) {
        console.log(sibling.nodeName);
      });
    })
  })
}