/*
Script: Element.js
	Specs for Element.js

License:
	MIT-style license.
*/

module('MooTools Element');

test('Element constructor', function() {

  (function(){
    var element = new Element('div');
    equal($type(element)).should_be('element');
    ok($defined(element.addEvent), "should return an Element with the correct tag");
    equal(element.tagName.toLowerCase()).should_be('div');
  })();

  (function(){
    var element = new Element('div', { 'id': 'divID', 'title': 'divTitle' });
    equal(element.id, 'divID', 'should return an Element with various attributes');
    equal(element.title, 'divTitle', 'should return an Element with various attributes');
  })();

  (function(){
    var label = new Element('label', { 'for': 'myId' });
    equal(label.htmlFor, 'myId', 'should return an Element with for attribute');
  })();

  (function(){
    var div1 = new Element('div', { 'class': 'class' });
    var div2 = new Element('div', { 'class': 'class1 class2 class3' });

    equal(div1.className, 'class', 'should return an Element with class attribute');
    equal(div2.className, 'class1 class2 class3', 'should return an Element with class attribute');
  })();

  (function(){
    var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
    var password = new Element('input', { type: 'password', name: 'password', value: 'password' });

    equal(username.type, 'text', 'should return input Elements with name and type attributes');
    equal(username.name, 'username', 'should return input Elements with name and type attributes');
    equal(username.value, 'username', 'should return input Elements with name and type attributes');

    equal(password.type, 'password', 'should return input Elements with name and type attributes');
    equal(password.name, 'password', 'should return input Elements with name and type attributes');
    equal(password.value, 'password', 'should return input Elements with name and type attributes');
  })();

  (function(){
    var check1 = new Element('input', { type: 'checkbox' });
    var check2 = new Element('input', { type: 'checkbox', checked: true });
    var check3 = new Element('input', { type: 'checkbox', checked: 'checked' });

    equal(check1.checked, false, 'should return input Elements that are checked');
    ok(check2.checked, false, 'should return input Elements that are checked')
    ok(check2.checked, false, 'should return input Elements that are checked');
  })();

  (function(){
    var div = new Element('div', { 'html':
      '<select multiple="multiple" name="select[]">' +
      '<option value="" name="none">--</option>' +
      '<option value="volvo" name="volvo">Volvo</option>' +
      '<option value="saab" name="saab" selected="selected">Saab</option>' +
      '<option value="opel" name="opel" selected="selected">Opel</option>' +
      '<option value="bmw" name="bmw">BMW</option>' +
      '</select>'
    });

    var select1 = div.getFirst();
    var select2 = new Element('select', { name: 'select[]', multiple: true }).adopt(
      new Element('option', { name: 'none', value: '', html: '--' }),
      new Element('option', { name: 'volvo', value: 'volvo', html: 'Volvo' }),
      new Element('option', { name: 'saab', value: 'saab', html: 'Saab', selected: true }),
      new Element('option', { name: 'opel', value: 'opel', html: 'Opel', selected: 'selected' }),
      new Element('option', { name: 'bmw', value: 'bmw', html: 'BMW' })
    );

    ok(select1.multiple, 'should return input Elements that are checked');
    ok(select2.multiple, 'should return input Elements that are checked');

    equal(select1.name, select2.name, 'should return input Elements that are checked');
    equal(select1.options.length, select2.options.length, 'should return input Elements that are checked');
    equal(select1.toQueryString(), select2.toQueryString(), 'should return input Elements that are checked');
  })();

});

test('Element.set', function() {

  (function(){
    var div = new Element('div').set('id', 'some_id');
    equal(div.id, 'some_id', 'should set a single attribute of an Element');
  })();

  (function(){
    var input1 = new Element('input', {type: 'checkbox'}).set('checked', 'checked');
    var input2 = new Element('input', {type: 'checkbox'}).set('checked', true);
    ok(input1.checked, 'should set the checked attribute of an Element');
    ok(input2.checked, 'should set the checked attribute of an Element');
  })();

  (function(){
    var div = new Element('div').set('class', 'some_class');
    equal(div.className, 'some_class', 'should set the class name of an element');
  })();

  (function(){
    var input = new Element('input', {type: 'text'}).set('for', 'some_element');
    equal(input.htmlFor, 'some_element', 'should set the for attribute of an element');
  })();

  (function(){
    var html = '<a href="http://mootools.net/">Link</a>';
    var parent = new Element('div').set('html', html);
    equal(parent.innerHTML.toLowerCase(), html.toLowerCase(), 'should set the html of an Element');
  })();

  (function(){
    var html = ['<p>Paragraph</p>', '<a href="http://mootools.net/">Link</a>'];
    var parent = new Element('div').set('html', html);
    equal(parent.innerHTML.toLowerCase(), html.join('').toLowerCase(), 'should set the html of an Element with multiple arguments');
  })();

  (function(){
    var html = '<option>option 1</option><option selected="selected">option 2</option>';
    var select = new Element('select').set('html', html);
    equal(select.getChildren().length, 2, 'should set the html of a select Element');
    equal(select.options.length, 2, 'should set the html of a select Element');
    equal(select.selectedIndex, 1, 'should set the html of a select Element');
  })();

  (function(){
    var html = '<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr></tbody>';
    var table = new Element('table').set('html', html);
    equal(table.getChildren().length, 1, 'should set the html of a table Element');
    equal(table.getFirst().getFirst().getChildren().length, 2, 'should set the html of a table Element');
    equal(table.getFirst().getLast().getFirst().className, 'cell', 'should set the html of a table Element');
  })();

  (function(){
    var html = '<tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr>';
    var tbody = new Element('tbody').inject(new Element('table')).set('html', html);
    equal(tbody.getChildren().length, 2, 'should set the html of a tbody Element');
    equal(tbody.getLast().getFirst().className, 'cell', 'should set the html of a tbody Element');
  })();

  (function(){
    var html = '<td class="cell">cell 1</td><td>cell 2</td>';
    var tr = new Element('tr').inject(new Element('tbody').inject(new Element('table'))).set('html', html);
    equal(tr.getChildren().length, 2, 'should set the html of a tr Element');
    equal(tr.getFirst().className, 'cell', 'should set the html of a tr Element');
  })();

  (function(){
    var html = '<span class="span">Some Span</span><a href="#">Some Link</a>';
    var td = new Element('td').inject(new Element('tr').inject(new Element('tbody').inject(new Element('table')))).set('html', html);
    equal(td.getChildren().length, 2, 'should set the html of a td Element');
    equal(td.getFirst().className, 'span', 'should set the html of a td Element');
  })();

  (function(){
    var style = 'font-size:12px;line-height:23px;';
    var div = new Element('div').set('style', style);
    equal(div.style.lineHeight, '23px', 'should set the style attribute of an Element');
    equal(div.style.fontSize, '12px', 'should set the style attribute of an Element');
  })();

  (function(){
    var div = new Element('div').set('text', 'some text content');
    equal(div.get('text'), 'some text content', 'should set the text of an element');
    equal(div.innerHTML, 'some text content', 'should set the text of an element');
  })();

  (function(){
    var div = new Element('div').set({ id: 'some_id', 'title': 'some_title', 'html': 'some_content' });
    equal(div.id, 'some_id', 'should set multiple attributes of an Element');
    equal(div.title, 'some_title', 'should set multiple attributes of an Element');
    equal(div.innerHTML, 'some_content', 'should set multiple attributes of an Element');

  (function(){
    var script = new Element('script').set({ type: 'text/javascript', defer: 'defer' });
    equal(script.type, 'text/javascript', 'should set various attributes of a script Element');
    ok(script.defer, 'should set various attributes of a script Element');
  })();

  (function(){
    var table1 = new Element('table').set({ border: '2', cellpadding: '3', cellspacing: '4', align: 'center' });
    var table2 = new Element('table').set({ cellPadding: '3', cellSpacing: '4' });
    equal(table1.border, 2, 'should set various attributes of a table Element');
    equal(table1.cellPadding, 3, 'should set various attributes of a table Element');
    equal(table2.cellPadding, 3, 'should set various attributes of a table Element');
    equal(table1.cellSpacing, 4, 'should set various attributes of a table Element');
    equal(table2.cellSpacing, 4, 'should set various attributes of a table Element');
    equal(table1.align, 'center', 'should set various attributes of a table Element');
  })();

});

var myElements = new Elements([
  new Element('div'),
  document.createElement('a'),
  new Element('div', {id: 'el-' + $time()})
]);

test('Elements', function() {

  (function(){
    ok(Array.type(myElements), 'should return an array type');
    ok(myElements.every(Element.type), 'should return an array of Elements');
    ok($defined(myElements.addEvent), 'should apply Element prototypes to the returned array');
  })();

  (function(){
    same(myElements.filter('div'), [myElements[0], myElements[2]], 'should return all Elements that match the string matcher');
  })();

  (function(){
    var elements = myElements.filter(function(element){
      return element.match('a');
    });
    same(elements, [myElements[1]], 'should return all Elements that match the comparator');
  })();

});

test('TextNode.constructor', function() {

  var text = document.newTextNode('yo');
  equal($type(text), 'textnode', 'should return a new textnode element');

});

test('IFrame constructor', function() {

  (function(){
    var iFrame1 = document.createElement('iframe');
    var iFrame2 = new IFrame();
    equal(iFrame1.tagName, iFrame2.tagName, 'should return a new IFrame');
  })();

  (function(){
    var iFrame1 = document.createElement('iframe');
    var iFrame2 = new IFrame(iFrame1);
    equal(iFrame1, iFrame2, 'should return the same IFrame if passed');
  })();

});

test('$', function() {

  //before all
  var before = function(){
    Container = document.createElement('div');
    Container.innerHTML = '<div id="dollar"></div>';
    document.body.appendChild(Container);
  }

  var after = function(){
    document.body.removeChild(Container);
    Container = null;
  }

  (function(){
    before();
    var dollar1 = document.getElementById('dollar');
    var dollar2 = $('dollar');

    equal(dollar1, dollar2, 'should return an extended Element by string id');
    ok($defined(dollar1.addEvent), 'should return an extended Element by string id');
    after();
  })();

  (function(){
    before();
    same($(window), window, 'should return the window if passed');
    after();
  })();

  (function(){
    before();
    same($(document), document, 'should return the document if passed');
    after();
  })();

  (function(){
    before();
    equal($(1), null, 'should return null if string not found or type mismatch');
    equal($('nonexistant'), null, 'should return null if string not found or type mismatch');
    after();
  })();

});

test('$$', function() {

  var divs1 = $$('div');
  var divs2 = Array.flatten(document.getElementsByTagName('div'));
  same(divs1, divs2, 'should return all Elements of a specific tag');

  var headers1 = $$('h3', 'h4');
  var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
  same(headers1, headers2, 'should return multiple Elements for each specific tag');

  same($$('not_found'), [], 'should return an empty array if not is found');

});

test('getDocument', function() {

  (function(){
    var doc = document.newElement('div').getDocument();
    same(doc, document, 'should return the owner document for elements');
  })();

  (function(){
    var doc = window.getDocument();
    same(doc, document, 'should return the owned document for window');
  })();

  (function(){
    var doc = document.getDocument();
    same(doc, document, 'should return self for document');
  })();

});

test('getWindow', function() {

  (function(){
    var win = document.newElement('div').getWindow();
    same(win, window, 'should return the owner window for elements');
  })();

  (function(){
    var win = document.getWindow();
    same(win, window, 'should return the owner window for document');
  })();

  (function(){
    var win = window.getWindow();
    same(win, window, 'should return self for window');
  })();

});

test('Element.getElement', function() {

  Container = new Element('div');
  Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';

  var child = Container.getElement('div');
  equal(child.id, 'first', 'should return the first Element to match the tag, otherwise null');
  equal(Container.getElement('iframe'), null, 'should return the first Element to match the tag, otherwise null');

  Container = null;

});

test('Element.getElements', function() {

  var before = function(){
    Container = new Element('div');
    Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
  }

  var after = function(){
    Container = null;
  }

  (function(){
    before();
    var children = Container.getElements('div');
    console.info('looking at children!');
    console.info(children);
    //value_of(children).should_have(2, 'items'); //should return all the elements that match the tag
    after();
  })();

  (function(){
    before();
    var children = Container.getElements('div,a');
    // value_of(children).should_have(3, 'items');
    equal(children[2].tagName.toLowerCase(), 'a', 'should return all the elements that match the tags');
    after();
  })();

});

test('Document.getElement', function() {

    var div = document.getElement('div');
    var ndiv = document.getElementsByTagName('div')[0];
    same(div, ndiv, 'should return the first Element to match the tag, otherwise null');

    var notfound = document.getElement('canvas');
    equal(notfound, null, 'should return the first Element to match the tag, otherwise null');

});

test('Document.getElements', function() {

    var divs = document.getElements('div');
    var ndivs = $A(document.getElementsByTagName('div'));
    same(divs, ndivs, 'should return all the elements that match the tag');

    var headers = document.getElements('h3,h4');
    var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
    equal(headers.length, headers2.length, 'should return all the elements that match the tags');

});

test('Element.getElementById', function() {

  Container = new Element('div');
  Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
  document.body.appendChild(Container);

  same(Container.getElementById('first'), Container.childNodes[0], 'should getElementById that matches the id, otherwise null');
  equal(Container.getElementById('not_found'), null, 'should getElementById that matches the id, otherwise null');

  document.body.removeChild(Container);
  Container = null;

});

test('Element.get style', function() {

  var style = 'font-size:12px;color:rgb(255,255,255)';
  var myElement = new Element('div').set('style', style);
  //value_of(myElement.get('style').toLowerCase().replace(/\s/g, '').replace(/;$/, '')).should_match(/(font-size:12px;color:rgb\(255,255,255\))|(color:rgb\(255,255,255\);font-size:12px)/); // should return a CSS string representing the Element's styles
  //I'm replacing these characters (space and the last semicolon) as they are not vital to the style, and browsers sometimes include them, sometimes not.

});

test('Element.get tag', function() {

  var myElement = new Element('div');
  equal(myElement.get('tag'), 'div', "should return the Element's tag");

});

test('Element.get', function() {

  (function(){
    var link = new Element('a', {href: "http://google.com/"});
    equal(link.get('href'), "http://google.com/", 'should get an absolute href');
  })();

  (function(){
    var link = new Element('a', {href: window.location.href});
    equal(link.get('href'), window.location.href, 'should get an absolute href to the same domain');
  })();

  (function(){
    var link = new Element('a', {href: "../index.html"});
    equal(link.get('href'), "../index.html", 'should get a relative href');
  })();

  (function(){
    var link = new Element('a', {href: "/developers"});
    equal(link.get('href'), "/developers", 'should get a host absolute href');
  })();

  (function(){
    var link = new Element('a');
    equal(link.get('href'), null, 'should return null when attribute is missing');
  })();

});

test('Element.erase', function() {

  (function(){
    var myElement = new Element('a', {href: 'http://mootools.net/', title: 'mootools!'});
    equal(myElement.get('title'), 'mootools!', "should erase an Element's property");
    equal(myElement.erase('title').get('title'), null, "should erase an Element's property");
  })();

  (function(){
    var myElement = new Element('div', {style: "color:rgb(255, 255, 255); font-size:12px;"});
    myElement.erase('style');
    equal(myElement.get('style'), '', "should erase an Element's style");
  })();

});

test('Element.match', function() {

  (function(){
    var element = new Element('div');
    ok(element.match(), 'should return true if tag is not provided');
  })();

  (function(){
    var element = new Element('div');
    ok(element.match('div'), "should return true if the Element's tag matches");
  })();

});

test('Element.inject', function() {

  var before = function(){
    var html = ['<div id="first"></div>','<div id="second">','<div id="first-child"></div>','<div id="second-child"></div>','</div>'].join('');
    Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html});
    document.body.appendChild(Container);

    test = new Element('div', {id:'inject-test'});
  }

  var after = function(){
    document.body.removeChild(Container);
    Container.set('html', '');
    Container = null;
    test = null;
  }

  (function(){
    before();
    test.inject($('first'), 'before');
    same(Container.childNodes[0], test, 'should inject the Element before an Element');

    test.inject($('second-child'), 'before');
    same(Container.childNodes[1].childNodes[1], test, 'should inject the Element before an Element');
    after();
  })();

  (function(){
    before();
    test.inject($('first'), 'after');
    same(Container.childNodes[1], test, 'should inject the Element after an Element');

    test.inject($('first-child'), 'after');
    same(Container.childNodes[1].childNodes[1], test, 'should inject the Element after an Element');
    after();
  })();

  (function(){
    before();
    var first = $('first');
    test.inject(first, 'bottom');
    same(first.childNodes[0], test, 'should inject the Element at bottom of an Element');

    var second = $('second');
    test.inject(second, 'bottom');
    same(second.childNodes[2], test, 'should inject the Element at bottom of an Element');

    test.inject(Container, 'bottom');
    same(Container.childNodes[2], test, 'should inject the Element at bottom of an Element');
    after();
  })();

  (function(){
    before();
    var first = $('first');
    test.inject(first, 'inside');
    same(first.childNodes[0], test, 'should inject the Element inside an Element');

    var second = $('second');
    test.inject(second, 'inside');
    same(second.childNodes[2], test, 'should inject the Element inside an Element');

    test.inject(Container, 'inside');
    same(Container.childNodes[2], test, 'should inject the Element inside an Element');
    after();
  })();

  (function(){
    before();
    test.inject(Container, 'top');
    same(Container.childNodes[0], test, 'should inject the Element at the top of an Element');

    var second = $('second');
    test.inject(second, 'top');
    same(second.childNodes[0], test, 'should inject the Element at the top of an Element');
    after();
  })();

  (function(){
    before();
    var first = $('first');
    test.inject(first);
    same(first.childNodes[0], test, 'should inject the Element in an Element');

    var second = $('second');
    test.inject(second);
    same(second.childNodes[2], test, 'should inject the Element in an Element');

    test.inject(Container);
    same(Container.childNodes[2], test, 'should inject the Element in an Element');
    after();
  })();

});

