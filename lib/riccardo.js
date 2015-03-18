module.exports = function Riccardo() {

  var annotate = require('./annotate');
  var store = {};
  var factories = {};

  function set(key, value) {
    return store[key] = value;
  }

  function get(key) {
    if (store[key] !== undefined) {
      return store[key];
    }
    if (factories[key] !== undefined) {
      var factory = factories[key];
      if (factory === false) {
        throw new Error(key + '에 연관된 순환 의존성이 있습니다.');
      }
      factories[key] = false;
      factory = inject(factory);
      factories[key] = undefined;
      var obj = factory();
      return set(key, obj);
    }
    return undefined;
  }

  function factory(key, value) {
    factories[key] = value;
  }

  function inject(func, names) {
    names = names || annotate(func);
    var lazyArgs = [], args = [];

    for (var i = 0; i < names.length; i++) {
      var value = get(names[i]);
      if (value !== undefined) {
        args.push(value);
      } else {
        lazyArgs.push(i);
        args.push(undefined);
      }
    }

    var addArg = function (value) {
      if (lazyArgs.length) {
        args[lazyArgs[0]] = value;
        lazyArgs.shift();
      } else {
        args.push(value);
      }
    };

    return function () {
      var argsRun = Array.prototype.slice.call(arguments);
      argsRun.forEach(function (arg) {
        addArg(arg);
      });
      return func.apply(this, args);
    };
  }

  function lazy(func) {
    var names = annotate(func);
    return function () {
      return inject(func, names).apply(this, arguments);
    };
  }

  this.get = get;
  this.set = set;
  this.factory = factory;
  this.inject = inject;
  this.$ = this.lazy = lazy;
};
