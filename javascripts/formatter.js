/*
 *    ___                    __  __              _   
 *   / _/__  ______ _  ___ _/ /_/ /____ ____    (_)__
 *  / _/ _ \/ __/  ' \/ _ `/ __/ __/ -_) __/   / (_-<
 * /_/ \___/_/ /_/_/_/\_,_/\__/\__/\__/_/ (_)_/ /___/
 *                                           |___/  
 * v0.0.1
 * Copyright (c) 2013 First Opinion
 * formatter.js is open sourced under the MIT license.
 *
 * thanks to digitalBush/jquery.maskedinput for some of the trickier
 * keycode handling
 */



(function() {

  /////////////////////////////////////////////////////////////////////////////
  // Setup
  // - inspiration from underscore.js
  /////////////////////////////////////////////////////////////////////////////
  
  // Establish the root object, window in the browser,
  // or exports on the server.
  var root = this;

  if (typeof module !== 'undefined' && module.exports) {
    exports.Formatter = Formatter;
  } else {
    root.Formatter = Formatter;
  }

  // Need some userAgent info for keycode handling
  var ua = navigator.userAgent,
      iPhone = /iphone/i.test(ua);


  /////////////////////////////////////////////////////////////////////////////
  // Defaults
  /////////////////////////////////////////////////////////////////////////////

  var defaults = {
    persistent: false,
    repeat: false,
    placeholder: ' '
  };


  /////////////////////////////////////////////////////////////////////////////
  // Class
  /////////////////////////////////////////////////////////////////////////////

  //
  // @public
  // Class Constructor - Called with new Formatter(el, opts)
  // Responsible for setting up required instance variables, and
  // attaching the event listener to the element
  //
  function Formatter(el, opts) {
    // The element to FORMAT
    this.el = el;

    // Make sure we have an element
    if (!this.el) { 
      throw new TypeError('Must provide an existing element');
    }

    // Merge opts with defaults
    this.opts = extend({}, defaults, opts);

    // Make sure we have valid opts
    if (typeof this.opts.pattern === 'undefined') {
      throw new TypeError('Must provide a pattern');
    } else if (this.opts.persistent && this.opts.repeat) {
      throw new TypeError('Cannot persist and repeat');
    }

    // Get info about the given pattern
    var patternInfo = getPatternInfo(this.opts.pattern);
    this.chars = patternInfo.chars;
    this.maxLength = patternInfo.maxLength;

    // If persistent, trigger format
    if (this.opts.persistent) {
      this._processKey(null, true);
      this.el.blur();
    }
    
    // Listeners
    // Keep class context
    var self = this;
    addEventListener(this.el, 'keydown', function (evt) {
      self._keyDown(evt);
    });
    addEventListener(this.el, 'keypress', function (evt) {
      self._keyPress(evt);
    });
    addEventListener(this.el, 'paste', function (evt) {
      self._paste(evt);
    });
  };

  //
  // @private
  // This is the handler called on all keyDown strokes. All keys fire this
  // handler. We use this handler to deal with special keys. Only process
  // delete keys.
  // 
  //
  Formatter.prototype._keyDown = function (evt) {
    // The first thing we need is the character code
    var k = evt.which || evt.keyCode;

    // If delete key
    if (k && isDelKey(k)) {
      // Process the keyCode and prevent default
      this._processKey(null, true);
      return preventDefault(evt);
    }
  };

  //
  // @private
  // This is the handler called on all keyPress strokes. This handler
  // is used to process characters.
  //
  Formatter.prototype._keyPress = function (evt) {
    // The first thing we need is the character code
    var k = evt.which || evt.keyCode;

    // Process the keyCode and prevent default
    if (!isDelKey(k) && !isModifier(evt)) {
      this._processKey(String.fromCharCode(k), false);
      return preventDefault(evt);
    }
  };

  //
  // @private
  // Handle paste events.
  //
  Formatter.prototype._paste = function (evt) {
    // Process the clipboard paste and prevent default
    this._processKey(getClipBoardData(evt), false);
    return preventDefault(evt);
  };

  //
  // @private
  // Using the provided key information, alter the value of the
  // instance element.
  //
  Formatter.prototype._processKey = function (chars, isDelKey) {
    // Our old newPos is now our oldPos
    // String manipulation depends on current selection/position
    this.sel = getInputSelection(this.el);

    // Get the el vlaue (prior to processing current key)
    this.val = this.el.value;
    // We will record the delta of our actions so that we can
    // properly account for it during formatting
    this.delta = 0;

    // If characters were highlighted, we will need to remove them
    if (this.sel.start !== this.sel.end) {
      this.val = removeCharFrom(this.val, this.sel.start, this.sel.end);
      this.delta = -Math.abs(this.sel.start - this.sel.end);
    // If pressed key is a del key, and the caret pos is not at start,
    // remove at caret pos
    } else if (isDelKey && this.sel.start-1 >= 0) {
      this.val = removeCharFrom(this.val, this.sel.end -1, this.sel.end);
      this.delta = -1;
    }

    // If the key is not a del key, it should convert to a str
    if (!isDelKey) {
      // Add char at position and increment delta
      this.val = addCharsAtPos(this.val, chars, this.sel.start);
      this.delta += chars.length;
    }

    // Set current caret position
    this.curPos = this.sel.end;

    // Format el.value (also handles updating caret position)
    this._formatValue();
  };

  //
  // @private
  // Alter element value to display characters matching the provided
  // instance pattern. Also responsible for updatin
  //
  Formatter.prototype._formatValue = function () {
    // Our new caret position
    this.newPos = this.curPos + this.delta;

    // Remove all formatted chars from val
    this._removeChars();
    // Add formatted characters
    this._addChars();

    // Adhere to maxLength and set to el.value
    this.el.value = this.val.substr(0, this.maxLength);

    // Set new caret position
    setCaretPos(this.el, this.newPos);
  };

  //
  // @private
  // Loop over val and add formatted chars as necessary
  //
  Formatter.prototype._addChars = function () {
    if (this.opts.persistent) {
      // Avoid caching val.length, as it changes during manipulations
      for (var i = 0; i <= this.maxLength; i++) {
        if (!this.val[i]) {
          this.val = addCharsAtPos(this.val, this.opts.placeholder, i);
        }
        this._addChar(i);
      }
    } else {
      // Avoid caching val.length, as it changes during manipulations
      for (var i = 0; i <= this.val.length; i++) {
        console.log('ok');
        this._addChar(i);
      }
    }
  }

  //
  // @private
  // Add formattted char at position
  //
  Formatter.prototype._addChar = function (i) {
    // If char exists at position
    var char = this.chars[i];
    if (!char) { return true }

    // If chars are added in between the old pos and new pos
    // we need to increment pos and delta
    if (isBetween(i, [this.sel.start -1, this.newPos +1])) {
      this.newPos ++;
      this.delta ++;
    }

    // When moving backwards there are some race conditions where we
    // dont want to add the character
    if (this.delta < 0 && (this.val[i] == char )) { return true }

    // Update value
    this.val = addCharsAtPos(this.val, char, i)
  };

  //
  // @private
  // Remove all formatted before and after a specified pos
  //
  Formatter.prototype._removeChars = function () {
    // Account for shifts during removal
    var shift = 0;
    // Loop through all possible char positions
    for (var i = 0; i <= this.maxLength; i++) {
      if (!this.chars[i]) { continue }
      // Transformed position accounts for shift from removal, as well
      // as delta from user input (after pos)
      var transPos = (i >= this.curPos) ? i + this.delta + shift : i + shift;
      // If the value to be removed exists at pos
      if (this.chars[i] == this.val[transPos]) {
        this.val = removeCharFrom(this.val, transPos, transPos + 1);
        shift--;
      }
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  // Class Utils
  /////////////////////////////////////////////////////////////////////////////

  //
  // @private
  // Create an object holding all formatted characters
  // with corresponding positions
  //
  var getPatternInfo = function (pattern) {
    // Account for delim characters
    var DELIM_SIZE = 4;
    // Object we are populating
    var chars = {};
    // Record the str length
    var i = 0;
    // We need to gather info regarding all matches
    var matches = [];

    // Populate array of matches
    var re = new RegExp('{{([^}]+)}}', 'g');
    while(match = re.exec(pattern)) {
      matches.push(match);
    }

    // Cache pattern length
    var patternLength  = pattern.length;
    // Match increments everytime a match is found
    var matchIncr  = 0;
    // Loop over all chars in pattern.
    for (i; i < patternLength; i++) {
      // The current match object
      var match = matches[matchIncr];
      // If the current char is the start of a match, we need to
      // skip over it (i+=) and move onto the next match (matchIncr++)
      if (i == match.index) {
        i += (match[1].length + DELIM_SIZE - 1);
        matchIncr ++;
      // If not we must add to chars obj
      } else {
        delimCharCount = matchIncr * DELIM_SIZE
        chars[i - delimCharCount] = pattern[i];
      }
    }

    // Return the chars object and the length of the pattern
    return { chars: chars, maxLength: i - (matchIncr * DELIM_SIZE) }
  };

  //
  // @private
  // Add a given character to a string at a defined pos
  //
  var addCharsAtPos = function (str, chars, pos) {
    return str.substr(0, pos) + chars + str.substr(pos, str.length);
  };

  //
  // @private
  // Remove a span of characters
  //
  var removeCharFrom = function (str, start, end) {
    return str.substr(0, start) + str.substr(end, str.length);
  };

  //
  // @private
  // Shallow copy properties from n objects to destObj
  //
  var extend = function (destObj) {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        destObj[key] = arguments[i][key];
      }
    }
    return destObj;
  };

  //
  // @private
  // Return true/false is num false between bounds
  //
  var isBetween = function (num, bounds) {
    bounds.sort(function(a,b) { return a-b });
    return (num > bounds[0] && num < bounds[1])
  };

  // @private
  // Returns true/false if k is a del key
  //
  var isDelKey = function (k) {
    return k === 8 || k === 46 || (iPhone && k === 127)
  };

  //
  // @private
  // Returns true/false if modifier key is held down
  //
  var isModifier = function (evt) {
    return evt.ctrlKey || evt.altKey || evt.metaKey
  }

  //
  // @private
  // Helper method for cross browser event listeners
  //
  var addEventListener = function (el, evt, handler) {
    return (typeof el.addEventListener != "undefined")
      ? el.addEventListener(evt, handler, false)
      : el.attachEvent('on' + evt, handler);
  };

  //
  // @private
  // Helper method for cross browser implementation of preventDefault
  //
  var preventDefault = function (evt) {
    (evt.preventDefault) ? evt.preventDefault() : (evt.returnValue = false);
  };

  //
  // @private
  // Helper method for cross browser implementation for grabbing
  // clipboard data
  //
  var getClipBoardData = function (evt) {
    if (evt.clipboardData) { return evt.clipboardData.getData('Text') }
    if (window.clipboardData) { return window.clipboardData.getData('Text') }
  }
  //
  // @private
  // Get start and end positions of selected input. Return 0's
  // if there is no selectiion data
  //
  var getInputSelection = function (el) {
    // If normal browser return with result
    if (typeof el.selectionStart == "number") {
      return { 
        start: el.selectionStart,
        end: el.selectionEnd
      }
    }

    // Uh-Oh. We must be IE. Fun with TextRange!!
    var range = document.selection.createRange();
    // Determine if there is a selection
    if (range && range.parentElement() == el) {
      var inputRange = el.createTextRange(),
          endRange   = el.createTextRange(),
          length     = el.value.length;

      // Create a working TextRange for the input selection
      inputRange.moveToBookmark(range.getBookmark());

      // Move endRange start pos to end pos (hence endRange)
      endRange.collapse(false);
      
      // If we are at the very end of the input, start and end
      // must both be the length of the el.value
      if (inputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        return { start: length, end: length }
      }

      // Note: moveStart usually returns the units moved, which one may
      // think is -length, however, it will stop when it gets to the
      // start of the range, thus giving us the negative value of the pos.
      return {
        start: -inputRange.moveStart("character", -length),
        end: -inputRange.moveEnd("character", -length)
      }
    }

    //Return 0's on no selection data
    return { start: 0, end: 0 }
  };

  //
  // @private
  // Set the caret position at a specified location
  //
  var setCaretPos = function (el, pos) {
    // If normal browser
    if (el.setSelectionRange) {
      el.focus();
      el.setSelectionRange(pos,pos);

    // IE = TextRange fun
    } else if (el.createTextRange) {
      var range = el.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  };

})();