var path = require("path"),
    connect = require('connect');

var port = 3000;

connect.createServer(connect.static(path.join(__dirname, "pages"))).listen(port);

console.log("server running at http://127.0.0.1:" + port);