var assert = require('assert');

describe('scan', function () {

  var Riccardo = require('../');

  it('scan 함수가 있어야 합니다.', function () {
    var riccardo = new Riccardo();
    assert.strictEqual(typeof riccardo.scan, 'function');
  });

  describe('모든 파일을 고려하여야 합니다.', function () {
    it('자동 이름 공간, 메서드 체이닝', function () {
      var riccardo = new Riccardo();
      
      riccardo
        .set('riccardo', riccardo)
        .set('scan', 'Scan')
        .factory('target', function () {
          return 'Target';
        })
        .scan('scanTarget')
        .factory('namespace', function (scan, target) {
          return scan + target;
        });

      assert.strictEqual(riccardo.get('innerScanTarget'), 'inner');
      assert.strictEqual(riccardo.get('indexScanTarget'), 'index');
      assert.strictEqual(riccardo.get('defaultIndexScanTarget'), 'default');
      assert.strictEqual(riccardo.get('scanTarget'), 'service');
      assert.strictEqual(riccardo.get('oneInnerScanTarget'), 1);
      assert.strictEqual(riccardo.get('twoScanTarget'), 2);
      assert.strictEqual(riccardo.get('sumScanTarget'), 15);
      assert.strictEqual(riccardo.get('fourScanTarget'), 4);
      assert.strictEqual(riccardo.get('eightScanTarget'), 8);
    });
    it('사용자 지정 이름 공간, 메서드 체이닝, 리스트 요청', function () {
      var riccardo = new Riccardo();
      riccardo.set('riccardo', riccardo);
      riccardo.set('namespace', 'Service');
      
      var list = riccardo.scan('scanTarget', 'service', true);
      assert.strictEqual(list.length, 9);
      var expectedList = [
        'eightService', 'fourService', 'oneInnerService',
        'sumService', 'twoService', 'innerService', 'service', 'indexService', 'defaultIndexService'];
      list.sort();
      expectedList.sort();
      assert.deepEqual(list, expectedList);

      assert.strictEqual(riccardo.get('innerService'), 'inner');
      assert.strictEqual(riccardo.get('indexService'), 'index');
      assert.strictEqual(riccardo.get('defaultIndexService'), 'default');
      assert.strictEqual(riccardo.get('service'), 'service');
      assert.strictEqual(riccardo.get('oneInnerService'), 1);
      assert.strictEqual(riccardo.get('twoService'), 2);
      assert.strictEqual(riccardo.get('sumService'), 15);
      assert.strictEqual(riccardo.get('fourService'), 4);
      assert.strictEqual(riccardo.get('eightService'), 8);
    });
  });
});