// A really lightweight plugin wrapper around the constructor, 
// preventing against multiple instantiations
var pluginName = 'formatter';

$.fn[pluginName] = function (options) {

	// Initiate plugin if options passed
	if (typeof options == 'object') {
	  this.each(function () {
	    if (!$.data(this, 'plugin_' + pluginName)) {
	      $.data(this, 'plugin_' + pluginName, 
	      new Formatter(this, options));
	    }
	  });
	}

  // Add resetPattern method to plugin
  this.resetPattern = function (str) {
    this.each(function () {
      var formatted = $.data(this, 'plugin_' + pluginName);
      // resetPattern for instance
      if (formatted) { formatted.resetPattern(str); }
    });
    // Chainable please
    return this
  };

  // Chainable please
  return this;
};

$.fn[pluginName].addInptType = function (char, regexp) {
  Formatter.addInptType(char, regexp);
};


})( jQuery, window, document);