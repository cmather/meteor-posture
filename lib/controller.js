function assert (condition, msg) {
  if (!condition)
    throw new Error(msg);
}

function getTemplateFunction (name, defaultFn) {
  var template = null;

  if (_.isFunction(name))
    template = name;
  else if (_.isString(name))
    template = Template[name];

  if (!template && defaultFn)
    template = defaultFn;

  assert(template, 'Template "' + name + '" not found');
  return template;
}

Controller = Class.extends({
  typeName: 'Controller',

  initialize: function () {
  },

  template: null,

  layout: null,

  render: function (templateName, options) {
    var self = this
      , _meta = self._meta || {}
      , landmarkOptions
      , template
      , layoutName
      , layout
      , data = { text: 'hello' }

    if (_.isObject(templateName)) {
      options = templateName;
      templateName = self.template;
    }

    options = options || {};
    templateName = options.template || self.template;
    layoutName = options.layout || self.layout;

    layout = getTemplateFunction(layoutName, function (data) {
      return data['yield']();
    });

    template = getTemplateFunction(templateName);

    function wrapEvents (events) {
      var wrapped = {};

      _.each(events, function (handler, key) {
        wrapped[key] = function (e, tmpl) {
          return handler.call(this, e, tmpl, self);
        };
      });

      return wrapped;
    }

    return Spark.render(function () {
      return Spark.labelBranch('Controller.' + self.class.typeName(), function () {
        var html = Spark.createLandmark({
          // no landmark options for now
        }, function (landmark) {
          var html = layout({
            'yield': function () {
              //XXX maybe if meteor would provide a better api to
              //templates we wouldn't need to do this
              data = _.extend({}, data, self._meta.helpers);
              return template(data);
            }
          });

          if (_meta.events) {
            //XXX wrap events here so controller instance
            //passed as third parameter
            html = Spark.attachEvents(wrapEvents(_meta.events), html);
          }

          return html;
        });

        return Spark.setDataContext(data, html);
      });
    });
  }
});

Controller.extend({
  _meta: function () {
    var proto = this.prototype;

    if (proto._meta && !proto.hasOwnProperty('_meta')) {
      proto._meta = EJSON.clone(proto._meta);
    } else if (!proto._meta) {
      proto._meta = {
        events: {},
        helpers: {}
      };
    }

    return this.prototype._meta;
  },

  events: function (map) {
    var _meta = this._meta();
    _.extend(_meta.events, map);
    return this;
  },

  helpers: function (map) {
    var _meta = this._meta();
    _.extend(_meta.helpers, map);
    return this;
  }
});

Controller.onBeforeExtends = function (def) {
  Class.onBeforeExtends.apply(this, arguments);

  if (def.events) {
    this.events(def.events);
    delete def.events;
  }

  if (def.layout) {
    this.layout(def.layout);
    delete def.layout;
  }
};
