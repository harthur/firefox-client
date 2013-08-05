var extend = require("./extend"),
    ClientMethods = require("./client-methods");

module.exports = RDPTestHelper;

function RDPTestHelper(client, actor) {
  this.initialize(client, actor);
}

RDPTestHelper.prototype = extend(ClientMethods, {
  openTab: function(url, cb) {
    this.request('openTab', {url: url}, cb);
  },
  exitApp: function(cb) {
    this.request('exitApp', cb);
  }
});
