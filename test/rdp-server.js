var net = require('net'),
    Client = require("../lib/client"),
    FirefoxClient = require("../lib/browser");

var sockets = [];
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


var server = net.createServer(function (socket) {
  sockets.push(socket);

  var tab_listed = false;
  var tab, Console;

  //console.log("Connected from ", socket);

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

      clients.push(firefox_client);
      server.emit("connected", firefox_client);
    };
  });

  socket.on('end', function () {
    clients.splice(sockets.indexOf(socket), 1);
    sockets.splice(sockets.indexOf(socket), 1);
    console.log("CLOSED");
  });
});

server.exitConnectedClient = function(client) {
  client.listTabs(function () {
    client.RDPTestHelper.exitApp();
  });
};

module.exports = server;
