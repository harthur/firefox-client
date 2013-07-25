var FirefoxClient = require("./lib/browser.js");

var client = new FirefoxClient();

client.connect(function() {
  client.listTabs(function(err, tabs) {
    var tab = tabs[0];
    testTab(tab);
  });
});

function testCachedLogs(tab) {
  tab.Console.startLogging(function() {
    console.log("started logging");
    tab.Console.getCachedLogs(function(err, resp) {
      console.log("cached", resp);
    });
    tab.Console.getCachedLogs(function(err, resp) {
      console.log("cached", resp);
    });

  })
}

function testTab(tab) {
  //testCachedLogs(tab);
  //testAttach(tab);
  testReload(tab);
  //testNavigateTo(tab);
  //testDOM(tab);
  //testLogs(tab);
  //testNetwork(tab);
  //testConsole(tab);
}

function testAttach(tab) {
  tab.attach(function(resp) {
    console.log("attach resp:", resp);
  });
}

function testReload(tab) {
  tab.DOM.document(function(err, doc) {
    console.log("hola", doc.actor);
  });
  tab.attach(function(err, resp) {
    if (err) throw err;

    tab.on("navigate", function() {
      tab.DOM.document(function(err, doc) {
        if (err) throw err.message;
        console.log("hola again", doc.actor);
      });
    })
    tab.reload();
  });
}

function testNavigateTo(tab) {
  tab.navigateTo("http://www.google.com");
}

function testConsole(tab) {
  tab.Console.evaluateJS("window", function(resp) {
    var result = resp.result;

  //  result.ownPropertyNames(function(names) {
  //    console.log("num properties: ", names.length);
  //  });

    result.prototype(function(resp) {
      console.log(resp);
    })

    result.propertyValue('document', function(value) {
      console.log("document value:", value.class);
    })
  });
}

function testNetwork(tab) {
  tab.Network.on("network-event", function(event) {
    console.log("network event: ", event.url);
  });

  tab.Network.startLogging();

  var request = {
    url: "https://github.com/harthur/some-json/raw/gh-pages/1.json",
    method: "GET",
    headers: [{name: "test-header", value: "test-value"}]
  };

  tab.Network.sendHTTPRequest(request, function(networkEvent) {
    networkEvent.getResponseHeaders(function(message) {
        console.log("got event headers:" +  JSON.stringify(message));
    })

    networkEvent.on("update", function(type, data) {
      console.log("on update " + type);
      if (type == "responseContent") {
        networkEvent.getResponseContent(function(message) {
          console.log("got event headers:" +  JSON.stringify(message));
        })
      }
    })
  });
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