/*
 * test/formatter.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

// 3rd party
var should = require('chai').should(),
    assert = require('chai').assert;

// first party
var Formatter = require('../src/formatter').Formatter;


/////////////////////////////////////////////////////
// Unit Tests
/////////////////////////////////////////////////////

//
// ._extend
//
var testExtend = function () {
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
  var result = Formatter.prototype._extend({}, defaults, opts);
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
};

//
// ._findMatches
//
var testFindMatches = function () {
  // Run _findMatches
  var testStr = '({{XXX}}) {{XXX}}.{{XXXX}}',
      result = Formatter.prototype._findMatches(testStr);
  // Check results
  assert.deepEqual([
    { 
      '0': '{{XXX}}',
      '1': 'XXX',
      'index': 1,
      'input': '({{XXX}}) {{XXX}}.{{XXXX}}'
    },
    { 
      '0': '{{XXX}}',
      '1': 'XXX',
      'index': 10,
      'input': '({{XXX}}) {{XXX}}.{{XXXX}}'
    },
    { 
      '0': '{{XXXX}}',
      '1': 'XXXX',
      'index': 18,
      'input': '({{XXX}}) {{XXX}}.{{XXXX}}'
    }
  ], result);
};

//
// ._findChars
//
var testFindChars = function () {
  // Run _findMatches
  var testStr = '({{XXX}}) {{XXX}}.{{XXXX}}',
    result = Formatter.prototype._findChars(testStr);

  // Check results
  assert.deepEqual(result, {
    '0': '(',
    '4': ')',
    '5': ' ',
    '9': '.'
  });
};

//
// ._addChars
//
var testAddChars = function () {
  // Cache character pattern
  var chars = {
    '0': '(',
    '4': ')',
    '5': ' ',
    '9': '.'
  };

  // full raw number
  var fullResult = Formatter.prototype._addChars('8002364717', chars, false);
  assert.equal(fullResult, '(800) 236.4717');

  // partial formatted number
  var partialResult = Formatter.prototype._addChars('(800)236.4717', chars, false);
  assert.equal(fullResult, '(800) 236.4717');
};


/////////////////////////////////////////////////////
// Selenium Tests
/////////////////////////////////////////////////////

// Comming soon


/////////////////////////////////////////////////////
// Test Suite
/////////////////////////////////////////////////////

describe('# formatter.js', function () {
  // Unit
  describe('# unit tests', function () {
    describe('# class utils', function () {
      it('Should return an object with merged properties', testExtend);
    });
    describe('# class methods', function () {
      it('Should create an array holding match objs', testFindMatches);
      it('Should create an object holding all chars', testFindChars);
      it('Should add chars to str in correct positions', testAddChars);
    });
  });

  // Selenium
  // describe('selenium tests', seleniumTests);
});