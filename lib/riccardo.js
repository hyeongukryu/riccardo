var path = require('path');
var callsite = require('callsite');
var capitalizer = require('./capitalizer')();
var glob = require('glob');

module.exports = function Riccardo(log) {

  var logFunc = log || function () {};
  log = function (category, content) {
    logFunc(category + ' ' + content);
  };

  var annotate = require('./annotate');
  var store = {};
  var factories = {};
  var parents = {};

  function addDependency(parent, child) {
    log('addDependency', parent + ' ' + child);
    if (parents[child] === undefined) {
      parents[child] = [];
    }
    parents[child][parent] = true;
    if (parents[parent] !== undefined) {
      for (var grandparent in parents[parent]) {
        addDependency(grandparent, child);
      }
    }
  }

  function invalidate(child) {
    log('invalidate', child);
    if (parents[child] === undefined) {
      return;
    }
    var list = parents[child];
    parents[child] = [];
    for (var parent in list) {
      if (factories[parent] === undefined) {
        throw new Error(parent + '의 팩토리가 필요합니다. 직접적으로 요청한 모듈은 ' + child + '입니다.');
      }
      store[parent] = undefined;
      invalidate(parent);
    }
  }

  var riccardo = this;

  function setReverse(key, value) {
    if (value) {
      value.$riccardo = key;
    }
  }

  function set(key, value) {
    log('set', key);
    invalidate(key);
    setReverse(key, value);
    store[key] = value;
    return riccardo;
  }

  function get(key) {
    if (store[key] !== undefined) {
      log('cached', key);
      return store[key];
    }
    if (factories[key] !== undefined) {
      var value = factories[key];
      if (value === false) {
        throw new Error(key + '에 연관된 순환 의존성이 있습니다.');
      }
      factories[key] = false;
      var names = annotate(value);
      names.forEach(function (name) {
        addDependency(key, name);
      });
      var injected = injectComplete(value, names, key);
      factories[key] = value;
      var obj = injected();
      setReverse(key, obj);
      store[key] = obj;
      log('construct', key);
      return obj;
    }
    return undefined;
  }

  function factory(key, value) {
    log('factory', key);
    if (factories[key] === undefined) {
      factories[key] = value;
    }
    return riccardo;
  }

  function injectComplete(func, names, factoryName) {
    names = names || annotate(func);
    var args = [];

    for (var i = 0; i < names.length; i++) {
      var value = get(names[i]);
      if (value !== undefined) {
        args.push(value);
      } else {
        throw new Error(names[i] + ' 때문에 ' + factoryName + '의 의존성을 충족시킬 수 없습니다.');
      }
    }

    return function () {
      return func.apply({}, args);
    };
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
      return func.apply({}, args);
    };
  }

  function lazy(func) {
    var names = annotate(func);
    return function () {
      return inject(func, names).apply({}, arguments);
    };
  }

  function scan(dir, namespace, listRequested) {
    log('scan', dir + ' ' + namespace);
    if (namespace === undefined) {
      namespace = dir;
    }
    if (namespace !== '') {
      namespace = capitalizer.toPascalCase(namespace);
    }

    var caller = callsite()[1].getFileName();
    var parent = path.dirname(caller);
    dir = path.join(parent, dir);

    var list = [];

    var files = glob.sync(dir + '/**/*.js');
    files.forEach(function (file) {
      var key = path
        .relative(dir, file)
        .split('index.js').join('')
        .split('.js').join('')
        .split(path.sep)
        .reverse()
        .map(function (component) {
          if (component === '') {
            return '';
          }
          return capitalizer.toPascalCase(component);
        })
        .join('');
      if (key !== '') {
        key = capitalizer.toCamelCase(key) + namespace;
      } else {
        key = capitalizer.toCamelCase(namespace);
      }
      factory(key, require(file));
      list.push(key);
    });

    if (listRequested) {
      return list;
    }
    return riccardo;
  }

  function reverse(value) {
    return value.$riccardo;
  }

  this.get = get;
  this.set = set;
  this.factory = factory;
  this.inject = inject;
  this.scan = scan;
  this.reverse = reverse;
  this.$ = this.lazy = lazy;
};
