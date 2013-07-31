var root = this;

(function () {
  Posture = {
    inherit: function (child, parent) {
      for (var key in parent) {
        if (Posture.hasOwnProperty(parent, key))
          child[key] = parent[key];
      }

      function ctor () {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },

    typeOf: function (obj) {
      if (obj && typeof obj.typeName === 'function')
        return obj.typeName();
      else if (obj)
        return Object.prototype.toString.call(obj);
    },

    hasOwnProperty: function (obj, key) {
      var prop = {}.hasOwnProperty;
      return prop.call(obj, key);
    },

    indexOf: [].indexOf || function (item) {
      if (!(this instanceof Array))
        throw new Error('indexOf only works with arrays');

      for (var i = 0, l = this.length; i < l; i++) {
        if (i in arr && this[i] === item) return i;
      }
    },

    toArray: function (obj) {
      if (Posture.typeOf(obj) !== '[object Array]')
        return [obj];
      else
        return obj;
    }
  };
}());
