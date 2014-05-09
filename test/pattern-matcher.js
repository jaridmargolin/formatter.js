/*!
 * test/pattern-matcher.js
 * 
 * Copyright (c) 2014 First Opinion
 */


define([
  'proclaim',
  'pattern-matcher',
  'pattern'
], function (assert, patternMatcher, pattern) {


//
// pattern-matcher.js tests
//
describe('pattern-matcher.js', function () {

  // Pattern Strings
  var patternStringA = '!{{*}}{{*}}',
      patternStringB = '@{{*}}{{*}}';

  // Parsed Patterns
  var patternA = pattern.parse(patternStringA),
      patternB = pattern.parse(patternStringB);

  it('Should parse each matcher as a regex', function () {
    var myPatternMatcher = patternMatcher([
      { '^abc$': '{{*}}-{{*}}-{{*}}' }
    ]);

    assert.isTrue(myPatternMatcher.matchers[0].test('abc'));
    assert.isFalse(myPatternMatcher.matchers[0].test('xyz'));
  });

  it('Should parse each pattern as a pattern', function () {
    var myPatternMatcher = patternMatcher([
      { '^abc$': '{{***}}' }
    ]);

    assert.deepEqual(myPatternMatcher.patterns[0], pattern.parse('{{***}}'));
  });

  describe('getPattern', function  () {

    it('Should return the appropriate pattern for the input', function () {
      var myPatternMatcher = patternMatcher([
        { '^a': patternStringA },
        { '^b': patternStringB }
      ]);

      assert.deepEqual(myPatternMatcher.getPattern('a'), patternA);
      assert.deepEqual(myPatternMatcher.getPattern('abc'), patternA);
      assert.deepEqual(myPatternMatcher.getPattern('bac'), patternB);
    });

    it('Should return the first matching pattern', function () {
      var myPatternMatcher = patternMatcher([
        { '^a': patternStringA },
        { '.*': patternStringB }
      ]);

      assert.deepEqual(myPatternMatcher.getPattern('a'), patternA);
      assert.deepEqual(myPatternMatcher.getPattern('aa'), patternA);
    });

    it('Should return the wildcard pattern "*" if no other matches', function () {
      var myPatternMatcher = patternMatcher([
        { 'wont-match': patternStringA },
        { '*': patternStringB }
      ]);

      assert.deepEqual(myPatternMatcher.getPattern('a'), patternB);
    });

    it('Should return null if no pattern matches', function () {
      var myPatternMatcher = patternMatcher([
        { 'wont-match': patternStringA },
        { '*': patternStringB }
      ]);

      assert.deepEqual(myPatternMatcher.getPattern('a'), patternB);
    });

  });

});


});