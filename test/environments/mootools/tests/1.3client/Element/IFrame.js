/*
---
name: IFrame Specs
description: n/a
requires: [Core/Element]
provides: [IFrame.Specs]
...
*/
describe('IFrame', function(){

	it('should call onload', function(){
		runs(function(){
			this.onComplete = jasmine.createSpy();

			this.iframe = new IFrame({
				src: 'http://' + document.location.host,
				onload: this.onComplete
			}).setStyles({
				position: 'absolute',
				left: -5000,
				width: 1,
				height: 1
			}).inject(document.body);
		});

		waitsFor(1000, function(){
			return this.onComplete.wasCalled;
		});

	});

});