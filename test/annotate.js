var assert = require('assert');
var annotate = require('../lib/annotate');

describe('annotate', function () {
  it('목록을 성공적으로 생성해야 합니다.', function () {
    assert.deepEqual(annotate(function () {}), []);
    assert.deepEqual(annotate(function (a) {}), ['a']);
    assert.deepEqual(annotate(function (a, b, c) {}), ['a', 'b', 'c']);
    
    assert.deepEqual(annotate(function named1 () {}), []);
    assert.deepEqual(annotate(function named2 (a) {}), ['a']);
    assert.deepEqual(annotate(function named3 (a, b, c) {}), ['a', 'b', 'c']);

    assert.deepEqual(annotate(function * () {}), []);
    assert.deepEqual(annotate(function * (a) {}), ['a']);
    assert.deepEqual(annotate(function * (a, b, c) {}), ['a', 'b', 'c']);

    assert.deepEqual(annotate(function * named4 () {}), []);
    assert.deepEqual(annotate(function * named5 (a) {}), ['a']);
    assert.deepEqual(annotate(function * named6 (a, b, c) {}), ['a', 'b', 'c']);

    assert.deepEqual(annotate(() => {}), []);
    assert.deepEqual(annotate((a) => {}), ['a']);
    assert.deepEqual(annotate((a, b, c) => {}), ['a', 'b', 'c']);

    assert.deepEqual(annotate(() => ({})), []);
    assert.deepEqual(annotate((a) => ({})), ['a']);
    assert.deepEqual(annotate((a, b, c) => ({})), ['a', 'b', 'c']);

    assert.deepEqual(annotate(test => {}), ['test']);
    assert.deepEqual(annotate(test => test + 42), ['test']);
    assert.deepEqual(annotate(test => ({})), ['test']);
  });
});