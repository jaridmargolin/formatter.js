/*
* test/pattern-matcher.js
*
* MIT LICENCE
*
*/

// 3rd party
var should = require('chai').should(),
    assert = require('chai').assert,
    sinon = require('sinon');

// first party
var patternMatcher = require('../src/pattern-matcher'),
    pattern = require("../src/pattern");

//
// pattern-matcher.js tests
//
describe('pattern-matcher.js', function () {
  it('Should parse each matcher as a regex', function () {
    var myPatternMatcher = patternMatcher([ { '^abc$': '{{*}}-{{*}}-{{*}}' } ]);

    assert.isTrue(myPatternMatcher.matchers[0].test("abc"));
    assert.isFalse(myPatternMatcher.matchers[0].test("xyz"));
  });

  it('Should parse each pattern as a pattern', function () {
    var myPatternMatcher = patternMatcher([ { '^abc$': '{{***}}' } ]);

    assert.deepEqual(myPatternMatcher.patterns[0], pattern.parse('{{***}}'));
  });

  describe('getPattern', function  () {
    it('Should return the appropriate pattern for the input', function () {
      var patternStringA = '!{{*}}{{*}}',
      patternStringB = '@{{*}}{{*}}',
      patternA = pattern.parse(patternStringA),
      patternB = pattern.parse(patternStringB);

      var myPatternMatcher = patternMatcher([ { '^a': patternStringA },
                                            { '^b': patternStringB } ]);

      assert.deepEqual(myPatternMatcher.getPattern("a"), patternA);
      assert.deepEqual(myPatternMatcher.getPattern("abc"), patternA);
      assert.deepEqual(myPatternMatcher.getPattern("bac"), patternB);
    });

    it('Should return the first matching pattern', function () {
      var patternStringA = '!{{*}}{{*}}',
      patternStringB = '@{{*}}{{*}}',
      patternA = pattern.parse(patternStringA),
      patternB = pattern.parse(patternStringB);

      var myPatternMatcher = patternMatcher([ { '^a': patternStringA },
                                            { '.*': patternStringB } ]);

      assert.deepEqual(myPatternMatcher.getPattern("a"), patternA);
      assert.deepEqual(myPatternMatcher.getPattern("aa"), patternA);
    });

    it('Should return the wildcard pattern "*" if no other matches', function () {
      var patternStringA = '!{{*}}{{*}}',
      patternStringB = '@{{*}}{{*}}',
      patternA = pattern.parse(patternStringA),
      patternB = pattern.parse(patternStringB);

      var myPatternMatcher = patternMatcher([ { 'wont-match': patternStringA },
                                            { '*': patternStringB } ]);

      assert.deepEqual(myPatternMatcher.getPattern("a"), patternB);
    });

    it('Should return null if no pattern matches', function () {
      var patternStringA = '!{{*}}{{*}}',
      patternStringB = '@{{*}}{{*}}',
      patternA = pattern.parse(patternStringA),
      patternB = pattern.parse(patternStringB);

      var myPatternMatcher = patternMatcher([ { 'wont-match': patternStringA },
                                            { '*': patternStringB } ]);

      assert.deepEqual(myPatternMatcher.getPattern("a"), patternB);
    });
  });
});
