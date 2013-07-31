Module = (function () {
  function Module () {}

  var moduleKeywords = [
    'include',
    'extend',
    'included',
    'extended',
    'constructor'];

  Module.extend = function (obj) {
    var key, extended;

    if (!obj)
      throw new Error('You tried to extend with a falsy object "' + obj + '"');

    for (key in obj) {
      if (Posture.hasOwnProperty(obj, key) && 
          Posture.indexOf.call(moduleKeywords, key) < 0) {

        this[key] = obj[key];
      }
    }
    if ((extended = obj.extended) != null) {
      extended.apply(this);
    }
    return this;
  };

  Module.include = function (obj) {
    var key, value, included;

    // assume that if they include a function, they actually wanted
    // the function's prototype.
    if (obj instanceof Function)
      obj = obj.prototype;

    obj = EJSON.clone(obj);

    this.onBeforeInclude(obj);

    for (key in obj) {
      if (Posture.hasOwnProperty(obj, key) &&
          Posture.indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = obj[key];
      }
    }

    if ((included = obj.included) != null) {
      included.apply(this);
    }

    return this;
  };

  Module.onBeforeInclude = function (obj) {
  };

  return Module;
})();
