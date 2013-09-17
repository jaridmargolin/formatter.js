/*
 *    ___                    __  __              _   
 *   / _/__  ______ _  ___ _/ /_/ /____ ____    (_)__
 *  / _/ _ \/ __/  ' \/ _ `/ __/ __/ -_) __/   / (_-<
 * /_/ \___/_/ /_/_/_/\_,_/\__/\__/\__/_/ (_)_/ /___/
 *                                           |___/  
 * v0.0.1
 * Copyright (c) 2013 First Opinion
 * formatter.js is open sourced under the MIT license.   
 */



(function() {

  /////////////////////////////////////////////////////
  // Defaults
  /////////////////////////////////////////////////////

  var defaults = {
    persistent: false,
    repeat: false
  };


  /////////////////////////////////////////////////////
  // Class
  /////////////////////////////////////////////////////

  this.Formatter = function(el, opts) {
    // Cache this
    var self = this;

    // Merge opts with defaults
    self.opts = self._extend({}, defaults, opts);
    // Make sure we have valid opts
    if (!self.opts.str) {
      new TypeError('Must provide a string');
    } else if (self.opts.persistent && self.opts.repeat) {
      new TypeError('Cannot persist and repeat');
    }

    // Setup
    self.curPos = 0;
    self.chars  = self._findChars();
    self.el     = el;
    
    // Format on keyup
    self._addEventListener(self.el, 'keyup', function (evt) {
      // Cache position before manipulating
      var pos = self._getCaretPosition(self.el);
      // Set text value
      self.el.value = self._addChars(self.el.value);
      // Update cursorPosition
      self._updateCursorPos(pos);
    });
  };

  //
  // @private
  // Create an array holding all input matches
  //
  Formatter.prototype._findMatches = function () {
    var matchExp = new RegExp('{{([^}]+)}}', 'g'),
        matches  = [],
        match;

    // Create array of matches
    while(match = matchExp.exec(this.opts.str)) {
      matches.push(match);
    }
    return matches;
  };

  //
  // @private
  // Create an object holding all formatted characters
  // with corresponding positions
  //
  Formatter.prototype._findChars = function () {
    var DELIM_SIZE = 4;
    var strLength  = this.opts.str.length,
        matchIncr  = 0,
        matches    = this._findMatches(),
        chars      = {};

    // Loop over all characters of the string 
    // If character is part of a match skip to the end of
    // the match and move onto the next... else add to chars obj
    for (var i = 0; i < strLength; i++) {
      var match = matches[matchIncr];
      if (i == match.index) {
        i += (match[1].length + DELIM_SIZE - 1);
        matchIncr ++;
      } else {
        chars[i - (matchIncr * DELIM_SIZE)] = this.opts.str[i];
      }
    }
    return chars;
  }

  //
  // @private
  // Move cursor to correct location after adding characters
  //
  Formatter.prototype._updateCursorPos = function (pos) {
    // For every formatted character added move the caret position
    for (var i = 2; true; i++) {
      var count = this.el.value.length - i;
      if (typeof this.chars[count] === 'undefined') { break }
      this.pos++
    }
    this._setCaretPosition(this.el, pos);
  }

  //
  // @private
  // Return updated string with formatted characters added
  //
  Formatter.prototype._addChars = function (str) {
    // Does not cache str length as it changes during iteration
    for (var i = 0; i < str.length; i++) {
      // If character exists at position but has not
      // yet been added, add at location
      if (this.chars[i] && (str[i] !== this.chars[i])) {
        str = str.substr(0, i) + this.chars[i] + str.substr(i, str.length);
      }
    }
    return str
  };


  /////////////////////////////////////////////////////
  // Class Utils
  /////////////////////////////////////////////////////

  //
  // @private
  // Shallow copy properties from n objects to destObj
  //
  Formatter.prototype._extend = function (destObj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        destObj[key] = arguments[i][key];
      }
    }
  }

  //
  // @private
  // Helper method for cross browser event listeners
  //
  Formatter.prototype._addEventListener = function (el, evt, handler) {
    return (typeof el.addEventListener != "undefined")
      ? el.addEventListener(evt, handler, false)
      : el.attachEvent('on' + evt, handler);
  };

  //
  // @private
  // Returns the caret (cursor) position of the specified text field.
  //
  Formatter.prototype._getCaretPosition = function (el) {
    var pos = 0;
    if (document.selection) {
      el.focus();
      var selRange = document.selection.createRange();
      selRange.moveStart ('character', -el.value.length);
      pos = selRange.text.length;
    } else if (el.selectionStart || el.selectionStart == '0') {
      pos = el.selectionStart
    }
  };

  //
  // @private
  // Set the caret position at a specified location
  //
  Formatter.prototype._setCaretPosition = function (el, pos) {
    if (el.setSelectionRange) {
      el.focus();
      el.setSelectionRange(pos,pos);
    } else if (el.createTextRange) {
      var range = ctrl.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

})();