describe('Request.JSON', function(){

	it('should create a JSON request', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request.JSON({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__response': '{"ok":true}'
			}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			// checks the first argument from the first call
			expect(this.onComplete.argsForCall[0][0]).toEqual({ok: true});
		});
		
	});

	it('should fire the error event', function(){

		runs(function(){
			this.onError = jasmine.createSpy();
			this.request = new Request.JSON({
				url: '../Helpers/request.php',
				onError: this.onError
			}).send({data: {
				'__response': '{"ok":function(){invalid;}}'
			}});
		});

		waitsFor(800, function(){
			return this.onError.wasCalled;
		});

		runs(function(){
			// checks the first argument from the first call
			expect(this.onError.argsForCall[0][0]).toEqual('{"ok":function(){invalid;}}');
		});

	});

});
