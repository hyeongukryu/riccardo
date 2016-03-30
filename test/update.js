var assert = require('assert');

var log = null;

function moduleA(moduleB, moduleC, moduleD) {
  // assert.strictEqual(moduleB, 'moduleB');
  // assert.strictEqual(moduleC, 'moduleC');
  assert.strictEqual(moduleD, 'moduleD');
  log.push('a');
  return 'moduleA';
}

function moduleB(moduleC, moduleE) {
  // assert.strictEqual(moduleC, 'moduleC');
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

describe('update', function () {

  var Riccardo = require('../');

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
    assert(log !== null);
  };

  it('주어진 함수가 바로 호출되지 않아야 합니다.', function () {
    var riccardo = new Riccardo();
    setup(riccardo);
    assert.strictEqual(log.length, 0);
  });

  describe('서브트리 갱신 시나리오', function () {
    var riccardo = new Riccardo();
    it('get moduleA', function () {
      setup(riccardo);
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 5);
    });
    it('get moduleA', function () {
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 5);
    });
    it('get moduleF', function () {
      riccardo.get('moduleF');
      assert.strictEqual(log.length, 6);
    });
    it('get moduleA', function () {
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 6);
    });
    it('set moduleC', function () {
      riccardo.set('moduleC', 'c');
      assert.strictEqual(log.length, 6);
    });
    it('get moduleA', function () {
      riccardo.get('moduleA');
      assert.strictEqual(log.length, 8);
    });
    it('set moduleC', function () {
      riccardo.set('moduleC', 'c');
      assert.strictEqual(log.length, 8);
    });
    it('get moduleF', function () {
      riccardo.get('moduleF');
      assert.strictEqual(log.length, 11);
    });
    it('set moduleC', function () {
      riccardo.set('moduleC', 'c');
      assert.strictEqual(log.length, 11);
    });
    it('get moduleF', function () {
      riccardo.get('moduleF');
      assert.strictEqual(log.length, 14);
    });
    it('set moduleB', function () {
      riccardo.set('moduleB', 'b');
      assert.strictEqual(log.length, 14);
    });
    it('get moduleD', function () {
      riccardo.get('moduleD');
      assert.strictEqual(log.length, 14);
    });
    it('get moduleF', function () {
      riccardo.get('moduleF');
      assert.strictEqual(log.length, 16);
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
});