/*!
 * v0.0.4
 * Copyright (c) 2013 First Opinion
 * formatter.js is open sourced under the MIT license.
 *
 * thanks to digitalBush/jquery.maskedinput for some of the trickier
 * keycode handling
 */ 

;(function ($, window, document, undefined) {

// Defaults
var defaults = {
  persistent: false,
  repeat: false,
  placeholder: ' '
};

// Regexs for input validation
var inptRegs = {
  '9': new RegExp('[0-9]'),
  'a': new RegExp('[A-Za-z]'),
  '*': new RegExp('[A-Za-z0-9]')
};

//
// Class Constructor - Called with new Formatter(el, opts)
// Responsible for setting up required instance variables, and
// attaching the event listener to the element.
//
function Formatter(el, opts) {
  // Cache this
  var self = this;

  // Make sure we have an element. Make accesible to instance
  self.el = el;
  if (!self.el) { 
    throw new TypeError('Must provide an existing element');
  }

  // Merge opts with defaults
  self.opts = utils.extend({}, defaults, opts);

  // Make sure we have valid opts
  if (typeof self.opts.pattern === 'undefined') {
    throw new TypeError('Must provide a pattern');
  }

  // Get info about the given pattern
  var parsed   = pattern.parse(self.opts.pattern);
  self.mLength = parsed.mLength;
  self.chars   = parsed.chars;
  self.inpts   = parsed.inpts;

  // Init values
  self.hldrs = {};
  self.focus = 0;

  // Add Listeners
  utils.addListener(self.el, 'keydown', function (evt) {
    self._keyDown(evt);
  });
  utils.addListener(self.el, 'keypress', function (evt) {
    self._keyPress(evt);
  });
  utils.addListener(self.el, 'paste', function (evt) {
    self._paste(evt);
  });

  // Persistence
  if (self.opts.persistent) {
    // Format on start
    self._processKey(null, true);
    self.el.blur();

    // Add Listeners
    utils.addListener(self.el, 'focus', function (evt) {
      self._focus(evt);
    });
    utils.addListener(self.el, 'click', function (evt) {
      self._focus(evt);
    });
    utils.addListener(self.el, 'touchstart', function (evt) {
      self._focus(evt);
    });
  }
}

//
// @private
// Handler called on all keyDown strokes. All keys trigger
// this handler. Only process delete keys.
//
Formatter.prototype._keyDown = function (evt) {
  // The first thing we need is the character code
  var k = evt.which || evt.keyCode;

  // If delete key
  if (k && utils.isDelKey(k)) {
    // Process the keyCode and prevent default
    this._processKey(null, k);
    return utils.preventDefault(evt);
  }
};

//
// @private
// Handler called on all keyPress strokes. Only processes
// character keys (as long as no modifier key is in use).
//
Formatter.prototype._keyPress = function (evt) {
  // The first thing we need is the character code
  var k, isSpecial;
  // Mozilla will trigger on special keys and assign the the value 0
  // We want to use that 0 rather than the keyCode it assigns.
  if (evt.which) {
    k = evt.which;
  } else {
    k = evt.keyCode;
    isSpecial = utils.isSpecialKey(k);
  }
  // Process the keyCode and prevent default
  if (!utils.isDelKey(k) && !isSpecial && !utils.isModifier(evt)) {
    this._processKey(String.fromCharCode(k), false);
    return utils.preventDefault(evt);
  }
};

//
// @private
// Handler called on paste event.
//
Formatter.prototype._paste = function (evt) {
  // Process the clipboard paste and prevent default
  this._processKey(utils.getClip(evt), false);
  return utils.preventDefault(evt);
};

//
// @private
// Handle called on focus event.
//
Formatter.prototype._focus = function (evt) {
  // Wrapped in timeout so that we can grab input selection
  var self = this;
  setTimeout(function () {
    // Grab selection
    var selection = inptSel.get(self.el);
    // Char check
    var isAfterStart = selection.end > self.focus;
        isFirstChar  = selection.end === 0;
    // If clicked in front of start, refocus to start
    if (isAfterStart || isFirstChar) {
      inptSel.set(self.el, self.focus);
    }
  }, 0);
};

//
// @private
// Using the provided key information, alter el value.
//
Formatter.prototype._processKey = function (chars, delKey) {
  // Get current state
  this.sel = inptSel.get(this.el);
  this.val = this.el.value;

  // Init values
  this.delta = 0;

  // If chars were highlighted, we need to remove them
  if (this.sel.begin !== this.sel.end) {
    this.delta = (-1) * Math.abs(this.sel.begin - this.sel.end);
    this.val   = utils.removeChars(this.val, this.sel.begin, this.sel.end);
  }
  // If delKey
  else if (delKey) {
    // Delete
    if (delKey && delKey == 46) {
      // Adjust focus to make sure its not on a formatted char
      while (this.chars[this.sel.begin]) {
        this._nextPos();
      }
      // As long as we are not at the end
      if (this.sel.begin < this.val.length) {
        // We will simulate a delete by moving the caret to the next char
        // and then deleting
        this._nextPos();
        this.val = utils.removeChars(this.val, this.sel.end -1, this.sel.end);
        this.delta = -1;
      }
    // or Backspace and not at start
    } else if (delKey && this.sel.begin - 1 >= 0) {
      this.val = utils.removeChars(this.val, this.sel.end -1, this.sel.end);
      this.delta = -1;
    }
  }

  // If the key is not a del key, it should convert to a str
  if (!delKey) {
    // Add char at position and increment delta
    this.val = utils.addChars(this.val, chars, this.sel.begin);
    this.delta += chars.length;
  }

  // Format el.value (also handles updating caret position)
  this._formatValue();
};

//
// @private
// Quick helper method to move the caret to the next pos
//
Formatter.prototype._nextPos = function () {
  this.sel.end ++;
  this.sel.begin ++;
};

//
// @private
// Alter element value to display characters matching the provided
// instance pattern. Also responsible for updatin
//
Formatter.prototype._formatValue = function () {
  // Set caret pos
  this.curPos = this.sel.end;
  this.newPos = this.curPos + this.delta;

  // Remove all formatted chars from val
  this._removeChars();
  // Validate inpts
  this._validateInpts();
  // Add formatted characters
  this._addChars();

  // Set vakye and adhere to maxLength 
  this.el.value = this.val.substr(0, this.mLength);

  // Set new caret position
  inptSel.set(this.el, this.newPos);
};

//
// @private
// Remove all formatted before and after a specified pos
//
Formatter.prototype._removeChars = function () {
  // Delta shouldn't include placeholders
  if (this.sel.end > this.focus) {
    this.delta += this.sel.end - this.focus;
  }

  // Account for shifts during removal
  var shift = 0;

  // Loop through all possible char positions
  for (var i = 0; i <= this.mLength; i++) {
    // Get transformed position
    var curChar = this.chars[i],
        curHldr = this.hldrs[i],
        pos = i + shift,
        val;

    // If after selection we need to account for delta
    pos = (i >= this.sel.begin) ? pos + this.delta : pos;
    val = this.val[pos];
    // Remove char and account for shift
    if (curChar && curChar == val || curHldr && curHldr == val) {
      this.val = utils.removeChars(this.val, pos, pos + 1);
      shift--;
    }
  }

  // All hldrs should be removed now
  this.hldrs = {};

  // Set focus to last character
  this.focus = this.val.length;
};

//
// @private
// Make sure all inpts are valid, else remove and update delta
//
Formatter.prototype._validateInpts = function () {
  // Loop over each char and validate
  for (var i = 0; i < this.val.length; i++) {
    // Get char inpt type
    var inptType = this.inpts[i];

    // If improper type, or char doesnt match, remove
    if (!inptRegs[inptType] || !inptRegs[inptType].test(this.val[i])) {
      // Check bounds
      if (this.inpts[i]) {
        this.val = utils.removeChars(this.val, i, i + 1);
        this.focusStart--;
        this.newPos--;
        this.delta--;
        i--;
      }
    }
  }
};

//
// @private
// Loop over val and add formatted chars as necessary
//
Formatter.prototype._addChars = function () {
  if (this.opts.persistent) { 
    // Loop over all possible characters
    for (var i = 0; i <= this.mLength; i++) {
      if (!this.val[i]) {
        // Add placeholder at pos
        this.val = utils.addChars(this.val, this.opts.placeholder, i);
        this.hldrs[i] = this.opts.placeholder;
      }
      this._addChar(i);
    }

    // Adjust focus to make sure its not on a formatted char
    while (this.chars[this.focus]) {
      this.focus++;
    }
  } else {
    // Avoid caching val.length, as it changes during manipulations
    for (var j = 0; j <= this.val.length; j++) {
      this._addChar(j);
    }
  }
};

//
// @private
// Add formattted char at position
//
Formatter.prototype._addChar = function (i) {
  // If char exists at position
  var char = this.chars[i];
  if (!char) { return true; }

  // If chars are added in between the old pos and new pos
  // we need to increment pos and delta
  if (utils.isBetween(i, [this.sel.begin -1, this.newPos +1])) {
    this.newPos ++;
    this.delta ++;
  }

  // If character added before focus, incr
  if (i <= this.focus) {
    this.focus++;
  }

  // When moving backwards there are some race conditions where we
  // dont want to add the character
  if (this.delta < 0 && (this.val[i] == char )) { return true; }

  // Updateholder
  if (this.hldrs[i]) {
    delete this.hldrs[i];
    this.hldrs[i + 1] = this.opts.placeholder;
  }

  // Update value
  this.val = utils.addChars(this.val, char, i);
};
// Define module
var pattern = {};

// Match information
var DELIM_SIZE = 4;

// Our regex used to parse
var regexp  = new RegExp('{{([^}]+)}}', 'g');

//
// Helper method to parse pattern str
//
var getMatches = function (pattern) {
  // Populate array of matches
  var matches = [],
      match;
  while(match = regexp.exec(pattern)) {
    matches.push(match);
  }

  return matches;
};

//
// Create an object holding all formatted characters
// with corresponding positions
//
pattern.parse = function (pattern) {
  // Our obj to populate
  var info = { inpts: {}, chars: {} };

  // Pattern information
  var matches = getMatches(pattern),
      pLength = pattern.length;

  // Counters
  var mCount = 0,
      iCount = 0,
      i = 0;

  // Add inpts, move to end of match, and process
  var processMatch = function (val) {
    var valLength = val.length;
    for (var j = 0; j < valLength; j++) {
      info.inpts[iCount] = val[j];
      iCount++;
    }
    mCount ++;
    i += (val.length + DELIM_SIZE - 1);
  };

  // Process match or add chars
  for (i; i < pLength; i++) {
    if (i == matches[mCount].index) {
      processMatch(matches[mCount][1]);
    } else {
      info.chars[i - (mCount * DELIM_SIZE)] = pattern[i];
    }
  }

  // Set mLength and return
  info.mLength = i - (mCount * DELIM_SIZE);
  return info;
};
// Define module
var inptSel = {};

//
// Get begin and end positions of selected input. Return 0's
// if there is no selectiion data
//
inptSel.get = function (el) {
  // If normal browser return with result
  if (typeof el.selectionStart == "number") {
    return { 
      begin: el.selectionStart,
      end: el.selectionEnd
    };
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

    // Move endRange begin pos to end pos (hence endRange)
    endRange.collapse(false);
    
    // If we are at the very end of the input, begin and end
    // must both be the length of the el.value
    if (inputRange.compareEndPoints("StartToEnd", endRange) > -1) {
      return { begin: length, end: length };
    }

    // Note: moveStart usually returns the units moved, which 
    // one may think is -length, however, it will stop when it
    // gets to the begin of the range, thus giving us the
    // negative value of the pos.
    return {
      begin: -inputRange.moveStart("character", -length),
      end: -inputRange.moveEnd("character", -length)
    };
  }

  //Return 0's on no selection data
  return { begin: 0, end: 0 };
};

//
// Set the caret position at a specified location
//
inptSel.set = function (el, pos) {
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
// Define module
var utils = {};

// Useragent info for keycode handling
var uAgent = (typeof navigator !== 'undefined') ? navigator.userAgent : null,
    iPhone = /iphone/i.test(uAgent);

//
// Shallow copy properties from n objects to destObj
//
utils.extend = function (destObj) {
  for (var i = 1; i < arguments.length; i++) {
    for (var key in arguments[i]) {
      destObj[key] = arguments[i][key];
    }
  }
  return destObj;
};

//
// Add a given character to a string at a defined pos
//
utils.addChars = function (str, chars, pos) {
  return str.substr(0, pos) + chars + str.substr(pos, str.length);
};

//
// Remove a span of characters
//
utils.removeChars = function (str, start, end) {
  return str.substr(0, start) + str.substr(end, str.length);
};

//
// Return true/false is num false between bounds
//
utils.isBetween = function (num, bounds) {
  bounds.sort(function(a,b) { return a-b; });
  return (num > bounds[0] && num < bounds[1]);
};

//
// Helper method for cross browser event listeners
//
utils.addListener = function (el, evt, handler) {
  return (typeof el.addEventListener != "undefined")
    ? el.addEventListener(evt, handler, false)
    : el.attachEvent('on' + evt, handler);
};

//
// Helper method for cross browser implementation of preventDefault
//
utils.preventDefault = function (evt) {
  return (evt.preventDefault) ? evt.preventDefault() : (evt.returnValue = false);
};

//
// Helper method for cross browser implementation for grabbing
// clipboard data
//
utils.getClip = function (evt) {
  if (evt.clipboardData) { return evt.clipboardData.getData('Text'); }
  if (window.clipboardData) { return window.clipboardData.getData('Text'); }
};

//
// Returns true/false if k is a del key
//
utils.isDelKey = function (k) {
  return k === 8 || k === 46 || (iPhone && k === 127);
};

//
// Returns true/false if k is an arrow key
//
utils.isSpecialKey = function (k) {
  var codes = {
    '35': 'end',
    '36': 'home',
    '37': 'leftarrow',
    '38': 'uparrow',
    '39': 'rightarrow',
    '40': 'downarrow'
  };
  // If del or special key
  return codes[k];
};

//
// Returns true/false if modifier key is held down
//
utils.isModifier = function (evt) {
  return evt.ctrlKey || evt.altKey || evt.metaKey;
};
// A really lightweight plugin wrapper around the constructor, 
// preventing against multiple instantiations
var pluginName = 'formatter';
$.fn[pluginName] = function (options) {
  return this.each(function () {
    if (!$.data(this, 'plugin_' + pluginName)) {
      $.data(this, 'plugin_' + pluginName, 
      new Formatter(this, options));
    }
  });
};

})( jQuery, window, document);