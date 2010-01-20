/*
Script: Class.js
	Specs for Class.js

License:
	MIT-style license.
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


describe('Class creation', {

	"Classes should be of type 'class'": function(){
		value_of($type(Animal)).should_be('class');
		value_of(Class.type(Animal)).should_be_true();
	},

	"should call initialize upon instantiation": function(){
		var animal = new Animal('lamina');
		value_of(animal.name).should_be('lamina');
		value_of(animal.initialized).should_be_true();
		value_of(animal.say()).should_be('animal:say:lamina');
	},

	"should use 'Extend' property to extend another class": function(){
		var cat = new Cat('fluffy');
		value_of(cat.name).should_be('fluffy');
		value_of(cat.sound).should_be('miao');
		value_of(cat.ferocious).should_be_false();
		value_of(cat.say()).should_be('animal:say:fluffy');
		value_of(cat.eat()).should_be('cat:eat:fluffy');
		value_of(cat.play()).should_be('cat:play:fluffy');
	},

	"should use 'Extend' property to extend an extended class": function(){
		var leo = new Lion('leo');
		value_of(leo.name).should_be('leo');
		value_of(leo.sound).should_be('rarr');
		value_of(leo.ferocious).should_be_true();
		value_of(leo.say()).should_be('animal:say:leo');
		value_of(leo.eat()).should_be('lion:eat:leo');
		value_of(leo.play()).should_be('cat:play:leo');
	},

	"should use 'Implements' property to implement another class": function(){
		var Dog = new Class({
			Implements: Animal
		});

		var rover = new Dog('rover');
		value_of(rover.name).should_be('rover');
		value_of(rover.initialized).should_be_true();
		value_of(rover.eat()).should_be('animal:eat:rover');
	},

	"should use 'Implements' property to implement any number of classes": function(){
		var Dog = new Class({
			Extends: Animal,
			Implements: [Actions, Attributes]
		});

		var rover = new Dog('rover');
		value_of(rover.initialized).should_be_true();
		value_of(rover.eat()).should_be('animal:eat:rover');
		value_of(rover.say()).should_be('animal:say:rover');
		value_of(rover.jump()).should_be('actions:jump:rover');
		value_of(rover.sleep()).should_be('actions:sleep:rover');
		value_of(rover.size()).should_be('attributes:size:rover');
		value_of(rover.color()).should_be('attributes:color:rover');
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

		value_of(spot.jump()).should_be('dog:jump:spot');
		value_of(rover.jump()).should_be('dog:jump:rover');
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

		value_of(spot.jump()).should_be('animal:jump:spot');
		value_of(rover.jump()).should_be('animal:jump:rover');
	},

	"should alter the Class's prototype when overwriting methods in the super class": function(){
		var Dog = new Class({
			Extends: Animal
		});

		var rover = new Dog('rover');
		value_of(rover.say()).should_be('animal:say:rover');

		Animal.implement({
			say: function(){
				return 'NEW:animal:say:' + this.name;
			}
		});

		var spot = new Dog('spot');

		value_of(spot.say()).should_be('NEW:animal:say:spot');
		value_of(rover.say()).should_be('NEW:animal:say:rover');
	}
	
	/*
	* TODO: 2.0
	"should access the proper parent when it is overwritten after instantiation": function(){
		var Dog = new Class({
			Extends: Animal,
			say: function(){
				return this.parent();
			}
		});

		var rover = new Dog('rover');
		value_of(rover.say()).should_be('animal:say:rover');

		Animal.implement({
			say: function(){
				return 'NEW:animal:say:' + this.name;
			}
		});

		var spot = new Dog('spot');

		value_of(spot.say()).should_be('NEW:animal:say:spot');
		value_of(rover.say()).should_be('NEW:animal:say:rover');
	}*/

});

describe('Class::implement', {

	'should implement an object': function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions);

		var rover = new Dog('rover');

		value_of(rover.name).should_be('rover');
		value_of(rover.jump()).should_be('actions:jump:rover');
		value_of(rover.sleep()).should_be('actions:sleep:rover');
	},

	'should implement any number of objects': function(){
		var Dog = new Class({
			Extends: Animal
		});

		Dog.implement(new Actions).implement(new Attributes);

		var rover = new Dog('rover');

		value_of(rover.name).should_be('rover');
		value_of(rover.jump()).should_be('actions:jump:rover');
		value_of(rover.sleep()).should_be('actions:sleep:rover');
		value_of(rover.size()).should_be('attributes:size:rover');
		value_of(rover.color()).should_be('attributes:color:rover');
	}

});

})();