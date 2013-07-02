var FirefoxClient = require("./lib/browser.js");

var client = new FirefoxClient();

client.connect(function() {
  client.listTabs(function(tabs) {
    var tab = tabs[0];
    testTab(tab);
  });
});

function testTab(tab) {
  //testReload(tab);
  //testNavigateTo(tab);
  //testDOM(tab);
  testLogs(tab);
}

function testReload(tab) {
  tab.reload();
}

function testNavigateTo(tab) {
  tab.navigateTo("http://www.google.com");
}

function testLogs(tab) {
  tab.Logs.getLogs(function(resp) {
    console.log("logs:", resp);
  });

  tab.Logs.on("page-error", function(error) {
    console.log("received error: " + error.errorMessage);
  });
  tab.Logs.on("console-api-call", function(call) {
    console.log("made console call: console." + call.level + "()");
  });
  tab.Logs.startLogging();
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
        //console.log(html);
      });

      node.siblings(function(siblings) {
        console.log(siblings.length);
      });

      node.nextSibling(function(sibling) {
        console.log(sibling.nodeName);
      });

      var className = node.getAttribute("class");
      console.log("class: ", className);

      node.setAttribute("class", "no-class", function() {
        console.log("attr set");
      })
    })
  })
}