/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

// 3rd party
var should = require('chai').should(),
    assert = require('chai').assert;

// first party
var utils = require('../src/utils');


//
// utils.js tests
//
describe('utils.js', function () {

  // utils.extend
  // Shallow copy properties from n objects to destObj
  describe('extend', function () {
    it('Should return an obj with merged props', function () {
      // Setup Data
      var defaults, opts;
      defaults = {
        'extend'   : 'should',
        'overwrite': 'all'
      };
      opts = {
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      };

      // Run extend
      var result = utils.extend({}, defaults, opts);
      // Check results
      assert.deepEqual(result, {
        'extend'   : 'should',
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      });
      // Make sure defaults & opts were not changed
      assert.deepEqual({
        'extend'   : 'should',
        'overwrite': 'all'
      }, defaults);
      assert.deepEqual({
        'overwrite': 'default',
        'values'   : 'to',
        'the'      : 'destObj'
      }, opts);
    });
  });

  // utils.addChars
  // Add a given character to a string at a defined pos
  describe('addChars', function () {
    it('Should add chars to str starting at pos', function () {
      var result = utils.addChars('add the str', 'inbetween ', 4);
      assert.equal(result, 'add inbetween the str');
    });
  });

  // utils.removeChars
  // Remove a span of characters
  describe('removeChars', function () {
    it('Should remove span of chars', function () {
    var result = utils.removeChars('remove uneccesary chars', 6, 17);
      assert.equal(result, 'remove chars');
    });
  });

  // utils.isBetween
  // Return true/false is num false between bounds
  describe('removeChars', function () {
    it('Should return true when between range', function () {
      var result = utils.isBetween(2, [1, 3]);
      assert.isTrue(result);
    });
    it('Should return true regardless of order', function () {
      var result = utils.isBetween(2, [3, 1]);
      assert.isTrue(result);
    });
    it('Should return false when not between range', function () {
      var result = utils.isBetween(4, [1, 3]);
      assert.isFalse(result);
    });
  });

});