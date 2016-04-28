var assert = require('assert');

var log = null;

function moduleA(moduleB, moduleC, moduleD) {
  assert.strictEqual(moduleB, 'moduleB');
  assert.strictEqual(moduleC, 'moduleC');
  assert.strictEqual(moduleD, 'moduleD');
  log.push('a');
  return 'moduleA';
}

function moduleB(moduleC, moduleE) {
  assert.strictEqual(moduleC, 'moduleC');
  assert.strictEqual(moduleE, 'moduleE');
  log.push('b');
  return 'moduleB';
}

function moduleC(moduleD) {
  assert.strictEqual(moduleD, 'moduleD');
  log.push('c');
  return 'moduleC';
}

function moduleD() {
  log.push('d');
  return 'moduleD';
}

function moduleE() {
  log.push('e');
  return 'moduleE';
}

function moduleF(moduleA) {
  assert.strictEqual(moduleA, 'moduleA');
  log.push('f');
  return 'moduleF';
}

function module1(module1) {
  assert(false);
}

function module2(module3) {
  assert(false);
}

function module3(module2) {
  assert(false);
}

function moduleP(moduleQ) {
  assert(false);
}

function moduleQ(unknownModule) {
  assert(false);
}

describe('factory', function () {

  var Riccardo = require('../');

  it('factory 함수가 있어야 합니다.', function () {
    var riccardo = new Riccardo();
    assert.strictEqual(typeof riccardo.factory, 'function');
  });

  var setup = function (riccardo) {
    log = [];
    riccardo.factory('moduleA', moduleA);
    riccardo.factory('moduleB', moduleB);
    riccardo.factory('moduleC', moduleC);
    riccardo.factory('moduleD', moduleD);
    riccardo.factory('moduleE', moduleE);
    riccardo.factory('moduleF', moduleF);
    riccardo.factory('module1', module1);
    riccardo.factory('module2', module2);
    riccardo.factory('module3', module3);
    riccardo.factory('moduleP', moduleP);
    riccardo.factory('moduleQ', moduleQ);
    assert(log !== null);
  };

  it('주어진 함수가 바로 호출되지 않아야 합니다.', function () {
    var riccardo = new Riccardo();
    setup(riccardo);
    assert.strictEqual(log.length, 0);
  });

  describe('필요할 때 주어진 함수가 호출되어야 합니다.', function () {
    it('moduleA 1회', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 5);
    });

    it('moduleA 2회', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleA');
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 5);
    });

    it('moduleB', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleB');
      assert.strictEqual(log.length, 4);
    });

    it('moduleC', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleC');
      assert.strictEqual(log.length, 2);
    });

    it('moduleD', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleD');
      assert.strictEqual(log.length, 1);
    });

    it('moduleE', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleE');
      assert.strictEqual(log.length, 1);
    });

    it('moduleF', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      riccardo.get('moduleF');
      assert.strictEqual(log.length, 6);
    });
  });

  describe('순환 의존이 있으면 예외를 던져야 합니다.', function () {
    it('module1', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      assert.throws(function () {
        riccardo.get('module1');
      });
    });
    it('module2', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      assert.throws(function () {
        riccardo.get('module2');
      });
    });
    it('module3', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      assert.throws(function () {
        riccardo.get('module3');
      });
    });
  });

  describe('의존성을 충족시킬 수 없으면 예외를 던져야 합니다.', function () {
    it('moduleP', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      assert.throws(function () {
        riccardo.get('moduleP');
      });
    });
    it('moduleQ', function () {
      var riccardo = new Riccardo();
      setup(riccardo);
      assert.throws(function () {
        riccardo.get('moduleQ');
      });
    });
  });
});