var assert = require('assert');
var helper = require('./helper');

describe('capitalizer', function () {
  var capitalizer = require('../lib/capitalizer')();
  var testAllThrows = function (name) {
    assert.throws(function () {
      capitalizer.toCamelCase(name);
    });
    assert.throws(function () {
      capitalizer.toPascalCase(name);
    });
  };
  it('빈 이름을 변환하면 예외를 던져야 합니다.', function () {
    testAllThrows('');
  });
  it('null을 변환하면 예외를 던져야 합니다.', function () {
    testAllThrows(null);
  });
  it('undefined를 변환하면 예외를 던져야 합니다.', function () {
    testAllThrows(undefined);
  });
  it('공백 문자가 있으면 예외를 던져야 합니다.', function () {
    testAllThrows(' ');
    testAllThrows('abc ');
    testAllThrows(' abc');
    testAllThrows('\n');
    testAllThrows('\r');
    testAllThrows('\t');
  });
  it('한글이 있으면 예외를 던져야 합니다.', function () {
    testAllThrows('한');
  });
  it('특수 문자가 있으면 예외를 던져야 합니다.', function () {
    testAllThrows('★');
  });
  describe('toCamelCase', function () {
    helper.checkFunctionExists(capitalizer, 'toCamelCase');
    it('이름 camelCase를 그대로 반환해야 합니다.', function () {
      assert.strictEqual(capitalizer.toCamelCase('camelCase'), 'camelCase');
    });
    it('camelCase로 변환해야 합니다.', function () {
      assert.strictEqual(capitalizer.toCamelCase('PascalCase'), 'pascalCase');
      assert.strictEqual(capitalizer.toCamelCase('test'), 'test');
      assert.strictEqual(capitalizer.toCamelCase('Test'), 'test');
      assert.strictEqual(capitalizer.toCamelCase('TEST'), 'tEST');
      assert.strictEqual(capitalizer.toCamelCase('t'), 't');
      assert.strictEqual(capitalizer.toCamelCase('T'), 't');
    });
  });
  describe('toPascalCase', function () {
    helper.checkFunctionExists(capitalizer, 'toPascalCase');
    it('이름 PascalCase를 그대로 반영해야 합니다.', function () {
      assert.strictEqual(capitalizer.toPascalCase('PascalCase'), 'PascalCase');
    });
    it('PascalCase로 변환해야 합니다.', function () {
      assert.strictEqual(capitalizer.toPascalCase('camelCase'), 'CamelCase');
      assert.strictEqual(capitalizer.toPascalCase('test'), 'Test');
      assert.strictEqual(capitalizer.toPascalCase('Test'), 'Test');
      assert.strictEqual(capitalizer.toPascalCase('TEST'), 'TEST');
      assert.strictEqual(capitalizer.toPascalCase('t'), 'T');
      assert.strictEqual(capitalizer.toPascalCase('T'), 'T');
    });
  });
});