var debug = require('debug')('peripheral');

var events = require('events');
var util = require('util');

function Peripheral(noble, uuid, advertisement, rssi) {
  this._noble = noble;

  this.uuid = uuid;
  this.advertisement = advertisement;
  this.rssi = rssi;
  this.services = null;
}

util.inherits(Peripheral, events.EventEmitter);

Peripheral.prototype.toString = function() {
  return JSON.stringify({
    uuid: this.uuid,
    advertisement: this.advertisement,
    rssi: this.rssi
  });
};

Peripheral.prototype.connect = function(callback) {
  if (callback) {
    this.once('connect', function() {
      callback(null);
    });
  }

  this._noble.connect(this.uuid);
};

Peripheral.prototype.disconnect = function(callback) {
  if (callback) {
    this.once('disconnect', function() {
      callback(null);
    });
  }

  this._noble.disconnect(this.uuid);
};

Peripheral.prototype.updateRssi = function(callback) {
  if (callback) {
    this.once('rssiUpdate', function(rssi) {
      callback(null, rssi);
    });
  }

  this._noble.updateRssi(this.uuid);
};

Peripheral.prototype.discoverServices = function(uuids, callback) {
  if (callback) {
    this.once('servicesDiscover', function(services) {
      callback(null, services);
    });
  }

  this._noble.discoverServices(this.uuid, uuids);
};

module.exports = Peripheral;