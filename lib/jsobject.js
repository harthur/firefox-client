var select = require("js-select"),
    extend = require("./extend"),
    ClientMethods = require("./client-methods");

module.exports = JSObject;

function JSObject(client, obj) {
  this.initialize(client, obj.actor);
  this.obj = obj;
}

JSObject.prototype = extend(ClientMethods, {
  type: "object",

  get class() {
    return this.obj.class;
  },

  get name() {
    return this.obj.name;
  },

  get displayName() {
    return this.obj.displayName;
  },

  ownPropertyNames: function(callback) {
    this.request('ownPropertyNames', function(resp) {
      return resp.ownPropertyNames;
    }, callback);
  },

  ownPropertyDescriptor: function(name, callback) {
    this.request('property', { name: name }, function(resp) {
      console.log("RESP to ownPropertyDescriptor", resp);
      return this.transformDescriptor(resp.descriptor);
    }.bind(this), callback);
  },

  ownProperties: function(callback) {
    this.request('prototypeAndProperties', function(resp) {
      return select(resp.ownProperties, ":root > *")
             .update(this.transformDescriptor.bind(this));
    }.bind(this), callback);
  },

  prototype: function(callback) {
    this.request('prototype', function(resp) {
      return this.createJSObject(resp.prototype);
    }.bind(this), callback);
  },

  /* methods for Functions */
  paramaterNames: function(callback) {
    this.request('paramaterNames', callback)
  },

  decompile: function(callback) {
    this.request('decompile', callback)
  },

  /* helpers */

  /**
   * Turn the 'value' of a descriptor into a JSObject, if necessary
   */
  transformDescriptor: function(descriptor) {
    return select(descriptor, '.value').update(function(value) {
      return this.createJSObject(value);
    }.bind(this));
  }
})