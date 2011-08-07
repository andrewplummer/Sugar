/*
---
name: Request.HTML Specs
description: n/a
requires: [Core/Request.HTML]
provides: [Request.HTML.Specs]
...
*/
describe('Request.HTML', function(){

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

	it('should create an ajax request and pass the right arguments to the onComplete event', function(){

		var response = '<body><img><div><span>res&amp;ponsé</span></div><script>___SPEC___=5;</script></body>';
	
		var request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy
		}).send({data: {
			'__response': response, '__type': 'html'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		
		expect(this.spy.wasCalled).toBe(true);
		
		// checks arguments order
		expect(this.spy).toHaveBeenCalledWith(request.response.tree, request.response.elements, request.response.html, request.response.javascript);
		var onCompleteArgs = this.spy.argsForCall[0];
		expect(onCompleteArgs[0][0].nodeName).toEqual('IMG');
		expect(onCompleteArgs[0][1].nodeName).toEqual('DIV');
		expect(onCompleteArgs[1][2].nodeName).toEqual('SPAN');
		expect(onCompleteArgs[2]).toEqual('<img><div><span>res&amp;ponsé</span></div>');
		expect(onCompleteArgs[3].trim()).toEqual('___SPEC___=5;');
		expect(___SPEC___).toEqual(5);

	});
	
	xit('should create an ajax request and correctly generate the tree response from a tr', function(){

		runs(function(){
			this.request = new Request.HTML({
				url: '../Helpers/request.php',
				onComplete: this.spy
			}).send({data: {
				'__response': '<tr><td>text</td></tr>', '__type': 'html'
			}});
		});

		waitsFor(800, function(){
			return this.spy.wasCalled;
		});

		runs(function(){
			var onCompleteArgs = this.spy.argsForCall[0];
			
			expect(onCompleteArgs[0][0].nodeName).toEqual('TR');
			expect(onCompleteArgs[1][1].nodeName).toEqual('TD');
			expect(onCompleteArgs[2]).toEqual('<tr><td>text</td></tr>');
		});

	});
	
	xit('should create an ajax request and correctly generate the tree response from options', function(){

		runs(function(){
			this.request = new Request.HTML({
				url: '../Helpers/request.php',
				onComplete: this.spy
			}).send({data: {
				'__response': '<option>1</option><option>2</option><option>3</option>', '__type': 'html'
			}});
		});

		waitsFor(800, function(){
			return this.spy.wasCalled;
		});

		runs(function(){
			var onCompleteArgs = this.spy.argsForCall[0];
			
			expect(onCompleteArgs[0].length).toEqual(3);
			expect(onCompleteArgs[1].length).toEqual(3);
			expect(onCompleteArgs[2]).toEqual('<option>1</option><option>2</option><option>3</option>');
			expect(onCompleteArgs[3]).toBeFalsy();
			
			var firstOption = onCompleteArgs[0][0];
			expect(firstOption.tagName).toEqual('OPTION');
			expect(firstOption.innerHTML).toEqual('1');
		});

	});
	
	it('should create an ajax request and correctly update an element with the response', function(){
		
		var response = '<span>text</span>';
		
		new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
		this.request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy,
			update: 'update'
		}).send({data: {
			'__response': response, '__type': 'html'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		
		expect(this.spy.wasCalled).toBe(true);

		var update = $('update');
		expect(update.getChildren().length).toEqual(1);
		expect(update.getFirst().get('tag')).toEqual('span');
		expect(update.getFirst().get('text')).toEqual('text');
		update.dispose();
	});

	it('should create an ajax request and correctly append the response to an element', function(){
		
		var response = '<div><span>text</span><p>paragraph</p></div>';
		
		new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
		this.request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy,
			append: 'update'
		}).send({data: {
			'__response': response, '__type': 'html'
		}});
		
		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		
		expect(this.spy.wasCalled).toBe(true);

		var update = $('update');
		expect(update.getChildren().length).toEqual(2);
		expect(update.getFirst().get('tag')).toEqual('div');
		expect(update.getFirst().get('text')).toEqual('some');
		var div = update.getFirst().getNext();
		expect(div.get('tag')).toEqual('div');
		expect(div.getFirst().get('tag')).toEqual('span');
		expect(div.getFirst().get('text')).toEqual('text');
		expect(div.getLast().get('tag')).toEqual('p');
		expect(div.getLast().get('text')).toEqual('paragraph');
		update.dispose();
				
	});
	
	it('should create an ajax request and correctly filter it by the passed selector', function(){
		
		var response = '<span>text</span><a>aaa</a>';
		
		var request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy,
			filter: 'a'
		}).send({data: {
			'__response': response, '__type': 'html'
		}});
		
		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		expect(this.spy.wasCalled).toBe(true);

		var onCompleteArgs = this.spy.argsForCall[0];
		expect(onCompleteArgs[0].length).toEqual(1);
		expect(onCompleteArgs[0][0].get('tag')).toEqual('a');
		expect(onCompleteArgs[0][0].get('text')).toEqual('aaa');
		
	});

	it('should create an ajax request that filters the response and updates the target', function(){
		
		var response = '<div>text<p><a>a link</a></p></div>';
		
		new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
		this.request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy,
			update: 'update',
			filter: 'a'
		}).send({data: {
			'__response': response, '__type': 'html'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		expect(this.spy.wasCalled).toBe(true);

		var update = $('update');
		expect(update.getChildren().length).toEqual(1);
		expect(update.getFirst().get('tag')).toEqual('a');
		expect(update.getFirst().get('text')).toEqual('a link');
		update.dispose();
		
	});

	it('should create an ajax request that filters the response and appends to the target', function(){
		
		var response = '<div>text<p><a>a link</a></p></div>';
		
		new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
		this.request = new Request.HTML({
			url: '../Helpers/request.php',
			onComplete: this.spy,
			append: 'update',
			filter: 'a'
		}).send({data: {
			'__response': response, '__type': 'html'
		}});

		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		expect(this.spy.wasCalled).toBe(true);

		var update = $('update');
		expect(update.getChildren().length).toEqual(2);
		expect(update.get('html')).toEqual('<div>some</div><a>a link</a>');
		update.dispose();
		
	});

	it('should create an ajax request through Element.load', function(){

		var element = new Element('div');

		var response = 'hello world!';
		
		var request = element.set('load', {
			url: '../Helpers/request.php',
			onComplete: this.spy
		}).get('load');

		expect(instanceOf(request, Request.HTML)).toBeTruthy();

		element.load({
			'__response': response, '__type': 'html'
		});

		this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
		expect(this.spy.wasCalled).toBe(true);

		runs(function(){
			var onCompleteArgs = this.spy.argsForCall[0];
			expect(element.get('text')).toEqual('hello world!');
		});

	});
	
});
