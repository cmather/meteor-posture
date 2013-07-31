Class = (function(_super) {
  Posture.inherit(Class, _super);

  function Class () {
    var ret = Class.__super__.constructor.apply(this, arguments);

    this.class = this.constructor;

    var objectId = Meteor.uuid();

    this.objectId = function () {
      return objectId;
    };

    return ret;
  }

  Class.extend({
    typeName: function () {
      return this.name;
    },

    inherit: function (definition) {
      var Super = this
        , Constructor;

      definition = definition || {};

      Constructor = function () {
        var retVal;

        if (Constructor.__super__ && Constructor.__super__.constructor)
          retVal = Constructor.__super__.constructor.apply(this, arguments);

        if (definition.hasOwnProperty('constructor'))
          retVal = definition.constructor.apply(this, arguments);

        return retVal;
      };

      Posture.inherit(Constructor, Super);

      Constructor.onBeforeInherit(definition);
      Constructor.include(definition);

      return Constructor;
    },

    onBeforeInherit: function (definition) {
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
