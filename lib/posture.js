var indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }
};

var hasProp = {}.hasOwnProperty;

var isArray = function (obj) {
  return typeof obj === 'array';
};

var typeOf = function (obj) {
  return Object.prototype.toString.call(obj);
};

var extends = function (child, parent) {
  for (var key in parent) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }

  function ctor () {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

Module = (function () {
  function Module () {}

  var moduleKeywords = [
    'include',
    'extend',
    'included',
    'extended',
    'constructor'];

  Module.extend = function (obj) {
    var key, _ref;
    for (key in obj) {
      if (hasProp.call(obj, key) && indexOf.call(moduleKeywords, key) < 0) {
        this[key] = obj[key];
      }
    }
    if ((_ref = obj.extended) != null) {
      _ref.apply(this);
    }
    return this;
  };

  Module.include = function (obj) {
    var key, value, _ref;

    obj = typeof obj === 'function' ? obj.prototype : obj;

    for (key in obj) {
      // assume that if they include a function, they actually wanted
      // the function's prototype.
      if (hasProp.call(obj, key) && indexOf.call(moduleKeywords, key) < 0) {
        this.prototype[key] = obj[key];
      }
    }

    if ((_ref = obj.included) != null) {
      _ref.apply(this);
    }

    return this;
  }

  return Module;
})();

Class = (function(_super) {
  extends(Class, _super);

  var _ref;

  function Class () {
    _ref = Class.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Class._typeName = 'Class';

  Class.include({
    initialize: function () {
    }
  });

  Class.extend({
    typeName: function () {
      return this._typeName || this.name;
    },

    extends: function (definition) {
      var Super = this
        , includes;

      function F () {
        this.class = F;
        if (this.initialize)
          this.initialize.apply(this, arguments);
      }

      extends(F, Super);

      definition = definition || {};
      //XXX for some reason this is not working properly with events
      F.onBeforeExtends(definition);
      F.include(definition);

      return F;
    },

    onBeforeExtends: function (definition) {
      if (definition.typeName) {
        this._typeName = definition.typeName;
        delete definition.typeName;
      }

      if (definition.include) {
        includes = definition.include;
        includes = isArray(includes) ? includes : [includes];

        for (var i = 0, l = includes.length; i < l; i++) {
          this.include(includes[i]);
        }
        delete definition.include;
      }
    }
  });

  return Class;
})(Module);
