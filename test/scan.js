var assert = require('assert');

describe('scan', function () {

  var Riccardo = require('../');

  it('scan 함수가 있어야 합니다.', function () {
    var riccardo = new Riccardo();
    assert.strictEqual(typeof riccardo.scan, 'function');
  });


  describe('모든 파일을 고려하여야 합니다.', function () {
    it('자동 이름 공간', function () {
      var riccardo = new Riccardo();
      riccardo.set('riccardo', riccardo);
      riccardo.set('scan', 'Scan');
      riccardo.factory('target', function () {
        return 'Target';
      });
      riccardo.factory('namespace', function (scan, target) {
        return scan + target;
      });
      riccardo.scan('scanTarget');
      assert.strictEqual(riccardo.get('oneInnerScanTarget'), 1);
      assert.strictEqual(riccardo.get('twoScanTarget'), 2);
      assert.strictEqual(riccardo.get('sumScanTarget'), 15);
      assert.strictEqual(riccardo.get('fourScanTarget'), 4);
      assert.strictEqual(riccardo.get('eightScanTarget'), 8);
    });
    it('사용자 지정 이름 공간', function () {
      var riccardo = new Riccardo();
      riccardo.set('riccardo', riccardo);
      riccardo.set('namespace', 'Service');
      riccardo.scan('scanTarget', 'service');
      assert.strictEqual(riccardo.get('oneInnerService'), 1);
      assert.strictEqual(riccardo.get('twoService'), 2);
      assert.strictEqual(riccardo.get('sumService'), 15);
      assert.strictEqual(riccardo.get('fourService'), 4);
      assert.strictEqual(riccardo.get('eightService'), 8);
    });
  });
});