var extend = require("./extend");
var ClientMethods = require("./client-methods");

module.exports = LongString;

function LongString(client, longstr) {
  this.initialize(client, longstr.actor);

  if (!longstr.actor) {
    // If the string is too short, server doesn't give a seperate actor
    this.wholeString = longstr;
    this.length = this.wholeString.length;
  }
  else {
    this.length = longstr.length;
    this.intial = longstr.intial;
  }
}

LongString.prototype = extend(ClientMethods, {
  substring: function(start, end, cb) {
    if (typeof start == "function") {
      // args: cb
      cb = start;
      start = 0;
      end = this.length;
    }
    else if (typeof end == "function") {
      // args: start, cb
      cb = end;
      end = this.length;
    }

    if (this.wholeString) {
      cb(null, this.wholeString.substring(start, end));
      return;
    }

    this.request('substring', { start: start, end: end },
                 this.pluck('substring'), cb);
  },

  release: function(cb) {
    this.request('release', cb);
  }
});