test('Element.replaces', function() {

  var parent = new Element('div');
  var div = new Element('div', {id: 'original'}).inject(parent);
  var el = new Element('div', {id: 'replaced'});
  el.replaces(div);
  same(parent.childNodes[0], el, 'should replace an Element with the Element');

});

test('Element.grab', function() {

  var before = function(){
    var html = [
      '<div id="first"></div>',
      '<div id="second">',
      '<div id="first-child"></div>',
      '<div id="second-child"></div>',
      '</div>'
      ].join('');
      Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html}).inject(document.body);

      test = new Element('div', {id:'grab-test'});
  }

  var after = function(){
    document.body.removeChild(Container);
    Container.set('html', '');
    Container = null;
    test = null;
  }

  (function(){
    before();
    $('first').grab(test, 'before');
    same(Container.childNodes[0], test, 'should grab the Element before this Element');

    $('second-child').grab(test, 'before');
    same(Container.childNodes[1].childNodes[1], test, 'should grab the Element before this Element');
    after();
  })();

  (function(){
    before();
    $('first').grab(test, 'after');
    same(Container.childNodes[1], test, 'should grab the Element after this Element');

    $('first-child').grab(test, 'after');
    same(Container.childNodes[1].childNodes[1], test, 'should grab the Element after this Element');
    after();
  })();

  (function(){
    before();
    var first = $('first');
    first.grab(test, 'bottom');
    same(first.childNodes[0], test, 'should grab the Element at the bottom of this Element');

    var second = $('second');
    second.grab(test, 'bottom');
    same(second.childNodes[2], test, 'should grab the Element at the bottom of this Element');

    Container.grab(test, 'bottom');
    same(Container.childNodes[2], test, 'should grab the Element at the bottom of this Element');
    after();
  })();

  (function(){
    before();
    var first = $('first');
    first.grab(test, 'inside');
    same(first.childNodes[0], test, 'should grab the Element inside this Element');

    var second = $('second');
    second.grab(test, 'inside');
    same(second.childNodes[2], test, 'should grab the Element inside this Element');

    Container.grab(test, 'inside');
    same(Container.childNodes[2], test, 'should grab the Element inside this Element');
    after();
  })();

  (function(){
    before();
    Container.grab(test, 'top');
    same(Container.childNodes[0], test, 'should grab the Element at the top of this Element');

    var second = $('second');
    second.grab(test, 'top');
    same(second.childNodes[0], test, 'should grab the Element at the top of this Element');
    after();
  })();

  (function(){
    before();
    var first = $('first').grab(test);
    same(first.childNodes[0], test, 'should grab an Element in the Element');

    var second = $('second').grab(test);
    same(second.childNodes[2], test, 'should grab an Element in the Element');

    Container.grab(test);
    same(Container.childNodes[2], test, 'should grab an Element in the Element');
    after();
  })();

});

test('Element.wraps', function() {

  var div = new Element('div');
  var child = new Element('p').inject(div);

  var wrapper = new Element('div', {id: 'wrapper'}).wraps(div.childNodes[0]);
  same(div.childNodes[0], wrapper, 'should replace and adopt the Element');
  same(wrapper.childNodes[0], child, 'should replace and adopt the Element');

});

test('Element.appendText', function() {

  Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;'}).inject(document.body);

  var before = function(){
    var html = [
      '<div id="first"></div>',
      '<div id="second">',
      '<div id="first-child"></div>',
      '<div id="second-child"></div>',
      '</div>'
      ].join('');
      Container.set('html', html);
  }

  var after = function(){
    document.body.removeChild(Container);
    Container.set('html', '');
    Container = null;
    test = null;
  }

  (function(){
    before();
    $('first').appendText('test', 'before');
    equal(Container.childNodes[0].nodeValue, 'test', 'should append a TextNode before this Element');

    $('second-child').appendText('test', 'before');
    equal(Container.childNodes[2].childNodes[1].nodeValue, 'test', 'should append a TextNode before this Element');
    after();
  })();


  (function(){
    before();
    $('first').appendText('test', 'after');
    equal(Container.childNodes[1].nodeValue, 'test', 'should append a TextNode the Element after this Element');

    $('first-child').appendText('test', 'after');
    equal(Container.childNodes[2].childNodes[1].nodeValue, 'test', 'should append a TextNode the Element after this Element');
    after();
  })();


  (function(){
    before();
    var first = $('first');
    first.appendText('test', 'bottom');
    equal(first.childNodes[0].nodeValue, 'test', 'should append a TextNode the Element at the bottom of this Element');

    var second = $('second');
    second.appendText('test', 'bottom');
    equal(second.childNodes[2].nodeValue, 'test', 'should append a TextNode the Element at the bottom of this Element');

    Container.appendText('test', 'bottom');
    equal(Container.childNodes[2].nodeValue, 'test', 'should append a TextNode the Element at the bottom of this Element');
    after();
  })();


  (function(){
    before();
    var first = $('first');
    first.appendText('test', 'inside');
    equal(first.childNodes[0].nodeValue, 'test', 'should append a TextNode the Element inside this Element');

    var second = $('second');
    second.appendText('test', 'inside');
    equal(second.childNodes[2].nodeValue, 'test', 'should append a TextNode the Element inside this Element');

    Container.appendText('test', 'inside');
    equal(Container.childNodes[2].nodeValue, 'test', 'should append a TextNode the Element inside this Element');
    after();
  })();


  (function(){
    before();
    Container.appendText('test', 'top');
    equal(Container.childNodes[0].nodeValue, 'test', 'should append a TextNode the Element at the top of this Element');

    var second = $('second');
    second.appendText('test', 'top');
    equal(second.childNodes[0].nodeValue, 'test', 'should append a TextNode the Element at the top of this Element');
    after();
  })();


  (function(){
    before();
    var first = $('first').appendText('test');
    equal(first.childNodes[0].nodeValue, 'test', 'should append a TextNode an Element in the Element');

    var second = $('second').appendText('test');
    equal(second.childNodes[2].nodeValue, 'test', 'should append a TextNode an Element in the Element');

    Container.appendText('test');
    equal(Container.childNodes[2].nodeValue, 'test', 'should append a TextNode an Element in the Element');
    after();
  })();

});

