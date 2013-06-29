# firefox-client
`firefox-client` is a [node](nodejs.org) library and command line utility for controlling a Firefox instance over the remote debugging protocol.

## Install
With [node.js](http://nodejs.org/) npm package manager:

	npm install firefox-client

To connect to a Firefox instance, you first have to turn on remote debugging. Visit `about:config` in the url bar, and toggle the `devtools.debugger.remote-enabled` preference to `true`. You'll only have to do this once.

Then start listening for connection on a port using the Firefox command line (**Tools** > **Web Developer** > **Developer Toolbar**). Start the server by entering this command:

```
listen 6000
```

## Compatibility

This library is compatible with Firefox [Nightly](http://nightly.mozilla.org/).

## API

Use the firefox-client API from your node program with:

```javascript
var FirefoxClient = require("firefox-client");

var client = new FirefoxClient(options);

client.connect({ port: 6000 }, function() {
  client.listTabs(function(tabs) {
    console.log("first tab:", tabs[0].url);
  });
});
```


Most of the client API methods relate to the Firefox (web) developer tools.

### FirefoxClient

#### connect

Create a remote debugging connection. Takes a hash of options (`host` and `port`), and
a callback as arguments:

```javascript
client.connect(function() {
  console.log("connection established")
});
```

#### listTabs

Get a list of all the currently open tabs (as `Tab` objects):

client.listTabs(function(tabs) {
   console.log("first tab:", tabs[0].url);
})

### Tab

After getting a tab object from `listTabs`. You can access a bunch of per-tab APIs

### StyleSheets

#### listStyleSheets

List all the stylesheets in the current document of the tab.

```javascript
tab.StyleSheets.listStyleSheets(function(sheets) {
  console.log("first stylesheet:", sheets[0].href);
})
```

#### addStyleSheet

Create a new stylesheet with the given text and append it the document as an inline stylesheet:

```javascript
tab.StyleSheets.addStyleSheet("* { color: red };");
```

