# firefox-debug
`firefox-debug` is a [node](nodejs.org) library and command line utility for controlling a Firefox instance over the remote debugging protocol.

## Install
With [node.js](http://nodejs.org/) npm package manager:

	npm install firefox-debug -g

You can now use `fxdebug` command from the command line.

To connect to a Firefox instance, you first have to turn on remote debugging. Visit `about:config` in the url bar, and toggle the `devtools.debugger.remote-enabled` preference to `true`. You'll only have to do this once.

Then start listening for connection on a port using the Firefox command line (**Tools** > **Web Developer** > **Developer Toolbar**). Start the server by entering this command:

```
listen 6000
```

## API

Use the firefox-debug API from your node program with:

```javascript
var createClient = require("firefox-debug");

var options = {
  host: "localhost",
  port: 6000
}

var client = createClient(options, function() {

});

```

Most of the client API methods relate to the Firefox (web) developer tools.



## More Details