test('Element.adopt', function() {

  // before all
  Container = new Element('div').inject(document.body);

  var before = function(){
    Container.empty();
  }

  (function(){
    before();
    var child = new Element('div', {id: 'adopt-me'});
    document.body.appendChild(child);
    Container.adopt('adopt-me');
    same(Container.childNodes[0], child, 'should adopt an Element by its id');
  })();


  (function(){
    before();
    var child = new Element('p');
    Container.adopt(child);
    same(Container.childNodes[0], child, 'should adopt an Element');
  })();


  (function(){
    before();
    var children = [];
    (4).times(function(i){ children[i] = new Element('span', {id: 'child-' + i}); });
    Container.adopt(children);
    //value_of(Container.childNodes).should_have(4, 'items');
    same(Container.childNodes[3], children[3], 'should adopt any number of Elements or ids');
  })();

  // after all
  document.body.removeChild(Container);
  Container.set('html', '');
  Container = null;

});

test('Element.dispose', function() {

  // before all
  Container = new Element('div').inject(document.body);

  var child = new Element('div').inject(Container);
  child.dispose();
  equal(Container.childNodes.length, 0, 'should dispose the Element from the DOM');

  // after all
  document.body.removeChild(Container);
  Container.set('html', '');
  Container = null;

});

test('Element.clone', function() {

  // before all
  Container = new Element('div', {'id': 'outer', 'class': 'moo'});
  Container.innerHTML = '<span class="foo" id="inner1"><div class="movie" id="sixfeet">under</div></span><span id="inner2"></span>';


  (function(){
    var div = new Element('div');
    var clone = div.clone();
    ok(div != clone, 'should return a clone');
    equal($type(div), 'element', 'should return a clone');
    equal($type(clone), 'element', 'should return a clone');
  })();


  (function(){
    var clone = Container.clone();
    equal(clone.getElementsByTagName('*').length, 3, 'should remove id from clone and clone children by default');
    equal(clone.className, 'moo', 'should remove id from clone and clone children by default');
    equal(clone.id, '', 'should remove id from clone and clone children by default');
    equal(Container.id, 'outer', 'should remove id from clone and clone children by default');
  })();


  (function(){
    var clone = Container.clone(true);
    equal(clone.id, '', 'should remove all ids');
    equal(clone.childNodes.length, 2, 'should remove all ids');
    equal(clone.childNodes[0].id, '', 'should remove all ids');
    equal(clone.childNodes[0].childNodes[0].id, '', 'should remove all ids');
    equal(clone.childNodes[0].className, 'foo', 'should remove all ids');
  })();


  (function(){
    var clone = Container.clone(true, true);
    equal(clone.id, 'outer', 'should keep id if specified');
    equal(clone.childNodes.length, 2, 'should keep id if specified');
    equal(clone.childNodes[0].id, 'inner1', 'should keep id if specified');
    equal(clone.childNodes[0].childNodes[0].id, 'sixfeet', 'should keep id if specified');
    equal(clone.childNodes[0].className, 'foo', 'should keep id if specified');
  })();


  (function(){
    var clone = new Element('div', {
      html: '<a href="">empty anchor</a>'
      }).getFirst().clone();

      equal(clone.getAttribute('href', 2), '', 'should clone empty href attribute');

      Container.store('drink', 'milk');
      var clone = Container.clone();
      equal(clone.retrieve('drink'), null, 'should not clone Element Storage');
      equal(Container.retrieve('drink'), 'milk', 'should not clone Element Storage');
    })();



    (function(){
      var cloned = Container.clone(true).getElements('*');
      var old = Container.getElements('*');
      equal(cloned.length, 3, 'should clone child nodes and not copy their uid');
      equal(old.length, 3, 'should clone child nodes and not copy their uid');
      equal($$(old, cloned).length, 6, 'should clone child nodes and not copy their uid');
    })();


    (function(){
      var inputs = new Element('div', { 'html': '' +
      '<input id="input1" type="text" value="Some Value" />' +
      '<input id="input2" type="text" />'
      }).getChildren();

      var input1 = inputs[0].clone();
      var input2 = inputs[1].clone(false, true);

      ok(!input1.id, 'should clone a text input and retain value');
      equal(input2.id, 'input2', 'should clone a text input and retain value');
      equals(input1.value, 'Some Value', 'should clone a text input and retain value');
      equals(input2.value, '', 'should clone a text input and retain value');
    })();



    (function(){
      var textareas = new Element('div', { 'html': '' +
      '<textarea id="textarea1"></textarea>' +
      '<textarea id="textarea2">Some-Text-Here</textarea>'
      }).getChildren();

      var textarea1 = textareas[0].clone();
      var textarea2 = textareas[1].clone(false, true);

      ok(!textarea1.id, 'should clone a textarea and retain value');
      equal(textarea2.id, 'textarea2', 'should clone a textarea and retain value');
      equal(textarea1.value, '', 'should clone a textarea and retain value');
      equal(textarea2.value, 'Some-Text-Here', 'should clone a textarea and retain value');
    })();



    (function(){
      var checks = new Element('div', { 'html': '' +
      '<input id="check1" type="checkbox" />' +
      '<input id="check2" type="checkbox" checked="checked" />'
      }).getChildren();

      var check1 = checks[0].clone();
      var check2 = checks[1].clone(false, true);

      ok(!check1.id, 'should clone a checkbox and retain checked state');
      equal(check2.id, 'check2', 'should clone a checkbox and retain checked state');
      equal(check1.checked, false, 'should clone a checkbox and retain checked state');
      equal(check2.checked, 'should clone a checkbox and retain checked state');
    })();


    (function(){
      var selects = new Element('div', { 'html': '' +
      '<select name="select" id="select1">' +
      '<option>--</option>' +
      '<option value="volvo">Volvo</option>' +
      '<option value="saab">Saab</option>' +
      '<option value="opel" selected="selected">Opel</option>' +
      '<option value="bmw">BMW</option>' +
      '</select>' +
      '<select name="select[]" id="select2" multiple="multiple">' +
      '<option>--</option>' +
      '<option value="volvo">Volvo</option>' +
      '<option value="saab">Saab</option>' +
      '<option value="opel" selected="selected">Opel</option>' +
      '<option value="bmw" selected="selected">BMW</option>' +
      '</select>'
      }).getChildren();

      var select1 = selects[0].clone(true);
      var select2 = selects[1].clone(true, true);

      ok(!select1.id, 'should clone a select and retain selected state');
      equal(select2.id, 'select2', 'should clone a select and retain selected state');
      equal(select1.selectedIndex, 3, 'should clone a select and retain selected state');
      ok(select2.options[3].selected, 'should clone a select and retain selected state');
      ok(select2.options[4].selected, 'should clone a select and retain selected state');
    })();


    (function(){
      var div = new Element('div');
      div.setAttribute('foo', 'FOO');
      div.setAttribute('bar', ['BAR']);
      var clone = div.clone();

      equal(clone.getAttribute('foo'), 'FOO', 'should clone custom attributes');
      same(clone.getAttribute('bar'), ['BAR'], 'should clone custom attributes');
    })();

  // after all
  Container = null;

});

test('Element className methods', function() {

  (function(){
    var div = new Element('div', {'class': 'header bold'});
    ok(div.hasClass('header'), 'should return true if the Element has the given class');
    ok(div.hasClass('bold'), 'should return true if the Element has the given class');
    equals(div.hasClass('random'), false, 'should return true if the Element has the given class');
  })();

  (function(){
    var div = new Element('div');
    div.addClass('myclass');
    ok(div.hasClass('myclass'), 'should add the class to the Element');
  })();

  (function(){
    var div = new Element('div', {'class': 'myclass'});
    div.addClass('aclass');
    ok(div.hasClass('aclass'), 'should append classes to the Element');
  })();

  (function(){
    var div = new Element('div', {'class': 'myclass'});
    div.removeClass('myclass');
    equal(div.hasClass('myclass'), false, 'should remove the class in the Element');
  })();

  (function(){
    var div = new Element('div', {'class': 'myclass aclass'});
    div.removeClass('myclass');
    equal(div.hasClass('myclass'), false, 'should only remove the specific class');
  })();

  (function(){
    var div = new Element('div', {'class': 'myclass'});
    div.removeClass('extra');
    ok(div.hasClass('myclass'), 'should not remove any class if the class is not found');
  })();

  (function(){
    var div = new Element('div');
    div.toggleClass('myclass');
    ok(div.hasClass('myclass'), 'should add the class if the Element does not have the class');
  })();

  (function(){
    var div = new Element('div', {'class': 'myclass'});
    div.toggleClass('myclass');
    equal(div.hasClass('myclass'), 'should remove the class if the Element does have the class');
  })();

});

test('Element.empty', function() {

  var children = [];
  (5).times(function(i){ children[i] = new Element('p'); });
  var div = new Element('div').adopt(children);
  div.empty();
  equal(div.get('html'), '', 'should remove all children');

});

test('Element.destroy', function() {

  var div = new Element('div', {id: 'destroy-test'}).inject(document.body);
  var result = div.destroy();
  equal(result, null, 'should obliterate the Element from the universe');
  equal($('destroy-test'), null, 'should obliterate the Element from the universe');

});

