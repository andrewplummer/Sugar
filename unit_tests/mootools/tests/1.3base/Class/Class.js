/*
---
name: Class Specs
description: n/a
requires: [Core/Class]
provides: [Class.Specs]
...
*/

(function(){

var Animal = new Class({

	initialized: false,

	initialize: function(name, sound){
		this.name = name;
		this.sound = sound || '';
		this.initialized = true;
	},

	eat: function(){
		return 'animal:eat:' + this.name;
	},

	say: function(){
		return 'animal:say:' + this.name;
	}

});

var Cat = new Class({

	Extends: Animal,

	ferocious: false,

	initialize: function(name, sound){
		this.parent(name, sound || 'miao');
	},

	eat: function(){
		return 'cat:eat:' + this.name;
	},

	play: function(){
		return 'cat:play:' + this.name;
	}

});

var Lion = new Class({

	Extends: Cat,

	ferocious: true,

	initialize: function(name){
		this.parent(name, 'rarr');
	},

	eat: function(){
		return 'lion:eat:' + this.name;
	}

});

var Actions = new Class({

	jump: function(){
		return 'actions:jump:' + this.name;
	},

	sleep: function(){
		return 'actions:sleep:' + this.name;
	}

});

var Attributes = new Class({

	color: function(){
		return 'attributes:color:' + this.name;
	},

	size: function(){
		return 'attributes:size:' + this.name;
	}

});


describe('Class creation 1.3', {

	"Classes should be of type 'class'": function(){
		expect(typeOf(Animal)).toEqual('class');
		expect(Type.isClass(Animal)).toBeTruthy();
	},

	"should call initialize upon instantiation": function(){
		var animal = new Animal('lamina');
		expect(animal.name).toEqual('lamina');
		expect(animal.initialized).toBeTruthy();
		expect(animal.say()).toEqual('animal:say:lamina');
	},

	"should use 'Extend' property to extend another class": function(){
		var cat = new Cat('fluffy');
		expect(cat.name).toEqual('fluffy');
		expect(cat.sound).toEqual('miao');
		expect(cat.ferocious).toBeFalsy();
		expect(cat.say()).toEqual('animal:say:fluffy');
		expect(cat.eat()).toEqual('cat:eat:fluffy');
		expect(cat.play()).toEqual('cat:play:fluffy');
	},

	"should use 'Extend' property to extend an extended class": function(){
		var leo = new Lion('leo');
		expect(leo.name).toEqual('leo');
		expect(leo.sound).toEqual('rarr');
		expect(leo.ferocious).toBeTruthy();
		expect(leo.say()).toEqual('animal:say:leo');
		expect(leo.eat()).toEqual('lion:eat:leo');
		expect(leo.play()).toEqual('cat:play:leo');
	},

	"should use 'Implements' property to implement another class": function(){
		var Dog = new Class({
			Implements: Animal
		});

		var rover = new Dog('rover');
		expect(rover.name).toEqual('rover');
		expect(rover.initialized).toBeTruthy();
		expect(rover.eat()).toEqual('animal:eat:rover');
	},

	"should use 'Implements' property to implement any number of classes": function(){
		var Dog = new Class({
			Extends: Animal,
			Implements: [Actions, Attributes]
		});

		var rover = new Dog('rover');
		expect(rover.initialized).toBeTruthy();
		expect(rover.eat()).toEqual('animal:eat:rover');
		expect(rover.say()).toEqual('animal:say:rover');
		expect(rover.jump()).toEqual('actions:jump:rover');
		expect(rover.sleep()).toEqual('actions:sleep:rover');
		expect(rover.size()).toEqual('attributes:size:rover');
		expect(rover.color()).toEqual('attributes:color:rover');
	},

	"should alter the Class's prototype when implementing new methods": function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');

		Dog.implement({
			jump: function(){
				return 'dog:jump:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.jump()).toEqual('dog:jump:spot');
		expect(rover.jump()).toEqual('dog:jump:rover');
	},

	"should alter the Class's prototype when implementing new methods into the super class": function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');

		Animal.implement({
			jump: function(){
				return 'animal:jump:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.jump()).toEqual('animal:jump:spot');
		expect(rover.jump()).toEqual('animal:jump:rover');
	},

	"should alter the Class's prototype when overwriting methods in the super class": function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');
		expect(rover.say()).toEqual('animal:say:rover');

		Animal.implement({
			say: function(){
				return 'NEW:animal:say:' + this.name;
			}
		});

		var spot = new Dog('spot');

		expect(spot.say()).toEqual('NEW:animal:say:spot');
		expect(rover.say()).toEqual('NEW:animal:say:rover');
	}

});

describe('Class::implement 1.3', {

	'should implement an object': function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions);

		var rover = new Dog('rover');

		expect(rover.name).toEqual('rover');
		expect(rover.jump()).toEqual('actions:jump:rover');
		expect(rover.sleep()).toEqual('actions:sleep:rover');
	},

	'should implement any number of objects': function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions).implement(new Attributes);

		var rover = new Dog('rover');

		expect(rover.name).toEqual('rover');
		expect(rover.jump()).toEqual('actions:jump:rover');
		expect(rover.sleep()).toEqual('actions:sleep:rover');
		expect(rover.size()).toEqual('attributes:size:rover');
		expect(rover.color()).toEqual('attributes:color:rover');
	}

});

describe('Class toString', function(){

	it('should allow to implement toString', function(){
		var Person = new Class({

			initialize: function(name){
				this.name = name;
			},

			toString: function(){
				return this.name;
			}

		});

		var Italian = new Class({

			Extends: Person,
			
			toString: function(){
				return "It's me, " + this.name;
			}

		});

		expect((new Person('Valerio')) + '').toBe('Valerio');

		expect((new Italian('Valerio')) + '').toBe("It's me, Valerio");
	});

});

})();