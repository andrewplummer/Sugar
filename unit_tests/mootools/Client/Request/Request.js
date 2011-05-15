describe('Request', function(){

	it('should create an ajax request', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__response': 'res&amp;ponsé'
			}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			// checks the first argument from the first call
			expect(this.onComplete.argsForCall[0][0]).toEqual('res&amp;ponsé');
		});
		
	});
	
	it('should create a Request with method get and sending data', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				method: 'get',
				onComplete: this.onComplete
			}).send({data: {'some': 'data'}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('{"method":"get","get":{"some":"data"}}');
		});
		
	});
	
	it('the options passed on the send method should rewrite the current ones', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				method: 'get',
				data: {'setup': 'data'},
				onComplete: this.onComplete
			}).send({method: 'post', data: {'send': 'senddata'}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('{"method":"post","post":{"send":"senddata"}}');
		});
		
	});
	
	xit('should create an ajax request and as it\'s an invalid XML, onComplete will receive null as the xml document', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				onComplete: this.onComplete
			}).send({data: {
				'__type': 'xml',
				'__response': 'response'
			}});
		});
		
		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('response');
			expect(this.request.response.text).toEqual('response');
		});
		
		runs(function(){
			this.chain = jasmine.createSpy();
			this.request.chain(this.chain).send({data: {
				'__type': 'xml',
				'__response': '<node>response</node><no></no>'
			}});
		});
		
		waitsFor(800, function(){
			return this.chain.wasCalled;
		});
		
		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('<node>response</node><no></no>');
			expect(this.request.response.text).toEqual('<node>response</node><no></no>');
		});
		
	});

	it('should not overwrite the data object', function(){

		runs(function(){
			this.onComplete = jasmine.createSpy();
			this.request = new Request({
				url: '../Helpers/request.php',
				data: {
					__response: 'data'
				},
				onComplete: this.onComplete
			}).post();
		});

		waitsFor(800, function(){
			return this.onComplete.wasCalled;
		});

		runs(function(){
			expect(this.onComplete.argsForCall[0][0]).toEqual('data');
		});

	});


});
