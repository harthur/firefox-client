var extend = require("./extend"),
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
    this.request('ownPropertyNames', callback, 'ownPropertyNames');
  },

  ownPropertyDescriptor: function(name, callback) {
    this.request('property', { name: name }, function(descriptor) {
      this.transformDescriptor(descriptor);
      callback(descriptor);
    }.bind(this), callback);
  },

  propertyValue: function(name, callback) {
    this.ownPropertyDescriptor(name, function(descriptor) {
      callback(descriptor.value);
    })
  },

  properties: function(callback) {
    this.request('prototypeAndProperties', function(resp) {
      var props = resp.ownProperties;
      props.forEach(function(descriptor) {
        this.transformDescriptor(descriptor);
      });
      callback(resp);
    }.bind(this), callback);
  },

  prototype: function(callback) {
    this.request('prototype', function(resp) {
      var obj = new JSObject(this.client, resp.prototype);
      callback(obj)
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
    var value = descriptor.value;
    if (value.type == "object") {
      descriptor.value = new JSObject(this.client, value);
    }
  }
})