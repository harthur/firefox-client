# firefox-client
`firefox-client` is a [node](nodejs.org) library for remote debugging Firefox.

## Install
With [node.js](http://nodejs.org/) npm package manager:

	npm install firefox-client

## Connecting
1. Enable remote debugging (You'll only have to do this once)
 1. Open the DevTools. **Web Developer** > **Toggle Tools**
 2. Visit the settings panel (gear icon)
 3. Check "Enable remote debugging" under Advanced Settings

2. Listen for a connection
 1. Open the Firefox command line with **Tools** > **Web Developer** > **Developer Toolbar**. 
 2. Start a server by entering this command: `listen 6000` (where `6000` is the port number)

## Usage

Use firefox-client from your node program with:

```javascript
var FirefoxClient = require("firefox-client");

var client = new FirefoxClient();

client.connect(6000, function() {
  client.listTabs(function(err, tabs) {
    console.log("first tab:", tabs[0].url);
  });
});
```

## Compatibility

This library is compatible with [Firefox Nightly](http://nightly.mozilla.org/).

### API

### Objects

#### FirefoxClient
Methods: connect(), listTabs()

#### Tab
Methods: reload(), navigateTo(), attach(), detach()
Events: "navigate", "before-navigate"

#### Console
Methods: evaluateJS(), startListening(), stopListening(), getCachedLogs()
Events: "page-error", console-api-call"

#### JSObject
Properties: class, name, displayName
Methods: ownPropertyNames(), ownPropertyDescriptor(), ownProperties(), prototype()

#### Network
Methods: startLogging(), stopLogging(), sendHTTPRequest()
Events: "network-event"

#### NetworkEvent
Properties: url, method, isXHR
Methods: getRequestHeaders(), getRequestCookies(), getRequestPostData(), getResponseHeaders(), getResponseCookies(), getResponseContent(), getEventTimings()
Events: "update"

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
   var tab = tabs[0]
   console.log("first tab:", tab.url);
})

### Tab

After getting a tab object from `listTabs`. You can access a bunch of per-tab APIs

#### reload

Reload the tab:

```javascript```
tab.reload();
```

#### navigateTo

Navigate tab to a new page:

```javascript```
tab.navigateTo("http://github.com");
```

### Console


#### evaluateJS

```javascript```
tab.Console.evaluateJS("window", function(resp) {
  var windowObj = resp.result;
})
```

#### startLogging


### DOM

### Network

