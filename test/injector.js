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
describe('riccardo', function () {
  var riccardo = require('../');
  it('null이 아니어야 합니다', function () {
    assert(riccardo);
  });
  it('riccardo.$와 riccardo.inject는 같아야 합니다.', function () {
    assert(riccardo.$ === riccardo.inject);
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
    it('set에 성공해야 합니다.', function () {
      riccardo.set('one', one);
      riccardo.set('two', two);
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
    it('실행 시간 주입이 이루어져야 합니다.', function () {
      var a = one, b = two;
      var func = function (req, one, res, two, next) {
        assert(one === a);
        assert(two === b);
        assert(req == 'req');
        assert(res == 'res');
        assert(next == 'next');
      };
      func = riccardo.inject(func);
      func('req', 'res', 'next');
    });
    it('실행 시간 주입이 실패해야 합니다.', function () {
      var a = one, b = two;
      var func = function (req, one, res, two, next) {
        assert(one === a);
        assert(two === b);
        assert(req == 'req');
        assert(res == 'res');
        assert(next == 'next');
      };
      func = riccardo.inject(func);
      assert.throws(function () {
        func()
      });
    });
  });
});
