Riccardo [![Build Status](http://img.shields.io/travis/mintrupt/riccardo/master.svg?style=flat-square)](https://travis-ci.org/mintrupt/riccardo)
========

Dependency Injection Container for Node.js / io.js

설치하기
--------

```shell
npm install riccardo --save
```

사용하기
--------

```js
const Riccardo = require('riccardo');
var riccardo = new Riccardo();

// singleton
riccardo
  .set('myStr', 'value')
  .set('myFunc', function () {});

riccardo.get('myStr');
riccardo.get('myFunc');

var injected = riccardo.inject(function (myStr, a, myFunc, b) {});
injected('a', 'b');

var lazyInjected = riccardo.lazy(function (myStr, myFunc, a, myStr2, b, c) {});
riccardo.set('myStr2', 'value2');
lazyInjected('a', 'b', 'c');

var lazyInjected2 = riccardo.$(function (myNewStr) {});
// singleton
riccardo.factory('myNewStr', function (myStr, myStr2) {
  return myStr + myStr2;
});
lazyInjected2();

riccardo.scan('directory', 'optionalNamespace');
```
