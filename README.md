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

The first argument to the `listen` command is the port number.

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
Methods: ownPropertyNames(), propertyDescriptor(), prototype()

#### DOM
Methods: document(), documentElement()

#### DOMNode
Methods: parentNode(), parent(), siblings(), nextSibling(), previousSibling(), querySelector(), querySelectorAll(), innerHTML(), outerHTML(), getAttribute(), setAttribute()

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

