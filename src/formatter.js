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
  // Setup
  // - inspiration from underscore.js
  /////////////////////////////////////////////////////
  
  // Establish the root object, window in the browser,
  // or exports on the server.
  var root = this;

  if (typeof module !== 'undefined' && module.exports) {
    exports.Formatter = Formatter;
  } else {
    root.Formatter = Formatter;
  }


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

  function Formatter(el, opts) {
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
    self.sLength = 0;
    self.fLength = 0;
    self.chars   = self._findChars(self.opts.str);
    self.el      = el;

    // Update
    var update = function (evt) {
      // The first thing we need to do is get the cursor pos
      self.pos = self._getCaretPosition(self.el);

      // Cache values
      var fullStr  = self.el.value;
          stripStr = fullStr.replace(/[^a-z0-9]/gi,'');

      // Cache values about values
      var fLength = fullStr.length,
          sLength = stripStr.length;
          
      // We need to find out information regarding
      // the users current state
      var movingForward = fullStr.length > self.fLength,
          changedInput = sLength !== self.sLength,
          addedInput = sLength > self.sLength,
          cursAtChar = self.chars[self.pos - 1],
          cursAtEnd = self.pos == fullStr.length;

      // If the user added input we must format. If the cursor
      // isn't at the end of the string we must also format.
      if (changedInput || !cursAtEnd) {
        // If we are moving forward notify.
        self.el.value = self._addChars(stripStr, self.chars, movingForward);
        // If cursor position is at a formatted character
        // and the user added input we must bump the cursor
        // position forward.
        if (cursAtChar && addedInput) { self.pos++; }
        // Set cursor position
        self._setCaretPosition(self.el, self.pos);
      }

      // Save lengths to use on next update
      self.fLength = self.el.value.length;
      self.sLength = sLength;
    };

    // Listeners
    self._addEventListener(self.el, 'keyup', function (evt) {
      update(evt);
    });
  };

  //
  // @private
  // Return updated string with formatted characters added
  //
  Formatter.prototype._addChars = function (str, chars, movingForward) {
    // Loop over str and add characters at designated counts
    // Note: does not cache str length as it changes during iter
    for (var i = 0; i < str.length + 1; i++) {
      // If character exists at position, add at position
      if (chars[i]) {
        str = str.substr(0, i) + chars[i] + str.substr(i, str.length);
        // If a character was added at this position and we are
        // moving forward. Move cursor forward.
        if (movingForward && this.pos == i) { this.pos++; }
      }
    }
    // Return value
    return str
  };

  //
  // @private
  // Create an array holding all input matches
  //
  Formatter.prototype._findMatches = function (str) {
    var matchExp = new RegExp('{{([^}]+)}}', 'g'),
        matches  = [],
        match;

    // Create array of matches
    while(match = matchExp.exec(str)) {
      matches.push(match);
    }
    return matches;
  };

  //
  // @private
  // Create an object holding all formatted characters
  // with corresponding positions
  //
  Formatter.prototype._findChars = function (str) {
    var DELIM_SIZE = 4;
    var strLength  = str.length,
        matchIncr  = 0,
        matches    = this._findMatches(str),
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
        chars[i - (matchIncr * DELIM_SIZE)] = str[i];
      }
    }
    return chars;
  }


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
    return destObj;
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
    return pos
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