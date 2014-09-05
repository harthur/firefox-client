var extend = require("./extend"),
    ClientMethods = require("./client-methods"),
    Tab = require("./tab"),
    fs = require("fs"),
    spawn = require("child_process").spawn;

module.exports = Device;

var CHUNK_SIZE = 20480;

// Also dispatch appOpen/appClose, appInstall/appUninstall events
function Device(client, tab) {
  this.initialize(client, tab.deviceActor);
}

Device.prototype = extend(ClientMethods, {
  getDescription: function(cb) {
    this.request("getDescription", function(err, resp) {
      if (err) {
        return cb(err);
      }

      cb(null, resp.value);
    });
  }
})
