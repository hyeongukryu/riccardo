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
describe('injector', function () {
  var Riccardo = require('../');
  var riccardo = new Riccardo();
  it('null이 아니어야 합니다', function () {
    assert(riccardo);
  });
  it('riccardo.$와 riccardo.lazy는 같아야 합니다.', function () {
    assert(riccardo.$ === riccardo.lazy);
  });
  it('riccardo.get과 riccardo.set이 있어야 합니다.', function () {
    assert(riccardo.get);
    assert(riccardo.set);
  });

  describe('riccardo.get과 riccardo.set', function () {
    it('get에 성공해야 합니다.', function () {
      riccardo.get();
    });
    it('없는 key를 get하면 undefined를 반환합니다.', function () {
      assert(riccardo.get('riccardo') === undefined);
    });
    it('set에 성공하고, 지정된 값이 반환되고, 첫 번째 값이 유지되어야 합니다.', function () {
      assert.strictEqual(riccardo.set('one', one), one);
      assert.strictEqual(riccardo.set('two', two), two);
      riccardo.set('one', two);
      riccardo.set('two', one);
    });
    it('set한 값을 get할 수 있어야 합니다.', function () {
      assert(riccardo.get('one') === one);
      assert(riccardo.get('two') === two);
    });
  });

  describe('riccardo.inject', function () {
    it('one과 two가 주입되어야 합니다.', function () {
      var a = one, b = two;
      var func = function (one, two) {
        assert(one === a);
        assert(two === b);
      };
      func = riccardo.$(func);
      func();
    });
    it('실행 시간 추가 주입이 이루어져야 합니다.', function () {
      var a = one, b = two;
      var func = function (req, one, res, two, next) {
        assert(one === a);
        assert(two === b);
        assert(req === 'req');
        assert(res === 'res');
        assert(next === 'next');
        return 'returnValue';
      };
      func = riccardo.inject(func);
      assert.equal(func('req', 'res', 'next'), 'returnValue');
    });
    it('실행 시간 추가 주입이 실패해야 합니다.', function () {
      var a = one, b = two;
      var func = function (req, one, res, two, next) {
        assert(one === a);
        assert(two === b);
        assert(req === 'req');
        assert(res === 'res');
        assert(next === 'next');
      };
      func = riccardo.inject(func);
      assert.throws(function () {
        func()
      });
    });
    it('실행 시간 전체 주입에 실패해야 합니다.', function () {
      riccardo.set('one', undefined);
      riccardo.set('two', undefined);
      riccardo.set('three', undefined);
      riccardo.set('one', one);
      riccardo.set('two', two);
      var a = one, b = two;
      var c = 'three';
      var func = function (one, two, three) {
        assert(one === a);
        assert(two === b);
        assert(three === c);
      };
      func = riccardo.inject(func);
      riccardo.set('three', c);
      assert.throws(function () {
        func();
      });
    });
  });
  describe('riccardo.inject, 제너레이터 함수', function () {
    it('one과 two가 주입되어야 합니다.', function () {
      var a = one, b = two;
      var func = function* (one, two) {
        yield 'yield0';
        assert(one === a);
        assert(two === b);
        yield 'yield1';
        return 'return';
      };
      func = riccardo.$(func);
      var g = func();
      assert.strictEqual(g.next().value, 'yield0');
      assert.strictEqual(g.next().value, 'yield1');
      assert.strictEqual(g.next().value, 'return');
    });
    it('실행 시간 추가 주입이 이루어져야 합니다.', function () {
      var a = one, b = two;
      var func = function* (req, one, res, two, next) {
        yield 'yield0';
        assert(one === a);
        assert(two === b);
        assert(req === 'req');
        assert(res === 'res');
        assert(next === 'next');
        return 'returnValue';
      };
      func = riccardo.inject(func);
      var g = func('req', 'res', 'next');
      assert.strictEqual(g.next().value, 'yield0');
      assert.strictEqual(g.next().value, 'returnValue');
    });
  });
  describe('riccardo.lazy', function () {
    it('실행 시간 전체 주입에 성공해야 합니다.', function () {
      riccardo.set('one', undefined);
      riccardo.set('two', undefined);
      riccardo.set('three', undefined);
      riccardo.set('one', one);
      riccardo.set('two', two);
      var a = one, b = two;
      var c = 'three';
      var func = function (one, two, three) {
        assert(one === a);
        assert(two === b);
        assert(three === c);
      };
      func = riccardo.lazy(func);
      riccardo.set('three', c);
      func();
    });
  });
});
