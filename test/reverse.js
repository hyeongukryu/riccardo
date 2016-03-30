var one = 'one';
var two = {
  a: 'a',
  b: 'b',
  c: {
    d: 'd',
    e: 'e'
  }
};

var assert = require('assert');
describe('reverse', function () {
  var Riccardo = require('../');
  var riccardo = new Riccardo();
  it('one, two 설정', function () {
    riccardo.set('one', one);
    riccardo.set('two', two);
  });
  it('object가 아니면 undefined를 반환해야 합니다.', function () {
    assert.strictEqual(riccardo.reverse(riccardo.get('one')), undefined);
  });
  it('object이면 올바른 값을 반환해야 합니다.', function () {
    assert.strictEqual(riccardo.reverse(riccardo.get('two')), 'two');
  });
});