test('Element.toQueryString', function() {

  (function(){
  var div = new Element('div');
  equal(div.toQueryString(), '', 'should return an empty string for an Element that does not have form Elements');
  })();

  (function(){
  var form = new Element('form').adopt(
    new Element('input', { name: 'input', disabled: true, type: 'checkbox', checked: true, value: 'checked' }),
    new Element('select').adopt(
      new Element('option', { name: 'volvo', value: false, html: 'Volvo' }),
    new Element('option', { value: 'saab', html: 'Saab', selected: true })
    ),
  new Element('textarea', { name: 'textarea', disabled: true, value: 'textarea-value' })
);
equal(form.toQueryString(), '', 'should ignore any form Elements that do not have a name, disabled, or whose value is false');
  })();

  (function(){
var form = new Element('form', { 'html': '' +
'<input type="checkbox" name="input" value="checked" checked="checked" />' +
'<select name="select[]" multiple="multiple" size="5">' +
'<option name="none" value="">--</option>' +
'<option name="volvo" value="volvo">Volvo</option>' +
'<option name="saab" value="saab" selected="selected">Saab</option>' +
'<option name="opel" value="opel" selected="selected">Opel</option>' +
'<option name="bmw" value="bmw">BMW</option>' +
'</select>' +
'<textarea name="textarea">textarea-value</textarea>'
        });
        equal(form.toQueryString(), 'input=checked&select[]=saab&select[]=opel&textarea=textarea-value', "should return a query string from the Element's form Elements");
  })();

  (function(){
    var form = new Element('form').adopt(
      new Element('input', {name: 'input', type: 'checkbox', checked: true, value: ''}),
      new Element('select', {name: 'select[]'}).adopt(
        new Element('option', {name: 'none', value: '', html: '--', selected: true}),
        new Element('option', {name: 'volvo', value: 'volvo', html: 'Volvo'}),
        new Element('option', {name: 'saab', value: 'saab', html: 'Saab'}),
        new Element('option', {name: 'opel', value: 'opel', html: 'Opel'}),
      new Element('option', {name: 'bmw', value: 'bmw', html: 'BMW'})
      ),
    new Element('textarea', {name: 'textarea', value: ''}));
    equal(form.toQueryString(), 'input=&select[]=&textarea=', "should return a query string containing even empty values, single select must have a selected option");
    equal(form.getElementsByTagName('select')[0].selectedIndex, 0, "should return a query string containing even empty values, single select must have a selected option");
  })();

  (function(){
    var form = new Element('form',{'html':
      '<input type="checkbox" name="input" value="" checked="checked" />' +
      '<select name="select[]" multiple="multiple" size="5">' +
      '<option name="none" value="">--</option>' +
      '<option name="volvo" value="volvo">Volvo</option>' +
      '<option name="saab" value="saab">Saab</option>' +
      '<option name="opel" value="opel">Opel</option>' +
      '<option name="bmw" value="bmw">BMW</option>' +
      '</select>' +
      '<textarea name="textarea"></textarea>'
    });
    equal(form.toQueryString(), 'input=&textarea=', "should return a query string containing even empty values, multiple select may have no selected options");
  })();

  (function(){
    var form = new Element('form', { 'html': '' +
      '<input type="checkbox" name="input" value="checked" checked="checked" />' +
      '<input type="file" name="file" />' +
      '<textarea name="textarea">textarea-value</textarea>' +
      '<input type="submit" name="go" value="Go" />' +
      '<input type="reset" name="cancel" value="Reset" />'
    });
    equal(form.toQueryString(), 'input=checked&textarea=textarea-value', "should return a query string ignoring submit, reset and file form Elements");
  })();

});

test('Element.getProperty', function() {

  (function(){
    var anchor1 = new Element('a');
    anchor1.href = 'http://mootools.net';
    equal(anchor1.getProperty('href'), 'http://mootools.net', 'should getProperty from an Element');

    var anchor2 = new Element('a');
    anchor2.href = '#someLink';
    equal(anchor2.getProperty('href'), '#someLink', 'should getProperty from an Element');
  })();

  (function(){
    var input1 = new Element('input', {type: 'text'});
    equal(input1.getProperty('type'), 'text', 'should getProperty type of an input Element');

    var input2 = new Element('input', {type: 'checkbox'});
    equal(input2.getProperty('type'), 'checkbox', 'should getProperty type of an input Element');

    var div = new Element('div', {'html':
    '<select name="test" id="test" multiple="multiple">' + 
    '<option value="1">option-value</option>' +
    '</select>'
    });

    var input3 = div.getElement('select');
    equal(input3.getProperty('type'), 'select-multiple', 'should getProperty type of an input Element');
    equal(input3.getProperty('name'), 'test', 'should getProperty type of an input Element');
  })();

  (function(){
    var checked1 = new Element('input', { type: 'checkbox' });
    checked1.checked = 'checked';
    ok(checked1.getProperty('checked'), 'should getPropety checked from an input Element');

    var checked2 = new Element('input', { type: 'checkbox' });
    checked2.checked = true;
    ok(checked2.getProperty('checked'), 'should getPropety checked from an input Element');

    var checked3 = new Element('input', { type: 'checkbox' });
    checked3.checked = false;
    equal(checked3.getProperty('checked'), false, 'should getPropety checked from an input Element');
  })();

  (function(){
    var disabled1 = new Element('input', { type: 'text' });
    disabled1.disabled = 'disabled';
    ok(disabled1.getProperty('disabled'), 'should getProperty disabled from an input Element');

    var disabled2 = new Element('input', { type: 'text' });
    disabled2.disabled = true;
    ok(disabled2.getProperty('disabled'), 'should getProperty disabled from an input Element');

    var disabled3 = new Element('input', { type: 'text' });
    disabled3.disabled = false;
    equal(disabled3.getProperty('disabled'), false, 'should getProperty disabled from an input Element');
  })();

  (function(){
    var readonly1 = new Element('input', { type: 'text' });
    readonly1.readOnly = 'readonly';
    ok(readonly1.getProperty('readonly'), 'should getProperty readonly from an input Element');

    var readonly2 = new Element('input', { type: 'text' });
    readonly2.readOnly = true;
    ok(readonly2.getProperty('readonly'), 'should getProperty readonly from an input Element');

    var readonly3 = new Element('input', { type: 'text' });
    readonly3.readOnly = false;
    equal(readonly3.getProperty('readonly'), false, 'should getProperty readonly from an input Element');
  })();

});

test('Element.setProperty', function() {

  (function(){
    var anchor1 = new Element('a').setProperty('href', 'http://mootools.net/');
    equal(anchor1.getProperty('href'), 'http://mootools.net/', 'should setProperty from an Element');

    var anchor2 = new Element('a').setProperty('href', '#someLink');
    equal(anchor2.getProperty('href'), '#someLink', 'should setProperty from an Element');
  })();

  (function(){

    var input1 = new Element('input').setProperty('type', 'text');
    equal(input1.getProperty('type'), 'text', 'should setProperty type of an input Element');

    var input2 = new Element('input').setProperty('type', 'checkbox');
    equal(input2.getProperty('type'), 'checkbox', 'should setProperty type of an input Element');
  })();

  (function(){

    var checked1 = new Element('input', { type: 'checkbox' }).setProperty('checked', 'checked');
    ok(checked1.getProperty('checked'), 'should setProperty checked from an input Element');

    var checked2 = new Element('input', { type: 'checkbox' }).setProperty('checked', true);
    ok(checked2.getProperty('checked'), 'should setProperty checked from an input Element');

    var checked3 = new Element('input', { type: 'checkbox' }).setProperty('checked', false);
    equal(checked3.getProperty('checked'), false, 'should setProperty checked from an input Element');
  })();

  (function(){

    var disabled1 = new Element('input', { type: 'text' }).setProperty('disabled', 'disabled');
    ok(disabled1.getProperty('disabled'), 'should setProperty disabled of an input Element');

    var disabled2 = new Element('input', { type: 'text' }).setProperty('disabled', true);
    ok(disabled2.getProperty('disabled'), 'should setProperty disabled of an input Element');

    var disabled3 = new Element('input', { type: 'text' }).setProperty('disabled', false);
    equal(disabled3.getProperty('disabled'), false, 'should setProperty disabled of an input Element');
  })();

  (function(){

    var readonly1 = new Element('input', { type: 'text' }).setProperty('readonly', 'readonly');
    ok(readonly1.getProperty('readonly'), 'should setProperty readonly of an input Element');

    var readonly2 = new Element('input', { type: 'text' }).setProperty('readonly', true);
    ok(readonly2.getProperty('readonly'), 'should setProperty readonly of an input Element');

    var readonly3 = new Element('input', { type: 'text' }).setProperty('readonly', false);
    equal(readonly3.getProperty('readonly'), false, 'should setProperty readonly of an input Element');
  })();

  (function(){

    var form = new Element('form');
    var defaultValue = new Element('input', {'type': 'text', 'value': '321'}).setProperty('defaultValue', '123');
    form.grab(defaultValue);
    equal(defaultValue.getProperty('value'), '321', 'should setProperty defaultValue of an input Element');
    form.reset();
    equal(defaultValue.getProperty('value'), '123', 'should setProperty defaultValue of an input Element');
  })();

});

test('Element.getProperties', function() {

  var readonly = new Element('input', { type: 'text', readonly: 'readonly' });
  var props = readonly.getProperties('type', 'readonly');
  same(props, { type: 'text', readonly: true }, 'should return an object associate with the properties passed');

});

test('Element.setProperties', function() {

  var readonly = new Element('input').setProperties({ type: 'text', readonly: 'readonly' });
  var props = readonly.getProperties('type', 'readonly');
  same(props, { type: 'text', readonly: true }, 'should set each property to the Element');

});

test('Element.removeProperty', function() {

  var readonly = new Element('input', { type: 'text', readonly: 'readonly', maxlenght: 10 });
  readonly.removeProperty('readonly');
  readonly.removeProperty('maxlength');
  var props = readonly.getProperties('type', 'readonly', 'maxlength');
  same(props, { type: 'text', readonly: false, maxlength: Browser.Engine.webkit ? 524288 : 0}, 'should removeProperty from an Element');

});

test('Element.removeProperties', function() {

  var anchor = new Element('a', {href: '#', title: 'title', rel: 'left'});
  anchor.removeProperties('title', 'rel');
  same(anchor.getProperties('href', 'title', 'rel'), { href: '#' }, 'should remove each property from the Element');

});

test('Element.getPrevious', function() {

  (function(){
    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[1].getPrevious(), children[0], 'should return the previous Element, otherwise null');
    equal(children[0].getPrevious(), null, 'should return the previous Element, otherwise null');
  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('a'), new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[1].getPrevious('a'), children[0], 'should return the previous Element that matches, otherwise null');
    equal(children[1].getPrevious('span'), null, 'should return the previous Element that matches, otherwise null');
  })();

});

test('Element.getAllPrevious', function() {

  (function(){
    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[2].getAllPrevious(), [children[1], children[0]], 'should return all the previous Elements, otherwise an empty array');
    same(children[0].getAllPrevious(), [], 'should return all the previous Elements, otherwise an empty array');
  })();

  (function(){
    var container = new Element('div');
    var children = [new Element('a'), new Element('div'), new Element('a'), new Element('div')];
    container.adopt(children);
    same(children[3].getAllPrevious('a'), [children[2], children[0]], 'should return all the previous Elements that match, otherwise an empty array');
    same(children[1].getAllPrevious('span'), [], 'should return all the previous Elements that match, otherwise an empty array');
  })();

});

test('Element.getNext', function() {

  (function(){
    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[1].getNext(), children[2], 'should return the next Element, otherwise null');
    equal(children[2].getNext(), null, 'should return the next Element, otherwise null');
  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div'), new Element('a')];
    container.adopt(children);
    same(children[1].getNext('a'), children[3], 'should return the previous Element that matches, otherwise null');
    equal(children[1].getNext('span'), null, 'should return the previous Element that matches, otherwise null');
  })();

});

test('Element.getAllNext', function() {

  (function(){
    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[0].getAllNext(), children.slice(1), 'should return all the next Elements, otherwise an empty array');
    same(children[2].getAllNext(), [], 'should return all the next Elements, otherwise an empty array');
  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
    container.adopt(children);
    same(children[0].getAllNext('a'), [children[1], children[3]], 'should return all the next Elements that match, otherwise an empty array');
    same(children[0].getAllNext('span'), [], 'should return all the next Elements that match, otherwise an empty array');
  })();

});

test('Element.getFirst', function() {

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('div')];
    container.adopt(children);
    same(container.getFirst(), children[0], 'should return the first Element in the Element, otherwise null');
    equal(children[0].getFirst(), null, 'should return the first Element in the Element, otherwise null');

  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('div')];
    container.adopt(children);
    same(container.getFirst('a'), children[1], 'should return the first Element in the Element that matches, otherwise null');
    equal(container.getFirst('span'), null, 'should return the first Element in the Element that matches, otherwise null');

  })();

});

