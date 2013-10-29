/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

// 3rd party
var restore = require('sinon').restore,
    mock    = require('sinon').mock,
    stub    = require('sinon').stub;

var should  = require('chai').should(),
    assert  = require('chai').assert;

// first party
var Formatter = require('../src/formatter'),
    inptSel   = require('../src/inpt-sel'),
    utils     = require('../src/utils'),
    User      = require('./fake-user/user');


//
// pattern.js tests
//
describe('formatter.js', function () {

  // Scope vars
  var formatted, user, sel, el;

  before(function () {
    // Fake user to carry out keyboard and mouse events
    user = new User();
    // Set init el
    el = { value: '', blur: function () {} };
    // Set init caret position
    sel = { begin: 0, end: 0 };
    // Stub
    stub(utils, 'addListener', function (evt, type, handler) {
      user.on(type, handler);
    });
    stub(inptSel, 'get', function () {
      return sel;
    });
    stub(inptSel, 'set', function (el, pos) {
      sel.begin = sel.end = pos;
    });
    // New instance
    formatted = new Formatter(el, {
      pattern: '({{999}}) {{999}}-{{9999}}',
      persistent: true
    });
  });

  after(function () {
    utils.addListener.restore();
    inptSel.get.restore();
    inptSel.set.restore();
  });

  it('Should set init values and merge defaults', function () {
    // Check opts
    assert.equal(formatted.opts.pattern, '({{999}}) {{999}}-{{9999}}');
    assert.isTrue(formatted.opts.persistent);
    // Check pattern
    assert.isObject(formatted.chars);
    assert.isObject(formatted.inpts);
    assert.isNumber(formatted.mLength);
    // Check init values
    assert.isObject(formatted.hldrs);
    assert.isNumber(formatted.focus);
  });

  it('Should format chars as they are entered', function (done) {
    user.keySeq('1237890', function () {
      assert.equal(formatted.el.value, '(123) 789-0   ');
      done();
    });
  });

  it('Should focus to the next available inpt position', function () {
    assert.equal(formatted.focus, 11);
  });

  it('Should natively handle home, end, and arrow keys', function () {
    user.key('leftarrow');
    user.key('rightarrow');
    user.key('uparrow');
    user.key('downarrow');
    user.key('home');
    user.key('end');
    assert.equal(formatted.focus, 11);
  });

  it('Should fromat chars entered mid str', function (done) {
    sel = { begin: 6, end: 6 };
    user.keySeq('456', function () {
      assert.equal(formatted.el.value, '(123) 456-7890');
      done();
    });
  });

  it('Should delete chars when highlighted', function () {
    sel = { begin: 2, end: 8 };
    user.key('backspace');
    assert.equal(formatted.el.value, '(167) 890-    ');
  });

  it('Should handle pasting multiple characters', function (done) {
    sel = { begin: 2, end: 2 };
    user.paste('2345', function () {
      assert.equal(formatted.el.value, '(123) 456-7890');
      done();
    });
  });

  it('Should remove previous character on backspace key', function () {
    sel = { begin: 2, end: 2 };
    user.key('backspace');
    assert.equal(formatted.el.value, '(234) 567-890 ');
  });

  it('Should remove next character on delete key', function () {
    sel = { begin: 2, end: 2 };
    user.key('delete');
    assert.equal(formatted.el.value, '(245) 678-90  ');
  });

});