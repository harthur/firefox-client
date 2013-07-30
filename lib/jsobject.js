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

  ownPropertyNames: function(cb) {
    this.request('ownPropertyNames', function(resp) {
      return resp.ownPropertyNames;
    }, cb);
  },

  ownPropertyDescriptor: function(name, cb) {
    this.request('property', { name: name }, function(resp) {
      return this.transformDescriptor(resp.descriptor);
    }.bind(this), cb);
  },

  ownProperties: function(cb) {
    this.request('prototypeAndProperties', function(resp) {
      return select(resp.ownProperties, ":root > *")
             .update(this.transformDescriptor.bind(this));
    }.bind(this), cb);
  },

  prototype: function(cb) {
    this.request('prototype', function(resp) {
      return this.createJSObject(resp.prototype);
    }.bind(this), cb);
  },

  ownPropertiesAndPrototype: function(cb) {
    this.request('prototypeAndProperties', function(resp) {
      select(resp.ownProperties, ":root > *")
       .update(this.transformDescriptor.bind(this));

      resp.prototype = this.createJSObject(resp.prototype);

      return resp;
    }.bind(this), cb);
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