/*
---
name: Request.JSON Specs
description: n/a
requires: [Core/Request.JSON]
provides: [Request.JSON.Specs]
...
*/
describe('Request.JSON', function(){

	beforeEach(function(){
		this.spy = jasmine.createSpy();
		this.xhr = sinon.useFakeXMLHttpRequest();
		var requests = this.requests = [];
		this.xhr.onCreate = function(xhr){
			requests.push(xhr);
		};
	});
	
	afterEach(function(){
		this.xhr.restore();		
	});

	it('should create a JSON request', function(){

		var response = '{"ok":true}';
		
		this.request = new Request.JSON({
			url: '../Helpers/request.php',
			onComplete: this.spy
		}).send({data: {
			'__response': response
		}});
		
		this.requests[0].respond(200, {'Content-Type': 'text/json'}, response);
		expect(this.spy.wasCalled).toBe(true);
		
		// checks the first argument from the first call
		expect(this.spy.argsForCall[0][0]).toEqual({ok: true});
		
	});

	it('should fire the error event', function(){

		var response = '{"ok":function(){invalid;}}';
		
		this.request = new Request.JSON({
			url: '../Helpers/request.php',
			onError: this.spy
		}).send({data: {
			'__response': response
		}});
		
		this.requests[0].respond(200, {'Content-Type': 'text/json'}, response);
		expect(this.spy.wasCalled).toBe(true);
		
		// checks the first argument from the first call
		expect(this.spy.argsForCall[0][0]).toEqual('{"ok":function(){invalid;}}');

	});

});
