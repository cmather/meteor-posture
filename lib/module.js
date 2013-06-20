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
    for (key in obj) {
      if (Posture.hasOwnProperty(obj, key) && 
          Posture.indexOf(moduleKeywords, key) < 0) {
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

    if (Posture.typeOf(obj) === '[object Function]')
      obj = obj.prototype;

    for (key in obj) {
      // assume that if they include a function, they actually wanted
      // the function's prototype.
      if (Posture.hasOwnProperty(obj, key) &&
          Posture.indexOf(moduleKeywords, key) < 0) {
        this.prototype[key] = obj[key];
      }
    }

    if ((included = obj.included) != null) {
      included.apply(this);
    }

    return this;
  }

  return Module;
})();
