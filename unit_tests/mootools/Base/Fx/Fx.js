
describe('Fx', function(){

	Object.each(Fx.Transitions, function(value, transition){
		if (transition == 'extend') return;

		it('should start a Fx and call the onComplete event with ' + transition + ' as timing function', function(){

			var onComplete = jasmine.createSpy('complete'),
				onStart = jasmine.createSpy('start');

			var fx = new Fx({
				duration: 50,
				transition: Fx.Transitions[transition],
				onComplete: onComplete,
				onStart: onStart
			});

			expect(onStart).not.toHaveBeenCalled();

			fx.start(10, 20);

			expect(onStart).toHaveBeenCalled();
			expect(onComplete).not.toHaveBeenCalled();

			waitsFor(300, function(){
				return onComplete.wasCalled;
			});

			runs(function(){
				expect(onComplete).toHaveBeenCalled();
			});

		});
	});

	it('should cancel a Fx', function(){

		var onCancel = jasmine.createSpy();

		var fx = new Fx({
			duration: 50,
			transition: 'sine:in:out',
			onCancel: onCancel
		});

		fx.start();

		expect(onCancel).not.toHaveBeenCalled();

		fx.cancel();

		expect(onCancel).toHaveBeenCalled();

	});

	it('should set the computed value', function(){

		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 100
		}).start(0, 10);

		waits(150);

		runs(function(){
			expect(fx.foo).toEqual(10);
		});

	});

	it('should pause and resume', function(){

		var FxLog = new Class({
			Extends: Fx,
			set: function(current){
				this.foo = current;
			}
		});

		var fx = new FxLog({
			duration: 200
		}).start(0, 1);

		waits(100);

		var value;

		runs(function(){
			fx.pause();
			value = fx.foo;
			expect(fx.foo).toBeGreaterThan(0);
			expect(fx.foo).toBeLessThan(1);
		});

		waits(100);

		runs(function(){
			expect(fx.foo).toEqual(value);
			fx.resume();
		});

		waits(200);

		runs(function(){
			expect(fx.foo).toEqual(1);
		});

	});

	it('should chain the Fx', function(){

		var counter = 0;
		var fx = new Fx({
			duration: 50,
			onComplete: function(){
				counter++;
			},
			link: 'chain'
		});

		fx.start().start();

		waits(210);

		runs(function(){
			expect(counter).toEqual(2);
		});
	});

	it('should cancel the Fx after a new Fx:start with the link = cancel option', function(){

		var onCancel = jasmine.createSpy('cancel');

		var fx = new Fx({
			duration: 50,
			onCancel: onCancel,
			link: 'cancel'
		});

		fx.start().start();

		expect(onCancel).toHaveBeenCalled();

	});

});

