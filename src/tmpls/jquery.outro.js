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