test('Element.getLast | Element.getLastChild', function() {

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('div')];
    container.adopt(children);
    same(container.getLast(), children[2], 'should return the last Element in the Element, otherwise null');
    equal(children[0].getLast(), null, 'should return the last Element in the Element, otherwise null');

  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
    container.adopt(children);
    same(container.getLast('a'), children[3], 'should return the last Element in the Element that matches, otherwise null');
    equal(container.getLast('span'), null, 'should return the last Element in the Element that matches, otherwise null');

  })();

});

test('Element.getParent', function() {

  (function(){

    var container = new Element('p');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(children[1].getParent(), container, 'should return the parent of the Element, otherwise null');
    equal(container.getParent(), null, 'should return the parent of the Element, otherwise null');

  })();

  (function(){

    var container = new Element('p');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(new Element('div').adopt(children));
    same(children[1].getParent('p'), container, 'should return the parent of the Element that matches, otherwise null');
    equal(children[1].getParent('table'), null, 'should return the parent of the Element that matches, otherwise null');

  })();

});

test('Element.getParents', function() {

  (function(){

    var container = new Element('p');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
    same(children[1].getParents(), [container.getFirst().getFirst(), container.getFirst(), container], 'should return the parents of the Element, otherwise returns an empty array');
    same(container.getParents(), [], 'should return the parents of the Element, otherwise returns an empty array');

  })();

  (function(){

    var container = new Element('p');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
    same(children[1].getParents('div'), [container.getFirst().getFirst(), container.getFirst()], 'should return the parents of the Element that match, otherwise returns an empty array');
    same(children[1].getParents('table'), [], 'should return the parents of the Element that match, otherwise returns an empty array');

  })();

});

test('Element.getChildren', function() {

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('div'), new Element('div')];
    container.adopt(children);
    same(container.getChildren(), children, "should return the Element's children, otherwise returns an empty array");
    same(children[0].getChildren(), [], "should return the Element's children, otherwise returns an empty array");

  })();

  (function(){

    var container = new Element('div');
    var children = [new Element('div'), new Element('a'), new Element('a')];
    container.adopt(children);
    same(container.getChildren('a'), [children[1], children[2]], "should return the Element's children that match, otherwise returns an empty array");
    same(container.getChildren('span'), [], "should return the Element's children that match, otherwise returns an empty array");

  })();

});

test('Element.hasChild', function() {

  // before all
  window.Local = {};
  Local.container = new Element('div');
  Local.children = [new Element('div'), new Element('div'), new Element('div')];
  Local.container.adopt(Local.children);
  Local.grandchild = new Element('div').inject(Local.children[1]);

  (function(){

    ok(Local.container.hasChild(Local.children[0]), 'should return true if the Element is a child or grandchild');
    ok(Local.container.hasChild(Local.children[2]), 'should return true if the Element is a child or grandchild');
    ok(Local.container.hasChild(Local.grandchild), 'should return true if the Element is a child or grandchild');

  })();

  (function(){

    equal(Local.container.hasChild(Local.container), false, "should return false if it's the Element itself");

  })();

  (function(){

    equal(Local.children[2].hasChild(Local.container), false, 'should return false if the Element is the parent or a sibling');
    equal(Local.children[2].hasChild(Local.children[1]), false, 'should return false if the Element is the parent or a sibling');

  })();

  // after all
  Local = null;

});

