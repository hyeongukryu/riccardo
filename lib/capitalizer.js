var pattern = new RegExp(/^[A-Za-z0-9]+$/);

module.exports = function () {
  return {
    toCamelCase: function (name) {
      var match = name.match(pattern);
      if (!match || match[0] !== name) {
        throw new Error();
      }
      return name.charAt(0).toLowerCase() + name.slice(1);
    },
    toPascalCase: function (name) {
      var match = name.match(pattern);
      if (!match || match[0] !== name) {
        throw new Error();
      }
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
  };
};