var extend = require("./extend");
var ClientMethods = require("./client-methods");

module.exports = Network;

function Network(client, actor) {
  this.initialize(client, actor);

  this.on("networkEvent", this.onNetworkEvent.bind(this));
}

Network.prototype = extend(ClientMethods, {
  types: ["NetworkActivity"],

  startLogging: function(callback) {
    this.request('startListeners', { listeners: this.types }, callback);
  },

  stopLogging: function(callback) {
    this.request('stopListeners', { listeners: this.types }, callback);
  },

  onNetworkEvent: function(event) {
    var networkEvent = new NetworkEvent(this.client, event.eventActor);

    this.emit("network-event", networkEvent);
  },

  sendHTTPRequest: function(request, callback) {
    this.request('sendHTTPRequest', { request: request }, function(resp) {
      var networkEvent = new NetworkEvent(this.client, resp.eventActor);

      callback(networkEvent);
    }.bind(this));
  }
})

function NetworkEvent(client, event) {
  this.initialize(client, event.actor);
  this.event = event;

  this.on("networkEventUpdate", this.onUpdate.bind(this));
}

NetworkEvent.prototype = extend(ClientMethods, {
  get url() {
   return this.event.url;
  },

  get method() {
    return this.event.method;
  },

  get isXHR() {
    return this.event.isXHR;
  },

  getRequestHeaders: function(callback) {
    this.request('getRequestHeaders', callback);
  },

  getRequestCookies: function(callback) {
    this.request('getRequestCookies', callback);
  },

  getRequestPostData: function(callback) {
    this.request('getRequestPostData', callback);
  },

  getResponseHeaders: function(callback) {
    this.request('getResponseHeaders', callback);
  },

  getResponseCookies: function(callback) {
    this.request('getResponseCookies', callback);
  },

  getResponseContent: function(callback) {
    this.request('getResponseContent', callback);
  },

  getEventTimings: function(callback) {
    this.request('getEventTimings', callback);
  },

  onUpdate: function(event) {
    this.emit("update", event.updateType, event);
  }
})