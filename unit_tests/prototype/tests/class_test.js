new Test.Unit.Runner({
  testClassCreate: function() {
    this.assert(Object.isFunction(Animal), 'Animal is not a constructor');
    this.assertEnumEqual([Cat, Mouse, Dog, Ox], Animal.subclasses);
    Animal.subclasses.each(function(subclass) {
      this.assertEqual(Animal, subclass.superclass);
    }, this);

    var Bird = Class.create(Animal);
    this.assertEqual(Bird, Animal.subclasses.last());
    // for..in loop (for some reason) doesn't iterate over the constructor property in top-level classes
    this.assertEnumEqual(Object.keys(new Animal).sort(), Object.keys(new Bird).without('constructor').sort());
  },

  testClassInstantiation: function() {
    var pet = new Animal("Nibbles");
    this.assertEqual("Nibbles", pet.name, "property not initialized");
    this.assertEqual('Nibbles: Hi!', pet.say('Hi!'));
    this.assertEqual(Animal, pet.constructor, "bad constructor reference");
    this.assertUndefined(pet.superclass);

    var Empty = Class.create();
    this.assert('object', typeof new Empty);
  },

  testInheritance: function() {
    var tom = new Cat('Tom');
    this.assertEqual(Cat, tom.constructor, "bad constructor reference");
    this.assertEqual(Animal, tom.constructor.superclass, 'bad superclass reference');
    this.assertEqual('Tom', tom.name);
    this.assertEqual('Tom: meow', tom.say('meow'));
    this.assertEqual('Tom: Yuk! I only eat mice.', tom.eat(new Animal));
  },

  testSuperclassMethodCall: function() {
    var tom = new Cat('Tom');
    this.assertEqual('Tom: Yum!', tom.eat(new Mouse));

    // augment the constructor and test
    var Dodo = Class.create(Animal, {
      initialize: function($super, name) {
        $super(name);
        this.extinct = true;
      },

      say: function($super, message) {
        return $super(message) + " honk honk";
      }
    });

    var gonzo = new Dodo('Gonzo');
    this.assertEqual('Gonzo', gonzo.name);
    this.assert(gonzo.extinct, 'Dodo birds should be extinct');
    this.assertEqual("Gonzo: hello honk honk", gonzo.say("hello"));
  },

  testClassAddMethods: function() {
    var tom   = new Cat('Tom');
    var jerry = new Mouse('Jerry');

    Animal.addMethods({
      sleep: function() {
        return this.say('ZZZ');
      }
    });

    Mouse.addMethods({
      sleep: function($super) {
        return $super() + " ... no, can't sleep! Gotta steal cheese!";
      },
      escape: function(cat) {
        return this.say('(from a mousehole) Take that, ' + cat.name + '!');
      }
    });

    this.assertEqual('Tom: ZZZ', tom.sleep(), "added instance method not available to subclass");
    this.assertEqual("Jerry: ZZZ ... no, can't sleep! Gotta steal cheese!", jerry.sleep());
    this.assertEqual("Jerry: (from a mousehole) Take that, Tom!", jerry.escape(tom));
    // insure that a method has not propagated *up* the prototype chain:
    this.assertUndefined(tom.escape);
    this.assertUndefined(new Animal().escape);

    Animal.addMethods({
      sleep: function() {
        return this.say('zZzZ');
      }
    });

    this.assertEqual("Jerry: zZzZ ... no, can't sleep! Gotta steal cheese!", jerry.sleep());
  },

  testBaseClassWithMixin: function() {
    var grass = new Plant('grass', 3);
    this.assertRespondsTo('getValue', grass);
    this.assertEqual('#<Plant: grass>', grass.inspect());
  },

  testSubclassWithMixin: function() {
    var snoopy = new Dog('Snoopy', 12, 'male');
    this.assertRespondsTo('reproduce', snoopy);
  },

  testSubclassWithMixins: function() {
    var cow = new Ox('cow', 400, 'female');
    this.assertEqual('#<Ox: cow>', cow.inspect());
    this.assertRespondsTo('reproduce', cow);
    this.assertRespondsTo('getValue', cow);
  },

  testClassWithToStringAndValueOfMethods: function() {
    var Foo = Class.create({
      toString: function() { return "toString" },
      valueOf: function() { return "valueOf" }
    });
    
    var Bar = Class.create(Foo, {
      valueOf: function() { return "myValueOf" }
    });

    var Parent = Class.create({
      m1: function(){ return 'm1' },
      m2: function(){ return 'm2' }
    });
    var Child = Class.create(Parent, {
      m1: function($super) { return 'm1 child' },
      m2: function($super) { return 'm2 child' }
    });

    this.assert(new Child().m1.toString().indexOf('m1 child') > -1);

    this.assertEqual("toString", new Foo().toString());
    this.assertEqual("valueOf", new Foo().valueOf());
    this.assertEqual("toString", new Bar().toString());
    this.assertEqual("myValueOf", new Bar().valueOf());
  }
});