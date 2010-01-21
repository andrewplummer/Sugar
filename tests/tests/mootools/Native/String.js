/*
Script: String.js
	Specs for String.js

License:
	MIT-style license.
*/

test("String Methods", function() {

    // String.capitalize

      //equals('i like cookies'.capitalize(), 'I Like Cookies', 'should capitalize each word');
      //equals('I Like cOOKIES'.capitalize(), 'I Like COOKIES', 'should capitalize each word');

      equalsWithException('i like cookies'.capitalize(), 'I Like Cookies', { override: 'I like cookies' }, 'should capitalize each word');
      equalsWithException('I Like cOOKIES'.capitalize(), 'I Like COOKIES', { override: 'I like cookies' }, 'should capitalize each word');

    // String.camelCase

      equals('i-like-cookies'.camelCase(), 'iLikeCookies', 'should convert a hyphenated string into a camel cased string');
      equals('I-Like-Cookies'.camelCase(), 'ILikeCookies', 'should convert a hyphenated string into a camel cased string');

    // String.hyphenate

      equals('iLikeCookies'.hyphenate(), 'i-like-cookies', 'should convert a camel cased string into a hyphenated string');
      equals('ILikeCookies'.hyphenate(), '-i-like-cookies', 'should convert a camel cased string into a hyphenated string');

    // String.clean

      equals('  i     like    cookies   '.clean(), "i like cookies", 'should clean all extraneous whitespace from the string');
      equals('  i\nlike \n cookies \n\t  '.clean(), "i like cookies", 'should clean all extraneous whitespace from the string');

    // String.trim

      equals('  i like cookies  '.trim(), 'i like cookies', 'should trim left and right whitespace from the string');
      equals('  i  \tlike  cookies  '.trim(), 'i  \tlike  cookies', 'should trim left and right whitespace from the string');

    // String.contains

      ok('i like cookies'.contains('cookies'), 'should return true if the string contains a string otherwise false');
      ok('i,like,cookies'.contains('cookies'), 'should return true if the string contains a string otherwise false');
      equals('mootools'.contains('inefficient javascript'), false, 'should return true if the string contains a string otherwise false');

      ok('i like cookies'.contains('cookies', ' '), 'should return true if the string constains the string and separator otherwise false');
      equals('i like cookies'.contains('cookies', ','), false, 'should return true if the string constains the string and separator otherwise false');

      equals('i,like,cookies'.contains('cookies', ' '), false, 'should return true if the string constains the string and separator otherwise false');
      ok('i,like,cookies'.contains('cookies', ','), 'should return true if the string constains the string and separator otherwise false');

    // String.test

      ok('i like teh cookies'.test('cookies'), 'should return true if the test matches the string otherwise false');
      ok('i like cookies'.test('ke coo'), 'should return true if the test matches the string otherwise false');
      ok('I LIKE COOKIES'.test('cookie', 'i'), 'should return true if the test matches the string otherwise false');
      equals('i like cookies'.test('cookiez'), false, 'should return true if the test matches the string otherwise false');

      ok('i like cookies'.test(/like/), 'should return true if the regular expression test matches the string otherwise false');
      equals('i like cookies'.test(/^l/), false, 'should return true if the regular expression test matches the string otherwise false');

    // String.toInt

      equals('10'.toInt(), 10, 'should convert the string into an integer');
      equals('10px'.toInt(), 10, 'should convert the string into an integer');
      equals('10.10em'.toInt(), 10, 'should convert the string into an integer');
      equals('10'.toInt(5), 5, 'should convert the string into an integer');

    // String.toFloat

      equals('10.11'.toFloat(), 10.11, 'should convert the string into a float');
      equals('10.55px'.toFloat(), 10.55, 'should convert the string into a float');

    // String.rgbToHex

      equals('rgb(255,255,255)'.rgbToHex(), '#ffffff', 'should convert the string into a CSS hex string');
      equals('rgb(255,255,255,0)'.rgbToHex(), 'transparent', 'should convert the string into a CSS hex string');

    // String.hexToRgb

      equals('#fff'.hexToRgb(), 'rgb(255,255,255)', 'should convert the CSS hex string into a CSS rgb string');
      equals('ff00'.hexToRgb(), 'rgb(255,0,0)', 'should convert the CSS hex string into a CSS rgb string');
      equals('#000000'.hexToRgb(), 'rgb(0,0,0)', 'should convert the CSS hex string into a CSS rgb string');

    // String.stripScripts

      equals('<div><script type="text/javascript" src="file.js"></script></div>'.stripScripts(), '<div></div>', 'should strip all script tags from a string');

      equals('<div><script type="text/javascript"> var stripScriptsSpec = 42; </script></div>'.stripScripts(true), '<div></div>', 'should execute the stripped tags from the string');
      equals(window.stripScriptsSpec, 42, 'should execute the stripped tags from the string');
      equals('<div><script>\n// <!--\nvar stripScriptsSpec = 24;\n//-->\n</script></div>'.stripScripts(true), '<div></div>', 'should execute the stripped tags from the string');
      equals(window.stripScriptsSpec, 24, 'should execute the stripped tags from the string');
      equals('<div><script>\n/*<![CDATA[*/\nvar stripScriptsSpec = 4242;\n/*]]>*/</script></div>'.stripScripts(true), '<div></div>', 'should execute the stripped tags from the string');
      equals(window.stripScriptsSpec, 4242, 'should execute the stripped tags from the string');

    // String.substitute

      equals('This is {color}.'.substitute({'color': 'blue'}), 'This is blue.', 'should substitute values from objects');
      equals('This is {color} and {size}.'.substitute({'color': 'blue', 'size': 'small'}), 'This is blue and small.', 'should substitute values from objects');

      equals('This is {0}.'.substitute(['blue']), 'This is blue.', 'should substitute values from arrays');
      equals('This is {0} and {1}.'.substitute(['blue', 'small']), 'This is blue and small.', 'should substitute values from arrays');

      equals('Checking {0}, {1}, {2}, {3} and {4}.'.substitute([1, 0, undefined, null]), 'Checking 1, 0, ,  and .', 'should remove undefined values');
      equals('This is {not-set}.'.substitute({}), 'This is .', 'should remove undefined values');

      equals('Ignore \\{this} but not {that}.'.substitute({'that': 'the others'}), 'Ignore {this} but not the others.', 'should ignore escaped placeholders');

      var php = (/\$([\w-]+)/g);
      equals('I feel so $language.'.substitute({'language': 'PHP'}, php), 'I feel so PHP.', 'should substitute with a custom regex');
      var ror = (/#\{([^}]+)\}/g);
      equals('I feel so #{language}.'.substitute({'language': 'RoR'}, ror), 'I feel so RoR.', 'should substitute with a custom regex');

     // equals("fred {is {not} very} cool".substitute({ 'is {not':'BROKEN' })).should_not_be("fred BROKEN very} cool");
      equals('this {should {break} mo} betta'.substitute({ 'break':'work' }), 'this {should work mo} betta', 'should substitute without goofing up nested curly braces');

});

/*
describe("String Methods", {

	// String.capitalize

	'should capitalize each word': function(){
		value_of('i like cookies'.capitalize()).should_be('I Like Cookies');
		value_of('I Like cOOKIES'.capitalize()).should_be('I Like COOKIES');
	},

	// String.camelCase

	'should convert a hyphenated string into a camel cased string': function(){
		value_of('i-like-cookies'.camelCase()).should_be('iLikeCookies');
		value_of('I-Like-Cookies'.camelCase()).should_be('ILikeCookies');
	},

	// String.hyphenate

	'should convert a camel cased string into a hyphenated string': function(){
		value_of('iLikeCookies'.hyphenate()).should_be('i-like-cookies');
		value_of('ILikeCookies'.hyphenate()).should_be('-i-like-cookies');
	},

	// String.clean

	'should clean all extraneous whitespace from the string': function(){
		value_of('  i     like    cookies   '.clean()).should_be("i like cookies");
		value_of('  i\nlike \n cookies \n\t  '.clean()).should_be("i like cookies");
	},

	// String.trim

	'should trim left and right whitespace from the string': function(){
		value_of('  i like cookies  '.trim()).should_be('i like cookies');
		value_of('  i  \tlike  cookies  '.trim()).should_be('i  \tlike  cookies');
	},

	// String.contains

	'should return true if the string contains a string otherwise false': function(){
		value_of('i like cookies'.contains('cookies')).should_be_true();
		value_of('i,like,cookies'.contains('cookies')).should_be_true();
		value_of('mootools'.contains('inefficient javascript')).should_be_false();
	},

	'should return true if the string constains the string and separator otherwise false': function(){
		value_of('i like cookies'.contains('cookies', ' ')).should_be_true();
		value_of('i like cookies'.contains('cookies', ',')).should_be_false();

		value_of('i,like,cookies'.contains('cookies', ' ')).should_be_false();
		value_of('i,like,cookies'.contains('cookies', ',')).should_be_true();
	},

	// String.test

	'should return true if the test matches the string otherwise false': function(){
		value_of('i like teh cookies'.test('cookies')).should_be_true();
		value_of('i like cookies'.test('ke coo')).should_be_true();
		value_of('I LIKE COOKIES'.test('cookie', 'i')).should_be_true();
		value_of('i like cookies'.test('cookiez')).should_be_false();
	},

	'should return true if the regular expression test matches the string otherwise false': function(){
		value_of('i like cookies'.test(/like/)).should_be_true();
		value_of('i like cookies'.test(/^l/)).should_be_false();
	},

	// String.toInt

	'should convert the string into an integer': function(){
		value_of('10'.toInt()).should_be(10);
		value_of('10px'.toInt()).should_be(10);
		value_of('10.10em'.toInt()).should_be(10);
	},

	'should convert the string into an integer with a specific base': function(){
		value_of('10'.toInt(5)).should_be(5);
	},

	// String.toFloat

	'should convert the string into a float': function(){
		value_of('10.11'.toFloat()).should_be(10.11);
		value_of('10.55px'.toFloat()).should_be(10.55);
	},

	// String.rgbToHex

	'should convert the string into a CSS hex string': function(){
		value_of('rgb(255,255,255)'.rgbToHex()).should_be('#ffffff');
		value_of('rgb(255,255,255,0)'.rgbToHex()).should_be('transparent');
	},

	// String.hexToRgb

	'should convert the CSS hex string into a CSS rgb string': function(){
		value_of('#fff'.hexToRgb()).should_be('rgb(255,255,255)');
		value_of('ff00'.hexToRgb()).should_be('rgb(255,0,0)');
		value_of('#000000'.hexToRgb()).should_be('rgb(0,0,0)');
	},

	// String.stripScripts

	'should strip all script tags from a string': function(){
		value_of('<div><script type="text/javascript" src="file.js"></script></div>'.stripScripts()).should_be('<div></div>');
	},

	'should execute the stripped tags from the string': function(){
		value_of('<div><script type="text/javascript"> var stripScriptsSpec = 42; </script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(42);
		value_of('<div><script>\n// <!--\nvar stripScriptsSpec = 24;\n//-->\n</script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(24);
		value_of('<div><script>\n/*<![CDATA[STAR/\nvar stripScriptsSpec = 4242;\n/*]]>STAR/</script></div>'.stripScripts(true)).should_be('<div></div>');
		value_of(window.stripScriptsSpec).should_be(4242);
	},

	// String.substitute

	'should substitute values from objects': function(){
		value_of('This is {color}.'.substitute({'color': 'blue'})).should_be('This is blue.');
		value_of('This is {color} and {size}.'.substitute({'color': 'blue', 'size': 'small'})).should_be('This is blue and small.');
	},

	'should substitute values from arrays': function(){
		value_of('This is {0}.'.substitute(['blue'])).should_be('This is blue.');
		value_of('This is {0} and {1}.'.substitute(['blue', 'small'])).should_be('This is blue and small.');
	},

	'should remove undefined values': function(){
		value_of('Checking {0}, {1}, {2}, {3} and {4}.'.substitute([1, 0, undefined, null])).should_be('Checking 1, 0, ,  and .');
		value_of('This is {not-set}.'.substitute({})).should_be('This is .');
	},

	'should ignore escaped placeholders': function(){
		value_of('Ignore \\{this} but not {that}.'.substitute({'that': 'the others'})).should_be('Ignore {this} but not the others.');
	},

	'should substitute with a custom regex': function(){
		var php = (/\$([\w-]+)/g);
		value_of('I feel so $language.'.substitute({'language': 'PHP'}, php)).should_be('I feel so PHP.');
		var ror = (/#\{([^}]+)\}/g);
		value_of('I feel so #{language}.'.substitute({'language': 'RoR'}, ror)).should_be('I feel so RoR.');
	},

	'should substitute without goofing up nested curly braces': function(){
		value_of("fred {is {not} very} cool".substitute({ 'is {not':'BROKEN' })).should_not_be("fred BROKEN very} cool");
		value_of('this {should {break} mo} betta'.substitute({ 'break':'work' })).should_be('this {should work mo} betta');
	}

});
*/