/*
describe('Element constructor', {

	"should return an Element with the correct tag": function(){
		var element = new Element('div');
		value_of($type(element)).should_be('element');
		value_of($defined(element.addEvent)).should_be_true();
		value_of(element.tagName.toLowerCase()).should_be('div');
	},

	'should return an Element with various attributes': function(){
		var element = new Element('div', { 'id': 'divID', 'title': 'divTitle' });
		value_of(element.id).should_be('divID');
		value_of(element.title).should_be('divTitle');
	},

	'should return an Element with for attribute': function(){
		var label = new Element('label', { 'for': 'myId' });
		value_of(label.htmlFor).should_be('myId');
	},

	'should return an Element with class attribute': function(){
		var div1 = new Element('div', { 'class': 'class' });
		var div2 = new Element('div', { 'class': 'class1 class2 class3' });

		value_of(div1.className).should_be('class');
		value_of(div2.className).should_be('class1 class2 class3');
	},

	'should return input Elements with name and type attributes': function(){
		var username = new Element('input', { type: 'text', name: 'username', value: 'username' });
		var password = new Element('input', { type: 'password', name: 'password', value: 'password' });

		value_of(username.type).should_be('text');
		value_of(username.name).should_be('username');
		value_of(username.value).should_be('username');

		value_of(password.type).should_be('password');
		value_of(password.name).should_be('password');
		value_of(password.value).should_be('password');
	},

	'should return input Elements that are checked': function(){
		var check1 = new Element('input', { type: 'checkbox' });
		var check2 = new Element('input', { type: 'checkbox', checked: true });
		var check3 = new Element('input', { type: 'checkbox', checked: 'checked' });

		value_of(check1.checked).should_be_false();
		value_of(check2.checked).should_be_true();
		value_of(check2.checked).should_be_true();
	},

	"should return a select Element that retains it's selected options": function(){
		var div = new Element('div', { 'html':
			'<select multiple="multiple" name="select[]">' +
				'<option value="" name="none">--</option>' +
				'<option value="volvo" name="volvo">Volvo</option>' +
				'<option value="saab" name="saab" selected="selected">Saab</option>' +
				'<option value="opel" name="opel" selected="selected">Opel</option>' +
				'<option value="bmw" name="bmw">BMW</option>' +
			'</select>'
		});

		var select1 = div.getFirst();
		var select2 = new Element('select', { name: 'select[]', multiple: true }).adopt(
			new Element('option', { name: 'none', value: '', html: '--' }),
			new Element('option', { name: 'volvo', value: 'volvo', html: 'Volvo' }),
			new Element('option', { name: 'saab', value: 'saab', html: 'Saab', selected: true }),
			new Element('option', { name: 'opel', value: 'opel', html: 'Opel', selected: 'selected' }),
			new Element('option', { name: 'bmw', value: 'bmw', html: 'BMW' })
		);

		value_of(select1.multiple).should_be_true();
		value_of(select2.multiple).should_be_true();

		value_of(select1.name).should_be(select2.name);
		value_of(select1.options.length).should_be(select2.options.length);
		value_of(select1.toQueryString()).should_be(select2.toQueryString());
	}

});

describe('Element.set', {

	"should set a single attribute of an Element": function(){
		var div = new Element('div').set('id', 'some_id');
		value_of(div.id).should_be('some_id');
	},

	"should set the checked attribute of an Element": function(){
		var input1 = new Element('input', {type: 'checkbox'}).set('checked', 'checked');
		var input2 = new Element('input', {type: 'checkbox'}).set('checked', true);
		value_of(input1.checked).should_be_true();
		value_of(input2.checked).should_be_true();
	},

	"should set the class name of an element": function(){
		var div = new Element('div').set('class', 'some_class');
		value_of(div.className).should_be('some_class');
	},

	"should set the for attribute of an element": function(){
		var input = new Element('input', {type: 'text'}).set('for', 'some_element');
		value_of(input.htmlFor).should_be('some_element');
	},

	"should set the html of an Element": function(){
		var html = '<a href="http://mootools.net/">Link</a>';
		var parent = new Element('div').set('html', html);
		value_of(parent.innerHTML.toLowerCase()).should_be(html.toLowerCase());
	},

	"should set the html of an Element with multiple arguments": function(){
		var html = ['<p>Paragraph</p>', '<a href="http://mootools.net/">Link</a>'];
		var parent = new Element('div').set('html', html);
		value_of(parent.innerHTML.toLowerCase()).should_be(html.join('').toLowerCase());
	},

	"should set the html of a select Element": function(){
		var html = '<option>option 1</option><option selected="selected">option 2</option>';
		var select = new Element('select').set('html', html);
		value_of(select.getChildren().length).should_be(2);
		value_of(select.options.length).should_be(2);
		value_of(select.selectedIndex).should_be(1);
	},

	"should set the html of a table Element": function(){
		var html = '<tbody><tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr></tbody>';
		var table = new Element('table').set('html', html);
		value_of(table.getChildren().length).should_be(1);
		value_of(table.getFirst().getFirst().getChildren().length).should_be(2);
		value_of(table.getFirst().getLast().getFirst().className).should_be('cell');
	},

	"should set the html of a tbody Element": function(){
		var html = '<tr><td>cell 1</td><td>cell 2</td></tr><tr><td class="cell">cell 1</td><td>cell 2</td></tr>';
		var tbody = new Element('tbody').inject(new Element('table')).set('html', html);
		value_of(tbody.getChildren().length).should_be(2);
		value_of(tbody.getLast().getFirst().className).should_be('cell');
	},

	"should set the html of a tr Element": function(){
		var html = '<td class="cell">cell 1</td><td>cell 2</td>';
		var tr = new Element('tr').inject(new Element('tbody').inject(new Element('table'))).set('html', html);
		value_of(tr.getChildren().length).should_be(2);
		value_of(tr.getFirst().className).should_be('cell');
	},

	"should set the html of a td Element": function(){
		var html = '<span class="span">Some Span</span><a href="#">Some Link</a>';
		var td = new Element('td').inject(new Element('tr').inject(new Element('tbody').inject(new Element('table')))).set('html', html);
		value_of(td.getChildren().length).should_be(2);
		value_of(td.getFirst().className).should_be('span');
	},

	"should set the style attribute of an Element": function(){
		var style = 'font-size:12px;line-height:23px;';
		var div = new Element('div').set('style', style);
		value_of(div.style.lineHeight).should_be('23px');
		value_of(div.style.fontSize).should_be('12px');
	},

	"should set the text of an element": function(){
		var div = new Element('div').set('text', 'some text content');
		value_of(div.get('text')).should_be('some text content');
		value_of(div.innerHTML).should_be('some text content');
	},

	"should set multiple attributes of an Element": function(){
		var div = new Element('div').set({ id: 'some_id', 'title': 'some_title', 'html': 'some_content' });
		value_of(div.id).should_be('some_id');
		value_of(div.title).should_be('some_title');
		value_of(div.innerHTML).should_be('some_content');
	},

	"should set various attributes of a script Element": function(){
		var script = new Element('script').set({ type: 'text/javascript', defer: 'defer' });
		value_of(script.type).should_be('text/javascript');
		value_of(script.defer).should_be_true();
	},

	"should set various attributes of a table Element": function(){
		var table1 = new Element('table').set({ border: '2', cellpadding: '3', cellspacing: '4', align: 'center' });
		var table2 = new Element('table').set({ cellPadding: '3', cellSpacing: '4' });
		value_of(table1.border).should_be(2);
		value_of(table1.cellPadding).should_be(3);
		value_of(table2.cellPadding).should_be(3);
		value_of(table1.cellSpacing).should_be(4);
		value_of(table2.cellSpacing).should_be(4);
		value_of(table1.align).should_be('center');
	}

});

var myElements = new Elements([
	new Element('div'),
	document.createElement('a'),
	new Element('div', {id: 'el-' + $time()})
]);

describe('Elements', {

	'should return an array type': function(){
		value_of(Array.type(myElements)).should_be_true();
	},

	'should return an array of Elements': function(){
		value_of(myElements.every(Element.type)).should_be_true();
	},

	'should apply Element prototypes to the returned array': function(){
		value_of($defined(myElements.addEvent)).should_be_true();
	},

	'should return all Elements that match the string matcher': function(){
		value_of(myElements.filter('div')).should_be([myElements[0], myElements[2]]);
	},

	'should return all Elements that match the comparator': function(){
		var elements = myElements.filter(function(element){
			return element.match('a');
		});
		value_of(elements).should_be([myElements[1]]);
	}

});

describe('TextNode.constructor', {

	'should return a new textnode element': function(){
		var text = document.newTextNode('yo');
		value_of($type(text)).should_be('textnode');
	}

});

describe('IFrame constructor', {

	'should return a new IFrame': function(){
		var iFrame1 = document.createElement('iframe');
		var iFrame2 = new IFrame();
		value_of(iFrame1.tagName).should_be(iFrame2.tagName);
	},

	'should return the same IFrame if passed': function(){
		var iFrame1 = document.createElement('iframe');
		var iFrame2 = new IFrame(iFrame1);
		value_of(iFrame1).should_be(iFrame2);
	}

});

describe('$', {

	'before all': function(){
		Container = document.createElement('div');
		Container.innerHTML = '<div id="dollar"></div>';
		document.body.appendChild(Container);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container = null;
	},

	'should return an extended Element by string id': function(){
		var dollar1 = document.getElementById('dollar');
		var dollar2 = $('dollar');

		value_of(dollar1).should_be(dollar2);
		value_of($defined(dollar1.addEvent)).should_be_true();
	},

	'should return the window if passed': function(){
		value_of($(window)).should_be(window);
	},

	'should return the document if passed': function(){
		value_of($(document)).should_be(document);
	},

	'should return null if string not found or type mismatch': function(){
		value_of($(1)).should_be_null();
		value_of($('nonexistant')).should_be_null();
	}

});

describe('$$', {

	'should return all Elements of a specific tag': function(){
		var divs1 = $$('div');
		var divs2 = Array.flatten(document.getElementsByTagName('div'));
		value_of(divs1).should_be(divs2);
	},

	'should return multiple Elements for each specific tag': function(){
		var headers1 = $$('h3', 'h4');
		var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
		value_of(headers1).should_be(headers2);
	},

	'should return an empty array if not is found': function(){
		value_of($$('not_found')).should_be([]);
	}

});

describe('getDocument', {

	'should return the owner document for elements': function(){
		var doc = document.newElement('div').getDocument();
		value_of(doc).should_be(document);
	},

	'should return the owned document for window': function(){
		var doc = window.getDocument();
		value_of(doc).should_be(document);
	},

	'should return self for document': function(){
		var doc = document.getDocument();
		value_of(doc).should_be(document);
	}

});

describe('getWindow', {

	'should return the owner window for elements': function(){
		var win = document.newElement('div').getWindow();
		value_of(win).should_be(window);
	},

	'should return the owner window for document': function(){
		var win = document.getWindow();
		value_of(win).should_be(window);
	},

	'should return self for window': function(){
		var win = window.getWindow();
		value_of(win).should_be(window);
	}

});

describe('Element.getElement', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
	},

	'after all': function(){
		Container = null;
	},

	'should return the first Element to match the tag, otherwise null': function(){
		var child = Container.getElement('div');
		value_of(child.id).should_be('first');
		value_of(Container.getElement('iframe')).should_be_null();
	}

});

describe('Element.getElements', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
	},

	'after all': function(){
		Container = null;
	},

	'should return all the elements that match the tag': function(){
		var children = Container.getElements('div');
		value_of(children).should_have(2, 'items');
	},

	'should return all the elements that match the tags': function(){
		var children = Container.getElements('div,a');
		value_of(children).should_have(3, 'items');
		value_of(children[2].tagName.toLowerCase()).should_be('a');
	}

});

describe('Document.getElement', {

	'should return the first Element to match the tag, otherwise null': function(){
		var div = document.getElement('div');
		var ndiv = document.getElementsByTagName('div')[0];
		value_of(div).should_be(ndiv);

		var notfound = document.getElement('canvas');
		value_of(notfound).should_be_null();
	}

});

describe('Document.getElements', {

	'should return all the elements that match the tag': function(){
		var divs = document.getElements('div');
		var ndivs = $A(document.getElementsByTagName('div'));
		value_of(divs).should_be(ndivs);
	},

	'should return all the elements that match the tags': function(){
		var headers = document.getElements('h3,h4');
		var headers2 = Array.flatten([document.getElementsByTagName('h3'), document.getElementsByTagName('h4')]);
		value_of(headers.length).should_be(headers2.length);
	}

});

describe('Element.getElementById', {

	'before all': function(){
		Container = new Element('div');
		Container.innerHTML = '<div id="first"></div><div id="second"></div><p></p><a></a>';
		document.body.appendChild(Container);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container = null;
	},

	'should getElementById that matches the id, otherwise null': function(){
		value_of(Container.getElementById('first')).should_be(Container.childNodes[0]);
		value_of(Container.getElementById('not_found')).should_be_null();
	}

});

describe('Element.get style', {

	"should return a CSS string representing the Element's styles": function(){
		var style = 'font-size:12px;color:rgb(255,255,255)';
		var myElement = new Element('div').set('style', style);
		value_of(myElement.get('style').toLowerCase().replace(/\s/g, '').replace(/;$/, '')).should_match(/(font-size:12px;color:rgb\(255,255,255\))|(color:rgb\(255,255,255\);font-size:12px)/);
		//I'm replacing these characters (space and the last semicolon) as they are not vital to the style, and browsers sometimes include them, sometimes not.
	}

});

describe('Element.get tag', {

	"should return the Element's tag": function(){
		var myElement = new Element('div');
		value_of(myElement.get('tag')).should_be('div');
	}

});

describe('Element.get', {

	"should get an absolute href": function(){
		var link = new Element('a', {href: "http://google.com/"});
		value_of(link.get('href')).should_be("http://google.com/");
	},

	"should get an absolute href to the same domain": function(){
		var link = new Element('a', {href: window.location.href});
		value_of(link.get('href')).should_be(window.location.href);
	},

	"should get a relative href": function(){
		var link = new Element('a', {href: "../index.html"});
		value_of(link.get('href')).should_be("../index.html");
	},

	"should get a host absolute href": function(){
		var link = new Element('a', {href: "/developers"});
		value_of(link.get('href')).should_be("/developers");
	},

	"should return null when attribute is missing": function(){
		var link = new Element('a');
		value_of(link.get('href')).should_be_null();
	}

});

describe('Element.erase', {

	"should erase an Element's property": function(){
		var myElement = new Element('a', {href: 'http://mootools.net/', title: 'mootools!'});
		value_of(myElement.get('title')).should_be('mootools!');
		value_of(myElement.erase('title').get('title')).should_be_null();
	},

	"should erase an Element's style": function(){
		var myElement = new Element('div', {style: "color:rgb(255, 255, 255); font-size:12px;"});
		myElement.erase('style');
		value_of(myElement.get('style')).should_be('');
	}

});

describe('Element.match', {

	'should return true if tag is not provided': function(){
		var element = new Element('div');
		value_of(element.match()).should_be_true();
	},

	"should return true if the Element's tag matches": function(){
		var element = new Element('div');
		value_of(element.match('div')).should_be_true();
	}

});

describe('Element.inject', {

	'before all': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html});
		document.body.appendChild(Container);

		test = new Element('div', {id:'inject-test'});
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should inject the Element before an Element': function(){
		test.inject($('first'), 'before');
		value_of(Container.childNodes[0]).should_be(test);

		test.inject($('second-child'), 'before');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should inject the Element after an Element': function(){
		test.inject($('first'), 'after');
		value_of(Container.childNodes[1]).should_be(test);

		test.inject($('first-child'), 'after');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should inject the Element at bottom of an Element': function(){
		var first = $('first');
		test.inject(first, 'bottom');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'bottom');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'bottom');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should inject the Element inside an Element': function(){
		var first = $('first');
		test.inject(first, 'inside');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'inside');
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container, 'inside');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should inject the Element at the top of an Element': function(){
		test.inject(Container, 'top');
		value_of(Container.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second, 'top');
		value_of(second.childNodes[0]).should_be(test);
	},

	'should inject the Element in an Element': function(){
		var first = $('first');
		test.inject(first);
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		test.inject(second);
		value_of(second.childNodes[2]).should_be(test);

		test.inject(Container);
		value_of(Container.childNodes[2]).should_be(test);
	}

});

describe('Element.replaces', {

	'should replace an Element with the Element': function(){
		var parent = new Element('div');
		var div = new Element('div', {id: 'original'}).inject(parent);
		var el = new Element('div', {id: 'replaced'});
		el.replaces(div);
		value_of(parent.childNodes[0]).should_be(el);
	}

});

describe('Element.grab', {

	'before all': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;', html: html}).inject(document.body);

		test = new Element('div', {id:'grab-test'});
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should grab the Element before this Element': function(){
		$('first').grab(test, 'before');
		value_of(Container.childNodes[0]).should_be(test);

		$('second-child').grab(test, 'before');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should grab the Element after this Element': function(){
		$('first').grab(test, 'after');
		value_of(Container.childNodes[1]).should_be(test);

		$('first-child').grab(test, 'after');
		value_of(Container.childNodes[1].childNodes[1]).should_be(test);
	},

	'should grab the Element at the bottom of this Element': function(){
		var first = $('first');
		first.grab(test, 'bottom');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'bottom');
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test, 'bottom');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should grab the Element inside this Element': function(){
		var first = $('first');
		first.grab(test, 'inside');
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'inside');
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test, 'inside');
		value_of(Container.childNodes[2]).should_be(test);
	},

	'should grab the Element at the top of this Element': function(){
		Container.grab(test, 'top');
		value_of(Container.childNodes[0]).should_be(test);

		var second = $('second');
		second.grab(test, 'top');
		value_of(second.childNodes[0]).should_be(test);
	},

	'should grab an Element in the Element': function(){
		var first = $('first').grab(test);
		value_of(first.childNodes[0]).should_be(test);

		var second = $('second').grab(test);
		value_of(second.childNodes[2]).should_be(test);

		Container.grab(test);
		value_of(Container.childNodes[2]).should_be(test);
	}

});

describe('Element.wraps', {

	'should replace and adopt the Element': function(){
		var div = new Element('div');
		var child = new Element('p').inject(div);

		var wrapper = new Element('div', {id: 'wrapper'}).wraps(div.childNodes[0]);
		value_of(div.childNodes[0]).should_be(wrapper);
		value_of(wrapper.childNodes[0]).should_be(child);
	}

});

describe('Element.appendText', {

	'before all': function(){
		Container = new Element('div', {style: 'position:absolute;top:0;left:0;visibility:hidden;'}).inject(document.body);
	},

	'before each': function(){
		var html = [
			'<div id="first"></div>',
			'<div id="second">',
				'<div id="first-child"></div>',
				'<div id="second-child"></div>',
			'</div>'
		].join('');
		Container.set('html', html);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
		test = null;
	},

	'should append a TextNode before this Element': function(){
		$('first').appendText('test', 'before');
		value_of(Container.childNodes[0].nodeValue).should_be('test');

		$('second-child').appendText('test', 'before');
		value_of(Container.childNodes[2].childNodes[1].nodeValue).should_be('test');
	},

	'should append a TextNode the Element after this Element': function(){
		$('first').appendText('test', 'after');
		value_of(Container.childNodes[1].nodeValue).should_be('test');

		$('first-child').appendText('test', 'after');
		value_of(Container.childNodes[2].childNodes[1].nodeValue).should_be('test');
	},

	'should append a TextNode the Element at the bottom of this Element': function(){
		var first = $('first');
		first.appendText('test', 'bottom');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'bottom');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test', 'bottom');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	},

	'should append a TextNode the Element inside this Element': function(){
		var first = $('first');
		first.appendText('test', 'inside');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'inside');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test', 'inside');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	},

	'should append a TextNode the Element at the top of this Element': function(){
		Container.appendText('test', 'top');
		value_of(Container.childNodes[0].nodeValue).should_be('test');

		var second = $('second');
		second.appendText('test', 'top');
		value_of(second.childNodes[0].nodeValue).should_be('test');
	},

	'should append a TextNode an Element in the Element': function(){
		var first = $('first').appendText('test');
		value_of(first.childNodes[0].nodeValue).should_be('test');

		var second = $('second').appendText('test');
		value_of(second.childNodes[2].nodeValue).should_be('test');

		Container.appendText('test');
		value_of(Container.childNodes[2].nodeValue).should_be('test');
	}

});

describe('Element.adopt', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'before each': function(){
		Container.empty();
	},

	'should adopt an Element by its id': function(){
		var child = new Element('div', {id: 'adopt-me'});
		document.body.appendChild(child);
		Container.adopt('adopt-me');
		value_of(Container.childNodes[0]).should_be(child);
	},

	'should adopt an Element': function(){
		var child = new Element('p');
		Container.adopt(child);
		value_of(Container.childNodes[0]).should_be(child);
	},

	'should adopt any number of Elements or ids': function(){
		var children = [];
		(4).times(function(i){ children[i] = new Element('span', {id: 'child-' + i}); });
		Container.adopt(children);
		value_of(Container.childNodes).should_have(4, 'items');
		value_of(Container.childNodes[3]).should_be(children[3]);
	}

});

describe('Element.dispose', {

	'before all': function(){
		Container = new Element('div').inject(document.body);
	},

	'after all': function(){
		document.body.removeChild(Container);
		Container.set('html', '');
		Container = null;
	},

	'should dispose the Element from the DOM': function(){
		var child = new Element('div').inject(Container);
		child.dispose();
		value_of(Container.childNodes.length).should_be(0);
	}

});

describe('Element.clone', {

	'before all': function(){
		Container = new Element('div', {'id': 'outer', 'class': 'moo'});
		Container.innerHTML = '<span class="foo" id="inner1"><div class="movie" id="sixfeet">under</div></span><span id="inner2"></span>';
	},

	'after all': function(){
		Container = null;
	},

	'should return a clone': function(){
		var div = new Element('div');
		var clone = div.clone();
		value_of(div).should_not_be(clone);
		value_of($type(div)).should_be('element');
		value_of($type(clone)).should_be('element');
	},

	'should remove id from clone and clone children by default': function(){
		var clone = Container.clone();
		value_of(clone.getElementsByTagName('*').length).should_be(3);
		value_of(clone.className).should_be('moo');
		value_of(clone.id).should_be('');
		value_of(Container.id).should_be('outer');
	},

	'should remove all ids': function(){
		var clone = Container.clone(true);
		value_of(clone.id).should_be('');
		value_of(clone.childNodes.length).should_be(2);
		value_of(clone.childNodes[0].id).should_be('');
		value_of(clone.childNodes[0].childNodes[0].id).should_be('');
		value_of(clone.childNodes[0].className).should_be('foo');
	},

	'should keep id if specified': function(){
		var clone = Container.clone(true, true);
		value_of(clone.id).should_be('outer');
		value_of(clone.childNodes.length).should_be(2);
		value_of(clone.childNodes[0].id).should_be('inner1');
		value_of(clone.childNodes[0].childNodes[0].id).should_be('sixfeet');
		value_of(clone.childNodes[0].className).should_be('foo');
	},

	'should clone empty href attribute': function(){
		var clone = new Element('div', {
			html: '<a href="">empty anchor</a>'
		}).getFirst().clone();

		value_of(clone.getAttribute('href', 2)).should_be('');
	},

	'should not clone Element Storage': function(){
		Container.store('drink', 'milk');
		var clone = Container.clone();
		value_of(clone.retrieve('drink')).should_be_null();
		value_of(Container.retrieve('drink')).should_be('milk');
	},

	'should clone child nodes and not copy their uid': function(){
		var cloned = Container.clone(true).getElements('*');
		var old = Container.getElements('*');
		value_of(cloned.length).should_be(3);
		value_of(old.length).should_be(3);
		value_of($$(old, cloned).length).should_be(6);
	},

	'should clone a text input and retain value': function(){
		var inputs = new Element('div', { 'html': '' +
			'<input id="input1" type="text" value="Some Value" />' +
			'<input id="input2" type="text" />'
		}).getChildren();

		var input1 = inputs[0].clone();
		var input2 = inputs[1].clone(false, true);

		value_of(!input1.id).should_be_true();
		value_of(input2.id).should_be('input2');
		value_of(input1.value).should_be('Some Value');
		value_of(input2.value).should_be('');
	},

	'should clone a textarea and retain value': function(){
		var textareas = new Element('div', { 'html': '' +
			'<textarea id="textarea1"></textarea>' +
			'<textarea id="textarea2">Some-Text-Here</textarea>'
		}).getChildren();

		var textarea1 = textareas[0].clone();
		var textarea2 = textareas[1].clone(false, true);

		value_of(!textarea1.id).should_be_true();
		value_of(textarea2.id).should_be('textarea2');
		value_of(textarea1.value).should_be('');
		value_of(textarea2.value).should_be('Some-Text-Here');
	},

	'should clone a checkbox and retain checked state': function(){
		var checks = new Element('div', { 'html': '' +
			'<input id="check1" type="checkbox" />' +
			'<input id="check2" type="checkbox" checked="checked" />'
		}).getChildren();

		var check1 = checks[0].clone();
		var check2 = checks[1].clone(false, true);

		value_of(!check1.id).should_be_true();
		value_of(check2.id).should_be('check2');
		value_of(check1.checked).should_be_false();
		value_of(check2.checked).should_be_true();
	},

	'should clone a select and retain selected state': function(){
		var selects = new Element('div', { 'html': '' +
			'<select name="select" id="select1">' +
				'<option>--</option>' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="opel" selected="selected">Opel</option>' +
				'<option value="bmw">BMW</option>' +
			'</select>' +
			'<select name="select[]" id="select2" multiple="multiple">' +
				'<option>--</option>' +
				'<option value="volvo">Volvo</option>' +
				'<option value="saab">Saab</option>' +
				'<option value="opel" selected="selected">Opel</option>' +
				'<option value="bmw" selected="selected">BMW</option>' +
			'</select>'
		}).getChildren();

		var select1 = selects[0].clone(true);
		var select2 = selects[1].clone(true, true);

		value_of(!select1.id).should_be_true();
		value_of(select2.id).should_be('select2');
		value_of(select1.selectedIndex).should_be(3);
		value_of(select2.options[3].selected).should_be_true();
		value_of(select2.options[4].selected).should_be_true();
	},

	'should clone custom attributes': function(){
		var div = new Element('div');
		div.setAttribute('foo', 'FOO');
		div.setAttribute('bar', ['BAR']);
		var clone = div.clone();

		value_of(clone.getAttribute('foo')).should_be('FOO');
		value_of(clone.getAttribute('bar')).should_be(['BAR']);
	}

});

describe('Element className methods', {

	'should return true if the Element has the given class': function(){
		var div = new Element('div', {'class': 'header bold'});
		value_of(div.hasClass('header')).should_be_true();
		value_of(div.hasClass('bold')).should_be_true();
		value_of(div.hasClass('random')).should_be_false();
	},

	'should add the class to the Element': function(){
		var div = new Element('div');
		div.addClass('myclass');
		value_of(div.hasClass('myclass')).should_be_true();
	},

	'should append classes to the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.addClass('aclass');
		value_of(div.hasClass('aclass')).should_be_true();
	},

	'should remove the class in the Element': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	},

	'should only remove the specific class': function(){
		var div = new Element('div', {'class': 'myclass aclass'});
		div.removeClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	},

	'should not remove any class if the class is not found': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.removeClass('extra');
		value_of(div.hasClass('myclass')).should_be_true();
	},

	'should add the class if the Element does not have the class': function(){
		var div = new Element('div');
		div.toggleClass('myclass');
		value_of(div.hasClass('myclass')).should_be_true();
	},

	'should remove the class if the Element does have the class': function(){
		var div = new Element('div', {'class': 'myclass'});
		div.toggleClass('myclass');
		value_of(div.hasClass('myclass')).should_be_false();
	}

});

describe('Element.empty', {

	'should remove all children': function(){
		var children = [];
		(5).times(function(i){ children[i] = new Element('p'); });
		var div = new Element('div').adopt(children);
		div.empty();
		value_of(div.get('html')).should_be('');
	}

});

describe('Element.destroy', {

	'should obliterate the Element from the universe': function(){
		var div = new Element('div', {id: 'destroy-test'}).inject(document.body);
		var result = div.destroy();
		value_of(result).should_be_null();
		value_of($('destroy-test')).should_be_null();
	}

});

describe('Element.toQueryString', {

	'should return an empty string for an Element that does not have form Elements': function(){
		var div = new Element('div');
		value_of(div.toQueryString()).should_be('');
	},

	'should ignore any form Elements that do not have a name, disabled, or whose value is false': function(){
		var form = new Element('form').adopt(
			new Element('input', { name: 'input', disabled: true, type: 'checkbox', checked: true, value: 'checked' }),
			new Element('select').adopt(
				new Element('option', { name: 'volvo', value: false, html: 'Volvo' }),
				new Element('option', { value: 'saab', html: 'Saab', selected: true })
			),
			new Element('textarea', { name: 'textarea', disabled: true, value: 'textarea-value' })
		);
		value_of(form.toQueryString()).should_be('');
	},

	"should return a query string from the Element's form Elements": function(){
		var form = new Element('form', { 'html': '' +
			'<input type="checkbox" name="input" value="checked" checked="checked" />' +
			'<select name="select[]" multiple="multiple" size="5">' +
				'<option name="none" value="">--</option>' +
				'<option name="volvo" value="volvo">Volvo</option>' +
				'<option name="saab" value="saab" selected="selected">Saab</option>' +
				'<option name="opel" value="opel" selected="selected">Opel</option>' +
				'<option name="bmw" value="bmw">BMW</option>' +
			'</select>' +
			'<textarea name="textarea">textarea-value</textarea>'
		});
		value_of(form.toQueryString()).should_be('input=checked&select[]=saab&select[]=opel&textarea=textarea-value');
	},

	"should return a query string containing even empty values, single select must have a selected option": function() {
		var form = new Element('form').adopt(
			new Element('input', {name: 'input', type: 'checkbox', checked: true, value: ''}),
			new Element('select', {name: 'select[]'}).adopt(
				new Element('option', {name: 'none', value: '', html: '--', selected: true}),
				new Element('option', {name: 'volvo', value: 'volvo', html: 'Volvo'}),
				new Element('option', {name: 'saab', value: 'saab', html: 'Saab'}),
				new Element('option', {name: 'opel', value: 'opel', html: 'Opel'}),
				new Element('option', {name: 'bmw', value: 'bmw', html: 'BMW'})
			),
			new Element('textarea', {name: 'textarea', value: ''})
		);
		value_of(form.toQueryString()).should_be('input=&select[]=&textarea=');
		value_of(form.getElementsByTagName('select')[0].selectedIndex).should_be(0);
	},

	"should return a query string containing even empty values, multiple select may have no selected options": function() {
		var form = new Element('form',{'html':
			'<input type="checkbox" name="input" value="" checked="checked" />' +
			'<select name="select[]" multiple="multiple" size="5">' +
				'<option name="none" value="">--</option>' +
				'<option name="volvo" value="volvo">Volvo</option>' +
				'<option name="saab" value="saab">Saab</option>' +
				'<option name="opel" value="opel">Opel</option>' +
				'<option name="bmw" value="bmw">BMW</option>' +
			'</select>' +
			'<textarea name="textarea"></textarea>'
		});
		value_of(form.toQueryString()).should_be('input=&textarea=');
	},

	"should return a query string ignoring submit, reset and file form Elements": function(){
		var form = new Element('form', { 'html': '' +
			'<input type="checkbox" name="input" value="checked" checked="checked" />' +
			'<input type="file" name="file" />' +
			'<textarea name="textarea">textarea-value</textarea>' +
			'<input type="submit" name="go" value="Go" />' +
			'<input type="reset" name="cancel" value="Reset" />'
		});
		value_of(form.toQueryString()).should_be('input=checked&textarea=textarea-value');
	}

});

describe('Element.getProperty', {

	'should getProperty from an Element': function(){
		var anchor1 = new Element('a');
		anchor1.href = 'http://mootools.net';
		value_of(anchor1.getProperty('href')).should_be('http://mootools.net');

		var anchor2 = new Element('a');
		anchor2.href = '#someLink';
		value_of(anchor2.getProperty('href')).should_be('#someLink');
	},

	'should getProperty type of an input Element': function(){
		var input1 = new Element('input', {type: 'text'});
		value_of(input1.getProperty('type')).should_be('text');

		var input2 = new Element('input', {type: 'checkbox'});
		value_of(input2.getProperty('type')).should_be('checkbox');
		
		var div = new Element('div', {'html':
			'<select name="test" id="test" multiple="multiple">' + 
				'<option value="1">option-value</option>' +
			'</select>'
		});
		var input3 = div.getElement('select');
		value_of(input3.getProperty('type')).should_be('select-multiple');
		value_of(input3.getProperty('name')).should_be('test');
	},

	'should getPropety checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' });
		checked1.checked = 'checked';
		value_of(checked1.getProperty('checked')).should_be_true();

		var checked2 = new Element('input', { type: 'checkbox' });
		checked2.checked = true;
		value_of(checked2.getProperty('checked')).should_be_true();

		var checked3 = new Element('input', { type: 'checkbox' });
		checked3.checked = false;
		value_of(checked3.getProperty('checked')).should_be_false();
	},

	'should getProperty disabled from an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' });
		disabled1.disabled = 'disabled';
		value_of(disabled1.getProperty('disabled')).should_be_true();

		var disabled2 = new Element('input', { type: 'text' });
		disabled2.disabled = true;
		value_of(disabled2.getProperty('disabled')).should_be_true();

		var disabled3 = new Element('input', { type: 'text' });
		disabled3.disabled = false;
		value_of(disabled3.getProperty('disabled')).should_be_false();
	},

	'should getProperty readonly from an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' });
		readonly1.readOnly = 'readonly';
		value_of(readonly1.getProperty('readonly')).should_be_true();

		var readonly2 = new Element('input', { type: 'text' });
		readonly2.readOnly = true;
		value_of(readonly2.getProperty('readonly')).should_be_true();

		var readonly3 = new Element('input', { type: 'text' });
		readonly3.readOnly = false;
		value_of(readonly3.getProperty('readonly')).should_be_false();
	}

});

describe('Element.setProperty', {

	'should setProperty from an Element': function(){
		var anchor1 = new Element('a').setProperty('href', 'http://mootools.net/');
		value_of(anchor1.getProperty('href')).should_be('http://mootools.net/');

		var anchor2 = new Element('a').setProperty('href', '#someLink');
		value_of(anchor2.getProperty('href')).should_be('#someLink');
	},

	'should setProperty type of an input Element': function(){
		var input1 = new Element('input').setProperty('type', 'text');
		value_of(input1.getProperty('type')).should_be('text');

		var input2 = new Element('input').setProperty('type', 'checkbox');
		value_of(input2.getProperty('type')).should_be('checkbox');
	},

	'should setProperty checked from an input Element': function(){
		var checked1 = new Element('input', { type: 'checkbox' }).setProperty('checked', 'checked');
		value_of(checked1.getProperty('checked')).should_be_true();

		var checked2 = new Element('input', { type: 'checkbox' }).setProperty('checked', true);
		value_of(checked2.getProperty('checked')).should_be_true();

		var checked3 = new Element('input', { type: 'checkbox' }).setProperty('checked', false);
		value_of(checked3.getProperty('checked')).should_be_false();
	},

	'should setProperty disabled of an input Element': function(){
		var disabled1 = new Element('input', { type: 'text' }).setProperty('disabled', 'disabled');
		value_of(disabled1.getProperty('disabled')).should_be_true();

		var disabled2 = new Element('input', { type: 'text' }).setProperty('disabled', true);
		value_of(disabled2.getProperty('disabled')).should_be_true();

		var disabled3 = new Element('input', { type: 'text' }).setProperty('disabled', false);
		value_of(disabled3.getProperty('disabled')).should_be_false();
	},

	'should setProperty readonly of an input Element': function(){
		var readonly1 = new Element('input', { type: 'text' }).setProperty('readonly', 'readonly');
		value_of(readonly1.getProperty('readonly')).should_be_true();

		var readonly2 = new Element('input', { type: 'text' }).setProperty('readonly', true);
		value_of(readonly2.getProperty('readonly')).should_be_true();

		var readonly3 = new Element('input', { type: 'text' }).setProperty('readonly', false);
		value_of(readonly3.getProperty('readonly')).should_be_false();
	},
	
	'should setProperty defaultValue of an input Element': function(){
		var form = new Element('form');
		var defaultValue = new Element('input', {'type': 'text', 'value': '321'}).setProperty('defaultValue', '123');
		form.grab(defaultValue);
		value_of(defaultValue.getProperty('value')).should_be('321');
		form.reset();
		value_of(defaultValue.getProperty('value')).should_be('123');
	}

});

describe('Element.getProperties', {

	'should return an object associate with the properties passed': function(){
		var readonly = new Element('input', { type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		value_of(props).should_be({ type: 'text', readonly: true });
	}

});

describe('Element.setProperties', {

	'should set each property to the Element': function(){
		var readonly = new Element('input').setProperties({ type: 'text', readonly: 'readonly' });
		var props = readonly.getProperties('type', 'readonly');
		value_of(props).should_be({ type: 'text', readonly: true });
	}

});

describe('Element.removeProperty', {

	'should removeProperty from an Element': function () {
		var readonly = new Element('input', { type: 'text', readonly: 'readonly', maxlenght: 10 });
		readonly.removeProperty('readonly');
		readonly.removeProperty('maxlength');
		var props = readonly.getProperties('type', 'readonly', 'maxlength');
		value_of(props).should_be({ type: 'text', readonly: false, maxlength: Browser.Engine.webkit ? 524288 : 0});
	}

});

describe('Element.removeProperties', {

	'should remove each property from the Element': function(){
		var anchor = new Element('a', {href: '#', title: 'title', rel: 'left'});
		anchor.removeProperties('title', 'rel');
		value_of(anchor.getProperties('href', 'title', 'rel')).should_be({ href: '#' });
	}

});

describe('Element.getPrevious', {

	'should return the previous Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getPrevious()).should_be(children[0]);
		value_of(children[0].getPrevious()).should_be_null();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getPrevious('a')).should_be(children[0]);
		value_of(children[1].getPrevious('span')).should_be_null();
	}

});

describe('Element.getAllPrevious', {

	'should return all the previous Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[2].getAllPrevious()).should_be([children[1], children[0]]);
		value_of(children[0].getAllPrevious()).should_be([]);
	},

	'should return all the previous Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('a'), new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(children[3].getAllPrevious('a')).should_be([children[2], children[0]]);
		value_of(children[1].getAllPrevious('span')).should_be([]);
	}

});

describe('Element.getNext', {

	'should return the next Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getNext()).should_be(children[2]);
		value_of(children[2].getNext()).should_be_null();
	},

	'should return the previous Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(children[1].getNext('a')).should_be(children[3]);
		value_of(children[1].getNext('span')).should_be_null();
	}

});

describe('Element.getAllNext', {

	'should return all the next Elements, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[0].getAllNext()).should_be(children.slice(1));
		value_of(children[2].getAllNext()).should_be([]);
	},

	'should return all the next Elements that match, otherwise an empty array': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(children[0].getAllNext('a')).should_be([children[1], children[3]]);
		value_of(children[0].getAllNext('span')).should_be([]);
	}

});

describe('Element.getFirst', {

	'should return the first Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getFirst()).should_be(children[0]);
		value_of(children[0].getFirst()).should_be_null();
	},

	'should return the first Element in the Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getFirst('a')).should_be(children[1]);
		value_of(container.getFirst('span')).should_be_null();
	}

});

describe('Element.getLast | Element.getLastChild', {

	'should return the last Element in the Element, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div')];
		container.adopt(children);
		value_of(container.getLast()).should_be(children[2]);
		value_of(children[0].getLast()).should_be_null();
	},

	'should return the last Element in the Element that matches, otherwise null': function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('div'), new Element('a')];
		container.adopt(children);
		value_of(container.getLast('a')).should_be(children[3]);
		value_of(container.getLast('span')).should_be_null();
	}

});

describe('Element.getParent', {

	'should return the parent of the Element, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(children[1].getParent()).should_be(container);
		value_of(container.getParent()).should_be_null();
	},

	'should return the parent of the Element that matches, otherwise null': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(children));
		value_of(children[1].getParent('p')).should_be(container);
		value_of(children[1].getParent('table')).should_be_null();
	}

});

describe('Element.getParents', {

	'should return the parents of the Element, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		value_of(children[1].getParents()).should_be([container.getFirst().getFirst(), container.getFirst(), container]);
		value_of(container.getParents()).should_be([]);
	},

	'should return the parents of the Element that match, otherwise returns an empty array': function(){
		var container = new Element('p');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(new Element('div').adopt(new Element('div').adopt(children)));
		value_of(children[1].getParents('div')).should_be([container.getFirst().getFirst(), container.getFirst()]);
		value_of(children[1].getParents('table')).should_be([]);
	}

});

describe('Element.getChildren', {

	"should return the Element's children, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('div'), new Element('div')];
		container.adopt(children);
		value_of(container.getChildren()).should_be(children);
		value_of(children[0].getChildren()).should_be([]);
	},

	"should return the Element's children that match, otherwise returns an empty array": function(){
		var container = new Element('div');
		var children = [new Element('div'), new Element('a'), new Element('a')];
		container.adopt(children);
		value_of(container.getChildren('a')).should_be([children[1], children[2]]);
		value_of(container.getChildren('span')).should_be([]);
	}

});

describe('Element.hasChild', {

	"before all": function(){
		window.Local = {};
		Local.container = new Element('div');
		Local.children = [new Element('div'), new Element('div'), new Element('div')];
		Local.container.adopt(Local.children);
		Local.grandchild = new Element('div').inject(Local.children[1]);
	},

	"after all": function(){
		Local = null;
	},

	"should return true if the Element is a child or grandchild": function(){
		value_of(Local.container.hasChild(Local.children[0])).should_be_true();
		value_of(Local.container.hasChild(Local.children[2])).should_be_true();
		value_of(Local.container.hasChild(Local.grandchild)).should_be_true();
	},

	"should return false if it's the Element itself": function(){
		value_of(Local.container.hasChild(Local.container)).should_be_false();
	},

	"should return false if the Element is the parent or a sibling": function(){
		value_of(Local.children[2].hasChild(Local.container)).should_be_false();
		value_of(Local.children[2].hasChild(Local.children[1])).should_be_false();
	}

});
*/
