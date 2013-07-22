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
    var tab = tabs[0];

    tab.Console.evaluateJS("6 + 7", function(resp) {
      console.log("result:", resp.result);
    });
  });
});
```

## Compatibility

This library is compatible with [Firefox Nightly](http://nightly.mozilla.org/).

### API

A `FirefoxClient` is the entry point to the API. After connecting, get a `Tab` object with `listTabs()` or `selectedTab()`. Once you have a `Tab`, you can call methods and listen to events from the tab's modules, `Console` or `Network`. There are also experimental tab modules `DOM` and `StyleSheets`, see their implementations in the `lib` directory.

Summary of the offerings of the modules and objects:

#### FirefoxClient
Methods: connect(), listTabs(), selectedTab()

#### Tab
Methods: reload(), navigateTo(), attach(), detach()

Events: "navigate", "before-navigate"

#### Tab.Console
Methods: evaluateJS(), startListening(), stopListening(), getCachedLogs()

Events: "page-error", console-api-call"

#### JSObject
Properties: class, name, displayName

Methods: ownPropertyNames(), ownPropertyDescriptor(), ownProperties(), prototype()

#### Tab.Network
Methods: startLogging(), stopLogging(), sendHTTPRequest()

Events: "network-event"

#### NetworkEvent
Properties: url, method, isXHR

Methods: getRequestHeaders(), getRequestCookies(), getRequestPostData(), getResponseHeaders(), getResponseCookies(), getResponseContent(), getEventTimings()

Events: "update"

