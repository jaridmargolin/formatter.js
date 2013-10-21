/*
 * test/fake-user/events.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

// define module
module.exports = events = {};


// Base event that all events inherit from
var Event = function () {};
Event.prototype.preventDefault = function () {};


//
// Event passed on keyboard related event
//
events.KeyEvent = function (opts) {
  // Defaults
  this.altKey = false;
  this.ctrlKey = false;
  this.metaKey = false;
  this.shiftKey = false;
  // Merge
  extend(this, opts);
};

// Inherits from Event
events.KeyEvent.prototype = Object.create(events.KeyEvent.prototype);
events.KeyEvent.prototype.constructor = events.KeyEvent;


//
// Event passed on paste event
//
events.PasteEvent = function (str) {
  // Defaults
  this.clipboardData = {
    getData: function (type) {
      return str;
    }
  };
};

// Inherits from Event
events.PasteEvent.prototype = Object.create(events.PasteEvent.prototype);
events.PasteEvent.prototype.constructor = events.PasteEvent;


//
// Helper - shallow copy properties
//
var extend = function (destObj) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      destObj[key] = arguments[i][key];
    }
  }
  return destObj;
};