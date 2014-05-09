/*!
 * test/formatter.js
 * 
 * Copyright (c) 2014 First Opinion
 */


define([
  'jquery',
  'proclaim',
  'sinon',
  'fakey',
  'formatter',
  'inpt-sel',
  'pattern-matcher',
  'pattern',
  'utils'
], function ($, assert, sinon, fakey, Formatter, inptSel, utils) {


//
// formatter.js tests
//
describe('formatter.js', function () {

  // Global vars
  var $workboard = $('#workboard');

  // Test vars
  var formatted, $el, el;

  // Define new inptType
  Formatter.addInptType('D', /[A-Za-z0-9.]/);

  // Add fresh element
  beforeEach(function () {
    var html = $('#tmpl-input-text').html();
    $el = $(html);
    el = $el[0];

    $('#workboard').append($el);
  });

  // Remove element
  afterEach(function () {
    $el.remove();
  });

  //
  // Formatter global tests
  //
  describe('global', function () {

    // Create new instance
    var createInstance = function (str) {
      formatted = new Formatter($el[0], {
        pattern: str,
        persistent: true
      });
    };

    it('Should set init values and merge defaults', function () {
      createInstance('({{999}}) {{999}}-{{9999}}');

      // Check opts
      assert.equal(formatted.opts.patterns[0]['*'], '({{999}}) {{999}}-{{9999}}');
      assert.isTrue(formatted.opts.persistent);
      // Check pattern
      assert.isObject(formatted.chars);
      assert.isObject(formatted.inpts);
      assert.isNumber(formatted.mLength);
      // Check init values
      assert.isObject(formatted.hldrs);
      assert.isNumber(formatted.focus);
    });

    it('Should natively handle home, end, and arrow keys', function (done) {
      createInstance('({{999}}) {{999}}-{{9999}}');

      sinon.spy(Formatter.prototype, '_processKey');

      fakey.seq(el, [
        { key: 'leftarrow' },
        { key: 'rightarrow' },
        { key: 'uparrow' },
        { key: 'downarrow' },
        { key: 'home' },
        { key: 'end' },
        { key: 'enter' },
        { key: 'tab' }
      ], function () {
        assert.ok(Formatter.prototype._processKey.notCalled);
        Formatter.prototype._processKey.restore();
        done();
      });      
    });

    it('Should be capable of containg a period in the pattern', function (done) {
      createInstance('http://www.{{DDDDDDDD}}');

      fakey.seq(el, [
        { str: 'abcd' },
        { key: '.' },
        { str: 'com'}
      ], function () {
        assert.equal(formatted.el.value, 'http://www.abcd.com');
        done();
      });      
    });

    it('Should update value when resetPattern method is called', function (done) {
      createInstance('({{999}}) {{999}}-{{9999}}');

      fakey.str(el, '24567890', function () {
        formatted.resetPattern('{{999}}.{{999}}.{{9999}}');
        assert.equal(formatted.el.value, '245.678.90  ');
        done();
      });
    });

    it('Should focus to the next available inpt position', function (done) {
      createInstance('({{999}}) {{999}}-{{9999}}');

      fakey.str(el, '1237890', function () {
        assert.equal(formatted.focus, 11);
        done();
      });
    });

    it('Should not focus on a formatted char', function (done) {
      createInstance('({{999}}) {{999}}-{{9999}}');

      fakey.str(el, '123', function () {
        assert.equal(formatted.focus, 6);
        done();
      });
    });

    it('Should enforce pattern maxLength', function (done) {
      createInstance('({{999}}) {{999}}-{{9999}}');
      
      fakey.str(el, '12345678901', function () {
        assert.equal(formatted.el.value, '(123) 456-7890');
        done();
      });
    });

    it('Should add regex inpts', function (done) {
      Formatter.addInptType('L', /[A-Z]/);
      createInstance('{{LLL}}');

      fakey.str(el, 'AaAaA', function () {
        assert.equal(formatted.el.value, 'AAA');
        done();
      });
    });

  });

  //
  // Formatter with value dependent patterns
  //
  describe('value dependent patterns', function () {

    it('Should apply the default format', function (done) {
      formatted = new Formatter(el, {
        patterns: [
          { '*': '!{{9}}' }
        ]
      });

      fakey.key(el, '1', function () {
        assert.equal(formatted.el.value, '!1');
        done();
      });
    });

    it('Should apply appropriate format based on current value', function (done) {
      formatted = new Formatter(el, {
        patterns: [
          { '^0': '!{{9999}}' },
          {  '*': '{{9999}}' }
        ]
      });

      fakey.str(el, '0123', function () {
        assert.equal(formatted.el.value, '!0123');
        done();
      });
    });

    it('Should apply the first appropriate format that matches the current value', function (done) {
      formatted = new Formatter(el, {
        patterns: [
          {  '^0': 'first:{{9999}}' },
          { '^00': 'second:{{9999}}' }
        ]
      });

      fakey.str(el, '00', function () {
        assert.equal(formatted.el.value, 'first:00');
        done();
      });
    });
  });

  //
  // Formatter with persistence
  //
  describe('persistent: true', function () {

    beforeEach(function () {
      formatted = new Formatter(el, {
        pattern: '({{999}}) {{999}}-{{9999}}',
        persistent: true
      });
    });

    it('Should format chars as they are entered', function (done) {
      fakey.str(el, '1237890', function () {
        assert.equal(formatted.el.value, '(123) 789-0   ');
        done();
      });
    });

    it('Should fromat chars entered mid str', function (done) {
      fakey.str(el, '1237890', function () {
        inptSel.set(el, 6);
        fakey.str(el, '456', function () {
          assert.equal(formatted.el.value, '(123) 456-7890');
          done();
        });
      });
    });

    it('Should delete chars when highlighted', function (done) {
      fakey.str(el, '1234567890', function () {
        inptSel.set(el, { begin: 2, end: 8 });
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(167) 890-    ');
          done();
        });
      });
    });

    // it('Should handle pasting multiple characters', function (done) {
    //   user.keySeq('167890', function () {
    //     sel = { begin: 2, end: 2 };
    //     user.paste('2345', function () {
    //       assert.equal(formatted.el.value, '(123) 456-7890');
    //       done();
    //     });
    //   });
    // });

    it('Should remove previous character on backspace key', function (done) {
      fakey.str(el, '1234567890', function () {
        inptSel.set(el, 2);
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(234) 567-890 ');
          done();
        });
      });
    });

    it('Should remove characters in correct order when backspacing over a formatted character.', function (done) {
      fakey.str(el, '1234567890', function () {
        fakey.key(el, 'backspace', 6, function () {
          assert.equal(formatted.el.value, '(123) 45 -    ');
          done();
        });
      });
    });

    it('Should remove next character on delete key', function (done) {
      fakey.str(el, '234567890', function () {
        inptSel.set(el, 2);
        fakey.key(el, 'delete', function () {
          assert.equal(formatted.el.value, '(245) 678-90  ');
          done();
        });
      });
    });

  });

  //
  // Formatter without persistence
  //
  describe('persistent: false', function () {

    beforeEach(function () {
      formatted = new Formatter(el, {
        pattern: '({{999}}) {{999}}-{{9999}}'
      });
    });

    it('Should format chars as they are entered', function (done) {
      fakey.str(el, '1237890', function () {
        assert.equal(formatted.el.value, '(123) 789-0');
        done();
      });
    });

    it('Should fromat chars entered mid str', function (done) {
      fakey.str(el, '1237890', function () {
        inptSel.set(el, 6);
        fakey.str(el, '456', function () {
          assert.equal(formatted.el.value, '(123) 456-7890');
          done();
        });
      });
    });

    it('Should delete chars when highlighted', function (done) {
      fakey.str(el, '1234567890', function () {
        inptSel.set(el, { begin: 2, end: 8 });
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(167) 890');
          done();
        });
      });
    });

    // it('Should handle pasting multiple characters', function (done) {
    //   fakey.str(el, '167890', function () {
    //     inptSel.set(el, 2);
    //     user.paste('2345', function () {
    //       assert.equal(formatted.el.value, '(123) 456-7890');
    //       done();
    //     });
    //   });
    // });

    it('Should remove previous character on backspace key', function (done) {
      fakey.str(el, '1234567890', function () {
        inptSel.set(el, 2);
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(234) 567-890');
          done();
        });
      });
    });

    it('Should remove a format character when it is the last character on backspace key', function (done) {
      fakey.str(el, '123', function () {
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(123');
          done();
        });
      });
    });

    it('Should completely empty field', function (done) {
      fakey.key(el, '1', function () {
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '');
          done();
        });
      });
    });

    it('Should not add chars past focus location if deleting', function (done) {
      fakey.str(el, '1234567', function () {
        fakey.key(el, 'backspace', function () {
          assert.equal(formatted.el.value, '(123) 456');
          done();
        });
      });
    });

    it('Should remove next character on delete key', function (done) {
      fakey.str(el, '234567890', function () {
        inptSel.set(el, 2);
        fakey.key(el, 'delete', function () {
          assert.equal(formatted.el.value, '(245) 678-90');
          done();
        });
      });
    });

    it('Should update value when resetPattern method is called', function (done) {
      fakey.str(el, '24567890', function () {
        formatted.resetPattern('{{999}}.{{999}}.{{9999}}');
        assert.equal(formatted.el.value, '245.678.90');
        done();
      });
    });

    it('Should update value when resetPattern method is called without changing pattern', function (done) {
      fakey.str(el, '2456789013', function () {
        formatted.resetPattern();
        assert.equal(formatted.el.value, '(245) 678-9013');
        done();
      });
    });

    it('Should not reset caret position on format', function (done) {
      fakey.str(el, '24567890', function () {
        formatted.resetPattern();
        assert.equal(formatted.el.value, '(245) 678-90');
        assert.deepEqual({ begin: 12, end: 12 }, inptSel.get(el));
        done();
      });
    });

  });

});


});