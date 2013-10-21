module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', 'test/**/**/*.js'],
      options: {
        force: true,
        // Bad line breaking before '?'.
        '-W014': true,
        // Expected a conditional expression and instead saw an assignment.
        '-W084': true,
        ignores: ['src/intro.js', 'src/outro.js']
      }
    },
    concat: {
      options: {
        banner: '/*!\n' +
          ' * v<%= pkg.version %>\n' +
          ' * Copyright (c) 2013 First Opinion\n' +
          ' * formatter.js is open sourced under the MIT license.\n' +
          ' *\n' +
          ' * thanks to digitalBush/jquery.maskedinput for some of the trickier\n' +
          ' * keycode handling\n' +
          ' */ \n\n' +
          ' (function () {\n\n',
        footer: '\n\n})();',
        process: function(src, filepath) {
          // Remove contents between Exclude Start and Exclude End
          src = src.replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, '');
          // Rewrite module.exports to local var
          sr = src.replace(/module.exports =/g, 'var');
          // Return final
          return src;
        },
        stripBanners: true
      },
      vanilla: {
        src: [
          'src/formatter.js',
          'src/pattern.js',
          'src/inpt-sel.js',
          'src/utils.js'
        ],
        dest: 'lib/formatter.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      vanilla: {
        src: 'lib/formatter.js',
        dest: 'lib/formatter.min.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Tasks    
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};