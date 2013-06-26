Class = (function(_super) {
  Posture.extends(Class, _super);

  function Class () {
    var ret = Class.__super__.constructor.apply(this, arguments);

    this.class = this.constructor;

    var objectId = Meteor.uuid();

    this.objectId = function () {
      return objectId;
    };

    if (this.initialize)
      this.initialize.apply(this, arguments);

    return ret;
  }

  Class.include({
    initialize: function () {
    }
  });

  Class.extend({
    typeName: function () {
      return this.name;
    },

    extends: function (definition) {
      var Super = this;

      function F () {
        return F.__super__.constructor.apply(this, arguments);
      }

      Posture.extends(F, Super);

      definition = definition || {};
      F.onBeforeExtends(definition);
      F.include(definition);

      return F;
    },

    onBeforeExtends: function (definition) {
      var self = this
        , includes;

      if (definition.typeName) {
        this.typeName = (function () {
          var typeName = definition.typeName;
          return function () { return typeName; };
        }());

        delete definition.typeName;
      } else {
        this.typeName = function () {
          return self.name;
        };
      }

      if (definition.include) {
        includes = Posture.toArray(definition.include);

        for (var i = 0, l = includes.length; i < l; i++) {
          this.include(includes[i]);
        }
        delete definition.include;
      }
    }
  });

  return Class;
})(Module);
