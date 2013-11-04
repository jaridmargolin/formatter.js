module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        'test/**/**/*.js'
      ],
      options: {
        ignores: [
          'src/tmpls/intro.js',
          'src/tmpls/outro.js',
          'src/tmpls/jquery.intro.js',
          'src/tmpls/jquery.outro.js'
        ],
        force: true,
        // Bad line breaking before '?'.
        '-W014': true,
        // Expected a conditional expression and instead saw an assignment.
        '-W084': true
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
          ' */ \n\n',
        process: function(src, filepath) {
          // Remove contents between Exclude Start and Exclude End
          src = src.replace( /\/\*\s*ExcludeStart\s*\*\/[\w\W]*?\/\*\s*ExcludeEnd\s*\*\//ig, '');
          // Rewrite module.exports to local var
          src = src.replace(/module.exports\s=/g, 'var');
          // Return final
          return src;
        },
        stripBanners: true
      },
      vanilla: {
        src: [
          'src/tmpls/intro.js',
          'src/formatter.js',
          'src/pattern.js',
          'src/inpt-sel.js',
          'src/utils.js',
          'src/tmpls/outro.js'
        ],
        dest: 'lib/formatter.js'
      },
      jquery: {
        src: [
          'src/tmpls/jquery.intro.js',
          'src/formatter.js',
          'src/pattern.js',
          'src/inpt-sel.js',
          'src/utils.js',
          'src/tmpls/jquery.outro.js'
        ],
        dest: 'lib/jquery.formatter.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      vanilla: {
        src: 'lib/formatter.js',
        dest: 'lib/formatter.min.js'
      },
      jquery: {
        src: 'lib/jquery.formatter.js',
        dest: 'lib/jquery.formatter.min.js'
      }
    }
  });

  // Tasks
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};