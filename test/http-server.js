var path = require("path"),
    connect = require('connect');

module.exports = connect.createServer(connect.static(path.join(__dirname, "pages")));
