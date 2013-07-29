var net = require('net'),
    extend = require("./extend"),
    Client = require("./client"),
    FirefoxClient = require("./browser");

var clients = [];

function passiveConnect(client, socket) {
  client._conn = socket.host + ":" + socket.port;
  client._socket = socket;
  client.client = socket;
  socket.on("data", client.onData.bind(client));
  socket.on("error", client.onError.bind(client));
  socket.on("end", client.onEnd.bind(client));
  socket.on("timeout", client.onTimeout.bind(client));

  return client;
}


net.createServer(function (socket) {
  clients.push(socket);

  var tab_listed = false;
  var tab, Console;

  console.log("Connected from " + socket + "\n");

  socket.on('data', function (data) {
    if (!tab_listed) {
      var client = new Client();
      socket.client = passiveConnect(client, socket);
      socket.client.expectReply(this.actor, function(packet) {
        console.log("PACKET", packet);
      });

      tab_listed = true;
      var firefox_client = new FirefoxClient();
      firefox_client.initialize(socket.client, 'root');
      firefox_client.listTabs(function(err, tabs) {
        console.log("REPLY", tabs[0]);
        tab = tabs[0];

        tab.attach(function () {
          Console = tab.Console;
          Console.evaluateJS("alert('ok');", function () { console.log("DUMP", arguments); });
          Console.getCachedLogs(function (err, messages) {
            console.log("MESSAGES: ", messages);
          });
        });
      });
    }
    //console.log("DATA: "+data);
  });

  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
    console.log("CLOSE: "+socket.client.conn);
  });
}).listen(5001);

// Put a friendly message on the terminal of the server.
console.log("RDP server running at port 5001\n");
