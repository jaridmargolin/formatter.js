/*!
 * test/pattern.js
 * 
 * Copyright (c) 2014 First Opinion
 */


define([
  'proclaim',
  'pattern'
], function (assert, pattern) {


//
// pattern.js tests
//
describe('pattern.js', function () {

  // pattern.parse
  // Create an object holding all formatted characters
  // with corresponding positions
  describe('parse', function () {

    it('Should return an obj with pattern info', function () {
      var result = pattern.parse('({{9A*}}) {{9A*}}-{{AAAA}}');
      assert.deepEqual(result.chars, {
        '0': '(',
        '4': ')',
        '5': ' ',
        '9': '-'
      });
      assert.deepEqual(result.inpts, {
        '0': '9',
        '1': 'A',
        '2': '*',
        '3': '9',
        '4': 'A',
        '5': '*',
        '6': 'A',
        '7': 'A',
        '8': 'A',
        '9': 'A'
      });
      assert.equal(result.mLength, 14);
    });

    describe('edge cases', function () {

      it('Should parse a pattern with a leading char', function () {
        var result = pattern.parse('_{{**}}');

        assert.deepEqual(result.chars, {
          '0': '_'
        });
        assert.deepEqual(result.inpts, {
          '0': '*',
          '1': '*'
        });
        assert.equal(result.mLength, 3);
      });

      it('Should parse a pattern with a trailing char', function () {
        var result = pattern.parse('{{**}}_');

        assert.deepEqual(result.chars, {
          '2': '_'
        });
        assert.deepEqual(result.inpts, {
          '0': '*',
          '1': '*'
        });
        assert.equal(result.mLength, 3);
      });

    });
    
  });

});


});