SubModule = function () {
};

Posture.inherit(SubModule, Module);

calls = {};

Tinytest.add('Module - extend', function (test) {
  var mixin = {
    mixinMethod: function () {
      return 'mixinMethod'
    },

    extended: function () {
      calls['mixin.extended'] = true;
    },

    /* keyword properties not mixed in */
    include: function () {},
    extend: function () {},
    included: function () {},
    constructor: function () {}
  };

  SubModule.extend(mixin);

  /* extended hook called */
  test.isTrue(calls['mixin.extended'], 'extended hook called');

  /* methods mixed in */
  test.equal(SubModule.mixinMethod, mixin.mixinMethod, 'method mixed in');

  /* keywords */
  test.notEqual(SubModule.include, mixin.include);
  test.notEqual(SubModule.extend, mixin.extend);
  test.notEqual(SubModule.included, mixin.included);
  test.notEqual(SubModule.extended, mixin.extended);
  test.notEqual(SubModule.constructor, mixin.constructor);
});

Tinytest.add('Module - include object', function (test) {
  var includeObject = {
    /* keyword properties not mixed in */
    include: function () {},
    extend: function () {},
    extended: function () {},
    included: function () {
      calls['includeObject.included'] = true;
    },
    constructor: function () {},
    includedObjectMethod: function () { return 'includedObjectMethod'; }
  };

  SubModule.include(includeObject);

  /* included hook called */
  test.isTrue(calls['includeObject.included'], 'included hook called');

  /* methods mixed in */
  test.equal(SubModule.prototype.includedObjectMethod(), 'includedObjectMethod');

  /* keywords */
  test.notEqual(SubModule.prototype.include, includeObject.include);
  test.notEqual(SubModule.prototype.extend, includeObject.extend);
  test.notEqual(SubModule.prototype.included, includeObject.included);
  test.notEqual(SubModule.prototype.extended, includeObject.extended);
  test.notEqual(SubModule.prototype.constructor, includeObject.constructor);
});

Tinytest.add('Module - include function', function (test) {
  var IncludeFunction = function () {
  };

  IncludeFunction.prototype = {
    constructor: IncludeFunction,
    /* keyword properties not mixed in */
    include: function () {},
    extend: function () {},
    extended: function () {},
    included: function () {
      calls['IncludeFunction.prototype.included'] = true;
    },
    includeFunctionMethod: function () { return 'includeFunctionMethod'; }
  };

  SubModule.include(IncludeFunction.prototype);

  /* included hook called */
  test.isTrue(calls['IncludeFunction.prototype.included'], 'included hook called');

  /* methods mixed in */
  test.equal(SubModule.prototype.includeFunctionMethod(), 'includeFunctionMethod');

  test.notEqual(SubModule.prototype.include, IncludeFunction.prototype.include);
  test.notEqual(SubModule.prototype.extend, IncludeFunction.prototype.extend);
  test.notEqual(SubModule.prototype.included, IncludeFunction.prototype.included);
  test.notEqual(SubModule.prototype.extended, IncludeFunction.prototype.extended);
  test.notEqual(SubModule.prototype.constructor, IncludeFunction.prototype.constructor);
});

Tinytest.add('Class - inherit', function (test) {
  Parent = Class.inherit({
    parentMethod: function () { return 'parentMethod'; }
  });

  ChildA = Parent.inherit({
    childAMethod: function () { return 'childAMethod'; }
  });

  ChildB = ChildA.inherit({
    constructor: function () {
      calls['ChildB.prototype.constructor'] = true;
    },

    childBMethod: function () { return 'childBMethod'; }
  });

  b = new ChildB;
  test.isTrue(calls['ChildB.prototype.constructor'], 'ctor called');
  test.equal(b.childBMethod(), 'childBMethod');
  test.equal(b.childAMethod(), 'childAMethod');
  test.equal(b.parentMethod(), 'parentMethod');

  /* __super__ */

  var ctors = {};
  Animal = Class.inherit({
    constructor: function () {
      ctors['Animal'] = true;
    }
  });

  Dog = Animal.inherit({
    constructor: function () {
      Dog.__super__.constructor.apply(this, arguments);
      ctors['Dog'] = true;
    }
  });

  d = new Dog;
  test.isTrue(ctors.Animal);
  test.isTrue(ctors.Dog);

  /* include */

  var Form = Class.inherit({
    parseForm: function () {
      return 'parseForm';
    }
  });

  var Control = Class.inherit({
    include: Form
  });

  test.equal(Control.prototype.parseForm(), 'parseForm');

  /* typeName and class property */
  var MyType = Class.inherit({
    typeName: 'MyType'
  });

  test.equal(MyType.typeName(), 'MyType');

  var myType = new MyType;
  test.equal(MyType.typeName(), 'MyType');
  test.equal(myType.class, MyType);
  test.equal(myType.class.typeName(), 'MyType');
});
