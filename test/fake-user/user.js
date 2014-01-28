/*
 * test/fake-user/user.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

// stdlib
var EventEmitter = require('events').EventEmitter;

// first party
var events = require('./events'),
    keys   = require('./keys');

// define module
module.exports = User;


//
// User Class
//
function User() {}

// Inherits from EventEmitter
User.prototype = Object.create(EventEmitter.prototype);
User.prototype.constructor = User;

//
// Mock keyboard input
//
User.prototype.key = function (char, opts) {
  // Determine what we should trigger by looking for
  // existence within keys.press, and keys.down
  var keyPress = keys.getPress(char),
      keyDown  = keys.getDown(char);

  // If no opts passed, create blank obj
  if (!opts) { opts = {}; }

  if (keyPress) {
    opts.which = keyPress.which;
    opts.keyCode = keyPress.keyCode;
    opts.shiftKey = keyPress.shiftKey;
    this.emit('keypress', new events.KeyEvent(opts));
  }
  if (keyDown.which) {
    opts.which = keyDown.which;
    opts.keyCode = keyDown.keyCode;
    opts.shiftKey = keyDown.shiftKey;
    this.emit('keydown', new events.KeyEvent(opts));
  }
};

//
// Fire off a series of keys
//
User.prototype.keySeq = function (str, callback) {
  // Cache this
  var self = this;

  var singleKey = function (i) {
    setTimeout(function () {
      self.key(str[i]);
      return (i == strLength - 1)
        ? callback()
        : true;
    }, 1);
  };

  var strLength = str.length;
  for (var i = 0; i < strLength; i++) {
    singleKey(i);
  }
};

//
// Mock focus evt
//
User.prototype.focus = function () {
  this.emit('focus');
};

//
// Mock paste event
//
User.prototype.paste = function (str, callback) {
  this.emit('paste', new events.PasteEvent(str));
  setTimeout(function () {
    callback();
  }, 1);
};