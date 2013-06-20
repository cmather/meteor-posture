var root = this;

(function () {
  Posture = {
    extends: function (child, parent) {
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

    indexOf: [].indexOf || function (arr, item) {

      if ([].indexOf)
        return [].indexOf.call(arr, item);

      for (var i = 0, l = arr.length; i < l; i++) {
        if (i in arr && arr[i] === item) return i;
      }
    },

    toArray: function (obj) {
      if (Posture.typeOf(obj) === '[object Object]')
        return [obj];
      else
        return obj;
    }
  };
}());
