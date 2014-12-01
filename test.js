var assert = require('assert'),
    FirefoxClient = require("./index");


var url = "http://harthur.github.io/bugzilla-todos";

getFirstTab(function(tab) {
  tab.DOM.querySelector("#title", function(err, node) {
    console.log("got node:", node.tagName);
    tab.DOM.getUsedFontFaces(node, { includePreviews: true }, function(err, fonts) {
      for (var i in fonts) {
        var font = fonts[i];
        console.log("first font", font);
      }
    });
  })
});

/*
loadUrl(url, function(tab) {
  tab.DOM.querySelector("#title", function(err, node) {
    console.log("got node:", node.tagName);
    tab.DOM.getUsedFontFaces(node, function(err, fonts) {
      for (var i in fonts) {
        var font = fonts[i];
        console.log("first font", font);
      }
    });
  })
}) */

/**
{ fromFontGroup: true,
    fromLanguagePrefs: false,
    fromSystemFallback: false,
    name: 'Georgia',
    CSSFamilyName: 'Georgia',
    rule: null,
    srcIndex: -1,
    URI: '',
    localName: '',
    format: '',
    metadata: '' }
*/


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