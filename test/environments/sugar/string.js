package('String', function () {

  var arr;

  method('escapeURL', function() {

    test('what a day...', 'what%20a%20day...', '...');
    test('/?:@&=+$#', '/?:@&=+$#', 'url chars');
    test('!%^*()[]{}\\:', '!%25%5E*()%5B%5D%7B%7D%5C:', 'non url special chars');

    test('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'amazon link');
    test('http://twitter.com/#!/nov/status/85613699410296833', 'http://twitter.com/#!/nov/status/85613699410296833', 'twitter link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC&otn=10&pmod=260625794431%252B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'ebay link');

  });

  method('escapeURL', [true], function() {
    test('what a day...', 'what%20a%20day...', '...');
    test('/?:@&=+$#', '%2F%3F%3A%40%26%3D%2B%24%23', 'url chars');
    test('!%^*()[]{}\\:', '!%25%5E*()%5B%5D%7B%7D%5C%3A', 'non url special chars');
    test('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'amazon link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'http%3A%2F%2Fcgi.ebay.com%2FT-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-%2F350233503515%3F_trksid%3Dp5197.m263%26_trkparms%3Dalgo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716%23ht_3216wt_1141', 'ebay link');

  });

  method('unescapeURL', function() {

    test('what%20a%20day...', 'what a day...', '...');
    test('%2F%3F%3A%40%26%3D%2B%24%23', '/?:@&=+$#', 'url chars');
    test('!%25%5E*()%5B%5D%7B%7D%5C%3A', '!%^*()[]{}\\:', 'non url special chars');
    test('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22', 'http://somedomain.com?param="this: isn\'t an easy URL to escape"', 'fake url')
    test('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'amazon link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252BUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716', 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2BUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716', 'ebay link');

    raisesError(function() { run('% 23'); }, 'should raise an error for malformed urls');
  });

  method('unescapeURL', [true], function() {

    test('what%20a%20day...', 'what a day...', '...');
    test('%2F%3F%3A%40%26%3D%2B%24%23', '%2F%3F%3A%40%26%3D%2B%24%23', 'url chars');
    test('!%25%5E*()%5B%5D%7B%7D%5C:', '!%^*()[]{}\\:', 'non url special chars');
    test('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22', 'http%3A%2F%2Fsomedomain.com%3Fparam%3D"this%3A isn\'t an easy URL to escape"', 'fake url')
    test('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'amazon link');
    test('http://twitter.com/#!/nov/status/85613699410296833', 'http://twitter.com/#!/nov/status/85613699410296833', 'twitter link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'ebay link');

    raisesError(function() { run('% 23'); }, 'should raise an error for malformed urls');

  });



  method('escapeHTML', function() {

    test('<p>some text</p>', '&lt;p&gt;some text&lt;&#x2f;p&gt;', '<p>some text</p>');
    test('war & peace & food', 'war &amp; peace &amp; food', 'war & peace');
    test('&amp;', '&amp;amp;', 'double escapes &amp;');
    test('&lt;span&gt;already escaped, yo&lt;&#x2f;span&gt;', '&amp;lt;span&amp;gt;already escaped, yo&amp;lt;&amp;#x2f;span&amp;gt;', 'already escaped will be double-escaped');

    test("hell's", 'hell&apos;s', "works on '");
    test('I know that "feel" bro', 'I know that &quot;feel&quot; bro', 'works on "');
    test('feel the /', 'feel the &#x2f;', 'works on /');

  });

  method('unescapeHTML', function() {
    test('&lt;p&gt;some text&lt;/p&gt;', '<p>some text</p>', '<p>some text</p>');
    test('war &amp; peace &amp; food', 'war & peace & food', 'war & peace');
    test('<span>already unescaped, yo</span>', '<span>already unescaped, yo</span>', 'already unescaped will stay unescaped');
    test('hell&apos;s', "hell's", "works on '");
    test('I know that &quot;feel&quot; bro', 'I know that "feel" bro', 'works on "');
    test('feel the &#x2f;', 'feel the /', 'works on /');
    test('&amp;lt;', '&lt;', 'unescapes a single level of HTML escaping');
    test(run('&gt;', 'escapeHTML'), '&gt;', 'is the inverse of escapeHTML');
    test('&#32;', ' ', 'html code | space');
    test('&#33;', '!', 'html code | !');
    test('&#192;', 'À', 'html code | À');
    test('&#64257;', 'ﬁ', 'html code | upper latin');
    test('&#12354;', 'あ', 'html code | hiragana a');
    test('&#xC0;', 'À', 'hex code | À');
    test('&#x2b;', '+', 'hex code | +');
    test('&#x2B;', '+', 'hex code | uppercase | +');
    test('&#x3042;', 'あ', 'hex code | hiragana a');
    test('&nbsp;', ' ', 'non-breaking space');
  });


  // Ensure that btoa and atob don't leak in node
  if(environment == 'node') {
    equal(typeof btoa, 'undefined', 'btoa global does not exist in node');
    equal(typeof atob, 'undefined', 'atob global does not exist in node');
  }

  method('encodeBase64', function() {

    test('This webpage is not available', 'VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=', 'webpage');
    test('I grow, I prosper; Now, gods, stand up for bastards!', 'SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ==', 'gods');
    test('räksmörgås', 'csOka3Ntw7ZyZ8Olcw==', 'shrimp sandwich');
    test('rÃ¤ksmÃ¶rgÃ¥s', 'csODwqRrc23Dg8K2cmfDg8Klcw==', 'shrimp sandwich encoded');

    test('АБВ', '0JDQkdCS', 'Russian');
    test('日本語', '5pel5pys6Kqe', 'Japanese');
    test('にほんご', '44Gr44G744KT44GU', 'Hiragana');
    test('한국어', '7ZWc6rWt7Ja0', 'Korean');


  });

  method('decodeBase64', function() {

    test(run('АБВ', 'encodeBase64'), 'АБВ', 'inverse | Russian');
    test(run('日本語', 'encodeBase64'), '日本語', 'inverse | Japanese');
    test(run('にほんご', 'encodeBase64'), 'にほんご', 'inverse | Hiragana');
    test(run('한국어', 'encodeBase64'), '한국어', 'inverse | Korean');

    test('L2hvd2FyZHNmaXJld29ya3MvYXBpL29yZGVyLzc1TU0lMjBNSVg=', '/howardsfireworks/api/order/75MM%20MIX', '%20')

    test('VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=', 'This webpage is not available', 'webpage');
    test('SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ==', 'I grow, I prosper; Now, gods, stand up for bastards!', 'gods');

    test('@#$^#$^#@$^', '', 'non-base64 characters should produce a blank string');

  });

  method('capitalize', function() {

    test('reuben sandwich', 'Reuben sandwich', 'should capitalize first letter of first word only.');
    test('Reuben sandwich', 'Reuben sandwich', 'should leave the string alone');
    test('REUBEN SANDWICH', 'Reuben sandwich', 'should uncapitalize all other letters');
    test('фыва йцук', 'Фыва йцук', 'should capitalize unicode letters');

    test('', '', 'blank');
    test('wasabi', 'Wasabi', 'wasabi');
  });

  method('capitalize', [true], function() {

    test('reuben sandwich', 'Reuben Sandwich', 'should capitalize all first letters');
    test('Reuben sandwich', 'Reuben Sandwich', 'should capitalize the second letter only');
    test('REUBEN SANDWICH', 'Reuben Sandwich', 'should uncapitalize all other letters');
    test('фыва йцук', 'Фыва Йцук', 'should capitalize unicode letters');
    test('what a shame of a title', 'What A Shame Of A Title', 'all lower-case');
    test('What A Shame Of A Title', 'What A Shame Of A Title', 'already capitalized');
    test(' what a shame of a title    ', ' What A Shame Of A Title    ', 'preserves whitespace');
    test(' what a shame of\n a title    ', ' What A Shame Of\n A Title    ', 'preserves new lines');

    test('reuben-sandwich', 'Reuben-Sandwich', 'hyphen');
    test('reuben,sandwich', 'Reuben,Sandwich', 'comma');
    test('reuben;sandwich', 'Reuben;Sandwich', 'semicolon');
    test('reuben.sandwich', 'Reuben.Sandwich', 'period');
    test('reuben_sandwich', 'Reuben_Sandwich', 'underscore');
    test('reuben\nsandwich', 'Reuben\nSandwich', 'new line');
    test("reuben's sandwich", "Reuben's Sandwich", 'apostrophe should not trigger capitalize');
    test('фыва-йцук', 'Фыва-Йцук', 'Russian with hyphens');
    test('фыва,йцук', 'Фыва,Йцук', 'Russian with comma');
    test('фыва;йцук', 'Фыва;Йцук', 'Russian with semicolon');
    test('фыва7йцук', 'Фыва7Йцук', 'Russian with 7');

  });

  method('chars', function() {

    test('wasabi', ['w','a','s','a','b','i'], 'splits string into constituent chars');
    test(' wasabi \n', [' ','w','a','s','a','b','i',' ','\n'], 'should not trim whitespace');

  });

  var whiteSpace = '\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
  var lineTerminators = '\u000A\u000D\u2028\u2029';

  method('trimLeft', function() {
    test('   wasabi   ', 'wasabi   ', 'should trim left whitespace only');
    test('', '', 'blank');
    test(' wasabi ', 'wasabi ', 'wasabi with whitespace');
    test(whiteSpace, '', 'should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator"');
    test(lineTerminators, '', 'should trim all LineTerminator characters defined in 7.3');
  });

  method('trimRight', function() {
    test('   wasabi   ', '   wasabi', 'should trim right whitespace only');
    test('', '', 'blank');
    test(' wasabi ', ' wasabi', 'wasabi with whitespace');
    test(whiteSpace, '', 'should trim all WhiteSpace characters defined in 7.2 and Unicode "space, separator"');
    test(lineTerminators, '', 'should trim all LineTerminator characters defined in 7.3');
  });

  method('pad', function() {

    raisesError(function(){ run('wasabi', 'pad', [-1]); }, 'String#pad | -1 raises error');
    raisesError(function(){ run('wasabi', 'pad', [Infinity]); }, 'String#pad | Infinity raises error');

    test('wasabi', 'wasabi', 'no arguments default to 0');
    test('wasabi', [undefined], 'wasabi', 'undefined defaults to 0');
    test('wasabi', [null], 'wasabi', 'null defaults to 0');
    test('wasabi', [NaN], 'wasabi', 'NaN defaults to 0');

    test('wasabi', [0], 'wasabi', '0');
    test('wasabi', [1], 'wasabi', '1');
    test('wasabi', [2], 'wasabi', '2');
    test('wasabi', [3], 'wasabi', '3');
    test('wasabi', [4], 'wasabi', '4');
    test('wasabi', [5], 'wasabi', '5');
    test('wasabi', [6], 'wasabi', '6');
    test('wasabi', [7], 'wasabi ', '7');
    test('wasabi', [8], ' wasabi ', '8');
    test('wasabi', [9], ' wasabi  ', '9');
    test('wasabi', [10], '  wasabi  ', '10');
    test('wasabi', [12], '   wasabi   ', '12');
    test('wasabi', [20], '       wasabi       ', '12');

    test('wasabi', [8, '"'], '"wasabi"', 'padding with quotes');
    test('wasabi', [8, ''], 'wasabi', 'empty string should have no padding');
    test('wasabi', [8, 's'], 'swasabis', 'padding with s');
    test('wasabi', [8, 5], '5wasabi5', 'padding with a number');
    test('wasabi', [12, '-'], '---wasabi---', 'should pad the string with 6 hyphens');

  });

  method('padLeft', function() {

    raisesError(function() { run('wasabi', 'padLeft', [-1]); }, '-1 raises error');
    raisesError(function() { run('wasabi', 'padLeft', [Infinity]); }, 'Infinity raises error');

    test('wasabi', [0], 'wasabi', '0');
    test('wasabi', [1], 'wasabi', '1');
    test('wasabi', [2], 'wasabi', '2');
    test('wasabi', [3], 'wasabi', '3');
    test('wasabi', [4], 'wasabi', '4');
    test('wasabi', [5], 'wasabi', '5');
    test('wasabi', [6], 'wasabi', '6');
    test('wasabi', [7], ' wasabi', '7');
    test('wasabi', [8], '  wasabi', '8');
    test('wasabi', [9], '   wasabi', '9');
    test('wasabi', [10], '    wasabi', '10');
    test('wasabi', [12], '      wasabi', '12');
    test('wasabi', [20], '              wasabi', '20');
    test('wasabi', [12, '-'], '------wasabi', '12 with hyphens');
    test('wasabi', [12, '+'], '++++++wasabi', '12 with pluses');

  });

  method('padRight', function() {

    raisesError(function() { run('wasabi', 'padRight', [-1]); }, '-1 raises error');
    raisesError(function() { run('wasabi', 'padRight', [Infinity]); }, 'Infinity raises error');

    test('wasabi', [0], 'wasabi', '0');
    test('wasabi', [1], 'wasabi', '1');
    test('wasabi', [2], 'wasabi', '2');
    test('wasabi', [3], 'wasabi', '3');
    test('wasabi', [4], 'wasabi', '4');
    test('wasabi', [5], 'wasabi', '5');
    test('wasabi', [6], 'wasabi', '6');
    test('wasabi', [7], 'wasabi ', '7');
    test('wasabi', [8], 'wasabi  ', '8');
    test('wasabi', [9], 'wasabi   ', '9');
    test('wasabi', [10], 'wasabi    ', '10');
    test('wasabi', [12], 'wasabi      ', '12');
    test('wasabi', [20], 'wasabi              ', '20');
    test('wasabi', [12, '-'], 'wasabi------', '12 with hyphens');
    test('wasabi', [12, '+'], 'wasabi++++++', '12 with pluses');

  });

  method('repeat', function() {

    test('wasabi', [0], '', '0 should repeat the string 0 times');
    test('wasabi', [1], 'wasabi', 'repeating 1 time');
    test('wasabi', [2], 'wasabiwasabi', '2 should repeat the string 2 times');
    test('wasabi', [2.5], 'wasabiwasabi', '2.5 should floor to 2 times');


    test(true, [3], 'truetruetrue', 'boolean coerced to string');
    test({}, [3], '[object Object][object Object][object Object]', 'object coerced to string');
    test(1, [3], '111', 'number coerced to string');
    test('a', ['3'], 'aaa', 'count should be coerced to number');
    test('a', ['a'], '', 'NaN coercions should be 0');

    var undefinedContext = (function(){ return this; }).call(undefined);

    // Can't test this in IE etc where calling with null
    // context reverts back to the global object.
    if(undefinedContext === undefined) {
      raisesError(function(){ run(undefined, 'repeat'); }, 'raises error on undefined');
      raisesError(function(){ run(null, 'repeat'); }, 'raises error on null');
    }

    raisesError(function(){ run('a', 'run', [-1]); }, 'negative number raises error');
    raisesError(function(){ run('a', 'run', [Infinity]); }, 'Infinity raises error');
    raisesError(function(){ run('a', 'run', [-Infinity]); }, '-Infinity raises error');

  });

  method('each', function() {

    var callbackTest, result;

    // "each" will return an array of everything that was matched, defaulting to individual characters
    test('g', ['g'], 'each should return an array of each char');


    callbackTest = function(str, i) {
      equal(str, 'g', 'char should be passed as the first argument');
    }

    // Each without a first parameter assumes "each character"
    result = run('g', 'each', [callbackTest]);
    equal(result, ['g'], "['g'] should be the resulting value");


    var counter = 0, result, callback;
    callback = function(str, i) {
      equal(str, 'ginger'.charAt(counter), 'char should be passed as the first argument');
      equal(i, counter, 'index should be passed as the second argument');
      counter++;
    }
    result = run('ginger', 'each', [callback]);
    equal(counter, 6, 'should have ran 6 times');
    equal(result, ['g','i','n','g','e','r'], 'resulting array should contain all the characters');


    var counter = 0, result, callback;

    callback = function(str, i) {
      equal(str, 'g', 'string argument | match should be passed as the first argument to the block');
      counter++;
    }

    result = run('ginger', 'each', ['g', callback]);
    equal(counter, 2, 'string argument | should have ran 2 times');
    equal(result, ['g','g'], "string argument | resulting array should be ['g','g']");


    var counter = 0, result, callback, arr;
    arr = ['g','i','g','e'];

    callback = function(str, i) {
      equal(str, arr[i], 'regexp argument | match should be passed as the first argument to the block');
      counter++;
    }

    result = run('ginger', 'each', [/[a-i]/g, callback]);
    equal(counter, 4, 'regexp argument | should have ran 4 times');
    equal(result, ['g','i','g','e'], "regexp argument | resulting array should have been ['g','i','g','e']");


    // .each should do the same thing as String#scan in ruby except that .each doesn't respect capturing groups
    var testString = 'cruel world';

    test(testString, [/\w+/g], ['cruel', 'world'], 'complex regexp | /\\w+/g');
    test(testString, [/.../g], ['cru', 'el ', 'wor'], 'complex regexp | /.../g');
    test(testString, [/(..)(..)/g], ['crue', 'l wo'], 'complex regexp | /(..)(..)/g');
    test(testString, [/\w+/], ['cruel', 'world'], 'non-global regexes should still be global');

    test('', ['f'], [], 'empty string | each f');
    test('', [/foo/], [], 'empty string | each /foo/');
    test('', [function() {}], [], 'empty string | passing a block');


    var letters = [], result, fn;
    fn = function(l) {
      letters.push(l);
      return false;
    }
    result = run('foo', 'each', [fn])

    equal(result, ['f'], 'returning false should break the loop - result');
    equal(letters, ['f'], 'returning false should break the loop - pushed');

  });

  method('shift', function() {

    test('ク', [1], 'グ', 'should shift 1 code up');
    test('グ', [-1], 'ク', 'should shift 1 code down');
    test('ヘ', [2], 'ペ', 'should shift 2 codes');
    test('ペ', [-2], 'ヘ', 'should shift -2 codes');
    test('ク', [0], 'ク', 'should shift 0 codes');
    test('ク', 'ク', 'no params simply returns the string');
    test('カキクケコ', [1], 'ガギグゲゴ', 'multiple characters up one');
    test('ガギグゲゴ', [-1], 'カキクケコ', 'multiple characters down one');

  });


  method('map', function() {

    var counter = 0, ctx = { foo: 'bar' };
    var fn = function(l, i, str) {
      equal(i, counter, 'index should be passed');
      equal(str, 'abcd', 'string should be passed');
      equal(this, ctx, 'context should be passable');
      counter++;
      return String.fromCharCode(l.charCodeAt(0) + 1);
    }

    test('abcd', [fn, ctx], 'bcde', 'asfdsa');

  });

  method('codes', function() {

    var counter = 0, result;
    var arr = [103,105,110,103,101,114];
    var callback = function(str, i) {
      equal(str, arr[i], 'char code should have been passed into the block');
      counter++;
    }

    test('jumpy', [106,117,109,112,121], 'jumpy');

    result = run('ginger', 'codes', [callback]);
    equal(counter, 6, 'should have ran 6 times');
    equal(result, arr, 'result should be an array');

    test('', [], 'empty string');
  });

  method('chars', function() {

    var counter = 0, result;
    var callback = function(str, i) {
      equal(str, 'ginger'.charAt(counter), 'char code should be the first argument in the block');
      equal(i, counter, 'index should be the second argument in the block');
      counter++;
    };

    result = run('ginger', 'chars', [callback]);
    equal(counter, 6, 'should have run 6 times');
    equal(result, ['g','i','n','g','e','r'], 'result should be an array');

    // test each char collects when properly returned
    counter = 0;
    callback = function(str, i) {
      counter++;
      return str.toUpperCase();
    }
    result = run('ginger', 'chars', [callback]);
    equal(result, ['G','I','N','G','E','R'], 'can be mapped');

    test('', [], 'empty string');
  });

  method('words', function() {
    var counter = 0, result, callback;
    var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
    var arr = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
    var callback = function(str, i) {
      equal(str, arr[i], 'match is the first argument');
      counter++;
    };

    result = run(sentence, 'words', [callback]);
    equal(counter, 6, 'should have run 6 times');
    equal(result, arr, 'result should be an array of matches');

    test('', [], 'empty string');
  });

  method('lines', function() {
    var counter = 0, result, callback;
    var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!\n\n\n\n';
    var arr = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
    var callback = function(str, i) {
      equal(str, arr[i], 'match is the first argument');
      counter++;
    };

    result = run(paragraph, 'lines', [callback]);
    equal(counter, 7, 'should have run 7 times');
    equal(result, arr, 'result should be an array of matches');

    callback = function(str, i) {
      return run(str, 'capitalize');
    }
    result = run('one\ntwo', 'lines', [callback]);
    equal(['One','Two'], result, 'lines can be modified');

    test('', [''], 'empty string');
  });

  method('paragraphs', function() {
    var counter = 0;
    var essay = 'the history of the united states\n\n';
    essay +=    'it all began back in 1776 when someone declared something from someone.\n';
    essay +=    'it was at this point that we had to get our rears in gear\n\n';
    essay +=    'The British got their revenge in the late 60s with the British Invasion,\n';
    essay +=    'which claimed the lives of over 32,352 young women across the nation.\n\n\n\n\n';
    essay +=    'The End\n\n\n\n\n\n\n';
    var arr = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
    var callback = function(str, i) {
      equal(str, arr[i], 'match is the first argument');
      counter ++;
    };
    result = run(essay, 'paragraphs', [callback]);
    equal(counter, 4, 'should have run 4 times');
    equal(result, arr, 'result should be an array of matches');

    test('', [''], 'empty string');
  });


  method('isBlank', function() {

    test('', true, 'blank string');
    test('0', false, '0');
    test('            ', true, 'successive blanks');
    test('\n', true, 'new line');
    test('\t\t\t\t', true, 'tabs');
    test('日本語では　「マス」　というの知ってた？', false, 'japanese');
    test('mayonnaise', false, 'mayonnaise');
  });

  method('add', function() {
    test('schfifty', [' five'], 'schfifty five', 'schfifty five');
    test('dopamine', ['e', 3], 'dopeamine', 'dopeamine');
    test('spelling eror', ['r', -3], 'spelling error', 'add from the end');
    test('flack', ['a', 0], 'aflack', 'add at 0');
    test('five', ['schfifty', 20], 'fiveschfifty', 'adds out of positive range');
    test('five', ['schfifty ', -20], 'schfifty five', 'adds out of negative range');
    test('five', ['schfifty', 4], 'fiveschfifty', 'add at position 4');
    test('five', ['schfifty', 5], 'fiveschfifty', 'add at position 5');
    test('', [['schfifty', ' five']], 'schfifty, five', 'arrays are stringified');
  });

  method('remove', function() {
    test('schfifty five', ['five'], 'schfifty ', 'five');
    test('schfifty five', [/five/], 'schfifty ', '/five/');
    test('schfifty five', [/f/], 'schifty five', '/f/');
    test('schfifty five', [/f/g], 'schity ive', '/f/g');
    test('schfifty five', [/[a-f]/g], 'shity iv', '/[a-f]/');
    test('?', ['?'], '', 'strings have tokens escaped');
    test('?(', ['?('], '', 'strings have all tokens escaped');
  });

  method('insert', function() {
    test('schfifty', [' five'], 'schfifty five', 'schfifty five');
    test('dopamine', ['e', 3], 'dopeamine', 'dopeamine');
    test('spelling eror', ['r', -3], 'spelling error', 'inserts from the end');
    test('flack', ['a', 0], 'aflack', 'inserts at 0');
    test('five', ['schfifty', 20], 'fiveschfifty', 'adds out of positive range');
    test('five', ['schfifty', -20], 'schfiftyfive', 'adds out of negative range');
    test('five', ['schfifty', 4], 'fiveschfifty', 'inserts at position 4');
    test('five', ['schfifty', 5], 'fiveschfifty', 'inserts at position 5');
    test('abcd', ['X', 2], 'abXcd', 'X | 2');
    test('abcd', ['X', 1], 'aXbcd', 'X | 1');
    test('abcd', ['X', 0], 'Xabcd', 'X | 0');
    test('abcd', ['X', -1], 'abcXd', 'X | -1');
    test('abcd', ['X', -2], 'abXcd', 'X | -2');

    test('', ['-', 0], '-', '- inserted at 0');
    test('b', ['-', 0], '-b', 'b inserted at 0');
    test('b', ['-', 1], 'b-', 'b inserted at 1');
  });

  method('toNumber', function() {

    test('4em', 4, '4em');
    test('10px', 10, '10px');
    test('10,000', 10000, '10,000');
    test('5,322,144,444', 5322144444, '5,322,144,444');
    test('10.532', 10.532, '10.532');
    test('10', 10, '10');
    test('95.25%', 95.25, '95.25%');
    test('10.848', 10.848, '10.848');

    test('1234blue', 1234, '1234blue');
    test('22.5', 22.5, '22.5');

    test('010', 10, '"010" should be 10');
    test('0908', 908, '"0908" should be 908');
    test('22.34.5', 22.34, '"22.34.5" should be 22.34');

    test('1.45kg', 1.45, '"1.45kg"');
    test('77.3', 77.3, '77.3');
    test('077.3', 77.3, '"077.3" should be 77.3');
    test('.3', 0.3, '".3" should be 0.3');
    test('0.1e6', 100000, '"0.1e6" should be 100000');

    test('２００', 200, 'full-width | should work on full-width integers');
    test('５．２３４５', 5.2345, 'full-width | should work on full-width decimals');

    equal(isNaN(run('0xA')), false, '"0xA" should not be NaN');
    equal(isNaN(run('blue')), true, '"blue" should not be NaN');
    equal(isNaN(run('........')), true, '"......." should be NaN');
    equal(isNaN(run('0x77.3')), false, '"0x77.3" is not NaN');

  });

  // Hexadecimal
  method('toNumber', [16], function() {
    test('ff', 255, 'ff');
    test('00', 0, '00');
    test('33', 51, '33');
    test('66', 102, '66');
    test('99', 153, '99');
    test('bb', 187, 'bb');
  });


  method('reverse', function() {
    test('spoon', 'noops', 'spoon');
    test('amanaplanacanalpanama', 'amanaplanacanalpanama', 'amanaplanacanalpanama');
    test('', '', 'blank');
    test('wasabi', 'ibasaw', 'wasabi');
  });


  method('compact', function() {
    var largeJapaneseSpaces = '　　　日本語　　　　　の　　　　　スペース　　　　　も　　';
    var compactedWithoutJapaneseSpaces = '日本語　の　スペース　も';
    var compactedWithTrailingJapaneseSpaces = '　日本語　の　スペース　も　';

    test('the rain in     spain    falls mainly   on     the        plain', 'the rain in spain falls mainly on the plain', 'basic');
    test('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n', 'the rain in spain falls mainly on the plain', 'with newlines');
    test('\n\n\n\n           \t\t\t\t          \n\n      \t', '', 'with newlines and tabs');

    test('moo\tmoo', 'moo moo', 'moo moo tab');
    test('moo \tmoo', 'moo moo', 'moo moo space tab');
    test('moo \t moo', 'moo moo', 'moo moo space tab space');

    test('', '', 'blank');
    test('run   tell    dat', 'run tell dat', 'with extra whitespace');
  });


  method('at', function() {
    test('foop', [0], 'f', 'pos 0');
    test('foop', [1], 'o', 'pos 1');
    test('foop', [2], 'o', 'pos 2');
    test('foop', [3], 'p', 'pos 3');
    test('foop', [4], 'f', 'pos 4');
    test('foop', [5], 'o', 'pos 5');
    test('foop', [1224], 'f', 'out of bounds');
    test('foop', [-1], 'p', 'negative | pos -1');
    test('foop', [-2], 'o', 'negative | pos -2');
    test('foop', [-3], 'o', 'negative | pos -3');
    test('foop', [-4], 'f', 'negative | pos -4');
    test('foop', [-5], 'p', 'negative | pos -5');
    test('foop', [-1224], 'f', 'negative | out of bounds');

    test('foop', [0, false], 'f', 'pos 0');
    test('foop', [1, false], 'o', 'pos 1');
    test('foop', [2, false], 'o', 'pos 2');
    test('foop', [3, false], 'p', 'pos 3');
    test('foop', [4, false], '', 'pos 4');
    test('foop', [1224, false], '', 'out of bounds');
    test('foop', [-1, false], '', 'negative | pos -1');
    test('foop', [-2, false], '', 'negative | pos -2');
    test('foop', [-3, false], '', 'negative | pos -3');
    test('foop', [-4, false], '', 'negative | pos -4');
    test('foop', [-5, false], '', 'negative | pos -5');
    test('foop', [-1224, false], '', 'negative | out of bounds');

    test('wowzers', [0,2,4,6], ['w','w','e','s'], 'handles enumerated params');
    test('wowzers', [0,2,4,6,18], ['w','w','e','s','e'], 'handles enumerated params');
    test('wowzers', [0,2,4,6,18,false], ['w','w','e','s',''], 'handles enumerated params');

    test('', [3], '', 'blank');
    test('wasabi', [0], 'w', 'wasabi at pos 0');
  });


  method('first', function() {
    test('quack', 'q', 'first character');
    test('quack', [2], 'qu', 'first 2 characters');
    test('quack', [3], 'qua', 'first 3 characters');
    test('quack', [4], 'quac', 'first 4 characters');
    test('quack', [20], 'quack', 'first 20 characters');
    test('quack', [0], '', 'first 0 characters');
    test('quack', [-1], '', 'first -1 characters');
    test('quack', [-5], '', 'first -5 characters');
    test('quack', [-10], '', 'first -10 characters');
    test('', '', 'blank');
    test('wasabi', 'w', 'no params');
  });


  method('last', function() {
    test('quack', 'k', 'last character');
    test('quack', [2], 'ck', 'last 2 characters');
    test('quack', [3], 'ack', 'last 3 characters');
    test('quack', [4], 'uack', 'last 4 characters');
    test('quack', [10], 'quack', 'last 10 characters');
    test('quack', [-1], '', 'last -1 characters');
    test('quack', [-5], '', 'last -5 characters');
    test('quack', [-10], '', 'last -10 characters');

    test('fa', [3], 'fa', 'last 3 characters');
    test('', '', 'lank');
    test('wasabi', 'i', 'o params');
  });


  method('from', function() {
    test('quack', 'quack', 'no params');
    test('quack', [0], 'quack', 'from 0');
    test('quack', [2], 'ack', 'from 2');
    test('quack', [4], 'k', 'from 4');
    test('quack', [-1], 'k', 'from -1');
    test('quack', [-3], 'ack', 'from -3');
    test('quack', [-4], 'uack', 'from -4');
    test('quack', ['q'], 'quack', 'strings | q');
    test('quack', ['u'], 'uack', 'strings | u');
    test('quack', ['a'], 'ack', 'strings | a');
    test('quack', ['k'], 'k', 'strings | k');
    test('quack', [''], 'quack', 'strings | empty string');
    test('quack', ['ua'], 'uack', 'strings | 2 characters');
    test('quack', ['uo'], '', 'strings | 2 non-existent characters');
    test('quack', ['quack'], 'quack', 'strings | full string');

    test('', [0], '', 'lank');
    test('wasabi', [3], 'abi', 'rom pos 3');
  });


  method('to', function() {
    test('quack', 'quack', 'no params');
    test('quack', [0], '', 'to 0');
    test('quack', [1], 'q', 'to 1');
    test('quack', [2], 'qu', 'to 2');
    test('quack', [4], 'quac', 'to 4');
    test('quack', [-1], 'quac', 'to -1');
    test('quack', [-3], 'qu', 'to -3');
    test('quack', [-4], 'q', 'to -4');
    test('quack', ['q'], '', 'strings | q');
    test('quack', ['u'], 'q', 'strings | u');
    test('quack', ['a'], 'qu', 'strings | a');
    test('quack', ['k'], 'quac', 'strings | k');
    test('quack', [''], '', 'strings | empty string');
    test('quack', ['ua'], 'q', 'strings | 2 characters');
    test('quack', ['uo'], '', 'strings | 2 non-existent characters');
    test('quack', ['quack'], '', 'strings | full string');

    test('', [0], '', 'nk');
    test('wasabi', [3], 'was', 'pos 3');
  });

  method('dasherize', function() {
    test('hop_on_pop', 'hop-on-pop', 'underscores');
    test('HOP_ON_POP', 'hop-on-pop', 'capitals and underscores');
    test('hopOnPop', 'hop-on-pop', 'camel-case');
    test('watch me fail', 'watch-me-fail', 'whitespace');
    test('watch me fail_sad_face', 'watch-me-fail-sad-face', 'whitespace sad face');
    test('waTch me su_cCeed', 'wa-tch-me-su-c-ceed', 'complex whitespace');
    test('aManAPlanACanalPanama', 'a-man-a-plan-a-canal-panama', 'single characters');
    test('', '', 'blank');
    test('noFingWay', 'no-fing-way', 'noFingWay');
  });


  method('camelize', function() {
    test('hop-on-pop', 'HopOnPop', 'dashes');
    test('HOP-ON-POP', 'HopOnPop', 'capital dashes');
    test('hop_on_pop', 'HopOnPop', 'underscores');
    test('watch me fail', 'WatchMeFail', 'whitespace');
    test('watch   me   fail', 'WatchMeFail', 'long whitespace');
    test('watch me fail-sad-face', 'WatchMeFailSadFace', 'whitespace sad face');
    test('waTch me su-cCeed', 'WaTchMeSuCCeed', 'complex whitespace');

    test('', '', 'blank');
    test('no-fing-way', 'NoFingWay', 'no-fing-way');
  });

  method('camelize', [false], function() {
    test('hop-on-pop', 'hopOnPop', 'first false | dashes');
    test('HOP-ON-POP', 'hopOnPop', 'first false | capital dashes');
    test('hop_on_pop', 'hopOnPop', 'first false | underscores');
    test('watch me fail', 'watchMeFail', 'first false | whitespace');
    test('watch me fail-sad-face', 'watchMeFailSadFace', 'first false | whitespace sad face');
    test('waTch me su-cCeed', 'waTchMeSuCCeed', 'first false | complex whitespace');

  });

  method('camelize', [true], function() {
    test('hop-on-pop', 'HopOnPop', 'first true | dashes');
    test('HOP-ON-POP', 'HopOnPop', 'first true | capital dashes');
    test('hop_on_pop', 'HopOnPop', 'first true | underscores');
  });


  method('underscore', function() {
    test('hopOnPop', 'hop_on_pop', 'camel-case');
    test('HopOnPop', 'hop_on_pop', 'camel-case capital first');
    test('HOPONPOP', 'hoponpop', 'all caps');
    test('HOP-ON-POP', 'hop_on_pop', 'caps and dashes');
    test('hop-on-pop', 'hop_on_pop', 'lower-case and dashes');
    test('watch me fail', 'watch_me_fail', 'whitespace');
    test('watch   me   fail', 'watch_me_fail', 'long whitespace');
    test('watch me fail-sad-face', 'watch_me_fail_sad_face', 'whitespace sad face');
    test('waTch me su-cCeed', 'wa_tch_me_su_c_ceed', 'complex whitespace');

    test('', '', 'blank');
    test('noFingWay', 'no_fing_way', 'noFingWay');
  });


  method('spacify', function() {
    test('hopOnPop', 'hop on pop', 'camel-case');
    test('HopOnPop', 'hop on pop', 'camel-case capital first');
    test('HOPONPOP', 'hoponpop', 'all caps');
    test('HOP-ON-POP', 'hop on pop', 'caps and dashes');
    test('hop-on-pop', 'hop on pop', 'lower-case and dashes');
    test('watch_me_fail', 'watch me fail', 'whitespace');
    test('watch-meFail-sad-face', 'watch me fail sad face', 'whitespace sad face');
    test('waTch me su-cCeed', 'wa tch me su c ceed', 'complex whitespace');
  });

  method('stripTags', function() {
    var stripped, html, allStripped, malformed;

    html =
    '<div class="outer">' +
    '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';
    allStripped = 'text with links, &quot;entities&quot; and bold tags';
    malformed = '<div class="outer"><p>paragraph';
    stripped =
    '<div class="outer">' +
    '<p>text with links, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';

    test(html, ['a'], stripped, 'stripped a tags');
    equal(run(html, 'stripTags', ['a']) == html, false, 'stripped <a> tags was changed');


    stripped =
    '<div class="outer">' +
    '<p>text with links, &quot;entities&quot; and bold tags</p>' +
    '</div>';
    test(html, ['a', 'b'], stripped, 'stripped <a> and <b> tags');
    test(html, [['a', 'b']], stripped, 'array | stripped <a> and <b> tags');


    stripped =
    '<div class="outer">' +
    'text with links, &quot;entities&quot; and <b>bold</b> tags' +
    '</div>';
    test(html, ['p', 'a'], stripped, 'stripped <p> and <a> tags');
    test(html, [['p', 'a']], stripped, 'array | stripped <p> and <a> tags');


    stripped = '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>';
    test(html, ['div'], stripped, 'stripped <div> tags');


    stripped = 'text with links, &quot;entities&quot; and bold tags';
    test(html, stripped, 'all tags stripped');


    stripped = '<p>paragraph';
    test(malformed, ['div'], stripped, 'malformed | div tag stripped');

    stripped = '<div class="outer">paragraph';
    test(malformed, ['p'], stripped, 'malformed | p tags stripped');

    stripped = 'paragraph';
    test(malformed, stripped, 'malformed | all tags stripped');

    test('<b NOT BOLD</b>', '<b NOT BOLD', "does not strip tags that aren't properly closed");
    test('a < b', 'a < b', 'does not strip less than');
    test('a > b', 'a > b', 'does not strip greater than');
    test('</foo  >>', '>', 'strips closing tags with white space');


    // Stipping self-closing tags
    test('<input type="text" class="blech" />', '', 'full input stripped');
    test('<b>bold<b> and <i>italic</i> and <a>link</a>', ['b','i'], 'bold and italic and <a>link</a>', 'handles multi args');

    html =
    '<form action="poo.php" method="post">' +
    '<p>' +
    '<label>label for text:</label>' +
    '<input type="text" value="brabra" />' +
    '<input type="submit" value="submit">' +
    '</p>' +
    '</form>';

    test(html, 'label for text:', 'form | all tags removed');
    test(html, ['input'], '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'form | input tags stripped');
    test(html, ['input', 'p', 'form'], '<label>label for text:</label>', 'form | input, p, and form tags stripped');

    // Stripping namespaced tags
    test('<xsl:template>foobar</xsl:template>', 'foobar', 'strips tags with xml namespaces');
    test('<xsl:template>foobar</xsl:template>', ['xsl:template'], 'foobar', 'strips xsl:template');
    test('<xsl/template>foobar</xsl/template>', ['xsl/template'], 'foobar', 'strips xsl/template');

    // No errors on RegExp

    test('<xsl(template>foobar</xsl(template>', ['xsl(template'], 'foobar', 'no regexp errors on tokens');
    test('<?>ella</?>', ['?'], 'ella', '? token');

    test('', '', 'String#stripTags | blank');
    test('chilled <b>monkey</b> brains', 'chilled monkey brains', 'chilled <b>monkey</b> brains');


    // Self-closing

    test('<img src="cool.jpg" data-face="nice face!" />', '', 'can strip image tags');
    test('<img src="cool.jpg" data-face="nice face!"/>', '', 'can strip image tags with no space');
    test('<img src="cool.jpg" data-face="nice face!" / >', '', 'can strip image tags with trailing space');
    test('<img src="cool.jpg" data-face="nice face!">', '', 'can strip void tag');

    test('<IMG src="cool.jpg" data-face="nice face!" />', '', 'caps | can strip image tags');
    test('<IMG src="cool.jpg" data-face="nice face!"/>', '', 'caps | can strip image tags with no space');
    test('<IMG src="cool.jpg" data-face="nice face!" / >', '', 'caps | can strip image tags with trailing space');
    test('<IMG src="cool.jpg" data-face="nice face!">', '', 'caps | can strip void tag');

    test('<img src="cool.jpg">', ['IMG'], '', 'can strip when tag name capitalized');


    // Other
    test('<span>some text</span> then closing</p>', 'some text then closing', 'can handle final malformed closer');
    test('foo </p> bar </p>', 'foo  bar ', 'two unmatched closing tags');


    // Issue #410 - replacing stripped tags

    var fn = function() { return 'bar'; };
    test('<span>foo</span>', [fn], 'bar', 'replaces content with result of callback');

    var fn = function() { return ''; };
    test('<span>foo</span>', [fn], '', 'replaces content with empty string');

    var fn = function() { return; };
    test('<span>foo</span>', [fn], 'foo', 'returning undefined removes as normal');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!" />', [fn], 'wow', 'can replace self-closing tags');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!"> noway', [fn], 'wow noway', 'can replace void tag');

    var fn = function() { return 'wow'; };
    test('<IMG SRC="cool.jpg" DATA-FACE="nice face!"> noway', [fn], 'wow noway', 'can replace void tag with caps');

    var fn = function(a,b,c) { return c; };
    test('<span></span>', [fn], '', 'attributes should be blank');

    var fn = function(a,b,c) { return c; };
    test('<span class="orange"></span>', [fn], 'class="orange"', 'attributes should not be blank');


    var str = 'which <b>way</b> to go';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'b', 'first argument should be the tag name');
      equal(content, 'way', 'second argument should be the tag content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return '|' + content + '|';
    }
    test(str, [fn], 'which |way| to go', 'stripped tag should be replaced');

    var str = '<div>fun and</div><p>run</p><p>together</p>';
    var fn = function(tag, content, s) {
      if(tag === 'p') {
        return ' ' + content;
      }
    }
    test(str, ['p', fn], '<div>fun and</div> run together', 'can space out run-together tags');

    var str = '<span>very<span>nested<span>spans<span>are<span>we</span></span></span></span></span>';
    var expectedContent = [
      'very<span>nested<span>spans<span>are<span>we</span></span></span></span>',
      'nested<span>spans<span>are<span>we</span></span></span>',
      'spans<span>are<span>we</span></span>',
      'are<span>we</span>',
      'we'
    ];
    var count = 0;
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'span', 'first argument should be the tag');
      equal(content, expectedContent[count++], 'second argument should be the content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return content;
    }
    test(str, [fn], 'verynestedspansarewe', 'stripped tag should be replaced');
    equal(count, 5, 'should have run 5 times');

    var str = '<p>paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro" /> and thats all</p>';
    var expected = [
      {
        tag: 'p',
        content: 'paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro" /> and thats all',
        attributes: ''
      },
      {
        tag: 'b',
        content: 'some bold text',
        attributes: ''
      },
      {
        tag: 'img',
        content: '',
        attributes: 'src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"'
      }
    ];
    var count = 0;
    var fn = function(tag, content, attributes, s) {
      var obj = expected[count++];
      equal(tag, obj.tag, 'first argument should be the tag name');
      equal(content, obj.content, 'second argument should be the tag content');
      equal(attributes, obj.attributes, 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
    }
    test(str, [fn], 'paragraph with some bold text and an image  and thats all', 'complex: all tags should be stripped');
    equal(count, 3, 'complex: should have run 3 times');

    var str = '<p>paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"> and thats all</p>';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'img', 'first argument is img');
      equal(content, '', 'second argument is empty');
      equal(attributes, 'src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return 'not!';
    }
    test(str, ['img', fn], '<p>paragraph with <b>some bold text</b> and an image not! and thats all</p>', 'img tag should have been replaced');

    var str = 'one <div                  class          =       "             bar              "  ></div          > two';
    test(str, ['div'], 'one  two', 'very spaced out div tag');

  });


  method('removeTags', function() {
    var html, malformed, removed;
    malformed = '<div class="outer"><p>paragraph';

    html =
    '<div class="outer">' +
    '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';

    removed =
    '<div class="outer">' +
    '<p>text with , &quot;entities&quot; and <b>bold</b> tags</p>' +
    '</div>';
    test(html, ['a'], removed, '<a> tag removed');
    equal(run(html, 'removeTags', ['a']) == html, false, 'html was changed');

    removed =
    '<div class="outer">' +
    '<p>text with , &quot;entities&quot; and  tags</p>' +
    '</div>';
    test(html, ['a', 'b'], removed, '<a> and <b> tags removed');
    test(html, [['a', 'b']], removed, 'array | <a> and <b> tags removed');


    removed =
    '<div class="outer"></div>';
    test(html, ['p', 'a'], removed, '<p> and <a> tags removed');
    test(html, [['p', 'a']], removed, 'array | <p> and <a> tags removed');


    test(html, ['div'], '', '<div> tags removed');
    test(html, '', 'removing all tags');

    test(malformed, ['div'], '', 'malformed | <div> tags removed');
    test(malformed, ['p'], '<div class="outer">', 'malformed | <p> tags removed');
    test(malformed, '', 'malformed | all tags removed');

    test('<b NOT BOLD</b>', '<b NOT BOLD', 'should strip unmatched closing tags');
    test('a < b', 'a < b', 'less than unaffected');
    test('a > b', 'a > b', 'greater than unaffected');
    test('</foo  >>', '>', 'malformed closing tag removed');

    // Stipping self-closing tags
    test('<input type="text" class="blech" />', '', 'self-closing');

    html =
    '<form action="poo.php" method="post">' +
    '<p>' +
    '<label>label for text:</label>' +
    '<input type="text" value="brabra" />' +
    '<input type="submit" value="submit" />' +
    '</p>' +
    '</form>';

    test(html, '', 'form | removing all tags');
    test(html, ['input'], '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'form | removing input tags');
    test(html, ['input', 'p', 'form'], '', 'form | removing input, p, and form tags');

    // Stripping namespaced tags
    test('<xsl:template>foobar</xsl:template>', '', 'form | xml namespaced tags removed');
    test('<xsl:template>foobar</xsl:template>', ['xsl:template'], '', 'form | xsl:template removed');
    test('<xsl/template>foobar</xsl/template>', ['xsl/template'], '', 'form | xsl/template removed');
    test('<xsl(template>foobar</xsl(template>', ['xsl(template'], '', 'form | xsl(template removed');

    test('<b>bold</b> and <i>italic</i> and <a>link</a>', ['b','i'], ' and  and <a>link</a>', 'handles multi args');
    test('', '', 'blank');
    test('chilled <b>monkey</b> brains', 'chilled  brains', 'chilled <b>monkey</b> brains');

    // No errors on regex.
    test('howdy<?>ella</?>', 'howdy', 'handles regex tokens');

    // Self-closing

    test('<img src="cool.jpg" data-face="nice face!" />', '', 'can strip image tags');
    test('<img src="cool.jpg" data-face="nice face!"/>', '', 'can strip image tags with no space');
    test('<img src="cool.jpg" data-face="nice face!" / >', '', 'can strip image tags with trailing space');
    test('<img src="cool.jpg" data-face="nice face!">', '', 'can strip void tag');

    test('<IMG src="cool.jpg" data-face="nice face!" />', '', 'caps | can strip image tags');
    test('<IMG src="cool.jpg" data-face="nice face!"/>', '', 'caps | can strip image tags with no space');
    test('<IMG src="cool.jpg" data-face="nice face!" / >', '', 'caps | can strip image tags with trailing space');
    test('<IMG src="cool.jpg" data-face="nice face!">', '', 'caps | can strip void tag');

    test('<img src="cool.jpg">', ['IMG'], '', 'can strip when tag name capitalized');


    // Other
    test('<span>some text</span> then closing</p>', ' then closing', 'can handle final malformed closer');
    test('foo </p> bar </p>', 'foo  bar ', 'two unmatched closing tags');


    // Issue #410 - replacing stripped tags

    var fn = function() { return 'bar'; };
    test('<span>foo</span>', [fn], 'bar', 'replaces content with result of callback');

    var fn = function() { return ''; };
    test('<span>foo</span>', [fn], '', 'replaces content with empty string');

    var fn = function() { return; };
    test('<span>foo</span>', [fn], '', 'returning undefined strips as normal');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!" />', [fn], 'wow', 'can replace self-closing tags');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!"> noway', [fn], 'wow noway', 'can replace void tag');

    var fn = function() { return 'wow'; };
    test('<IMG SRC="cool.jpg" DATA-FACE="nice face!"> noway', [fn], 'wow noway', 'can replace void tag with caps');

    var fn = function(a,b,c) { return c; };
    test('<span></span>', [fn], '', 'attributes should be blank');

    var str = 'which <b>way</b> to go';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'b', 'first argument should be the tag name');
      equal(content, 'way', 'second argument should be the tag content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
    }
    test(str, [fn], 'which  to go', 'stripped tag should be replaced');

    var str = '<div>fun and</div><p>run</p><p>together</p>';
    var fn = function(tag, content, s) {
      if(tag === 'p') {
        return ' ' + content;
      }
    }
    test(str, ['p', fn], '<div>fun and</div> run together', 'can space out run-together tags');

    var str = '<span>very<span>nested<span>spans<span>are<span>we</span></span></span></span></span>';
    var expectedContent = [
      'very<span>nested<span>spans<span>are<span>we</span></span></span></span>',
      'nested<span>spans<span>are<span>we</span></span></span>',
      'spans<span>are<span>we</span></span>',
      'are<span>we</span>',
      'we'
    ];
    var count = 0;
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'span', 'first argument should be the tag');
      equal(content, expectedContent[count++], 'second argument should be the content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return content;
    }
    test(str, [fn], 'verynestedspansarewe', 'stripped tag should be replaced');
    equal(count, 5, 'should have run 5 times');

    var str = 'this is a <p>paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro" /> and thats all</p>';
    var expected = [
      {
        tag: 'p',
        content: 'paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro" /> and thats all',
        attributes: ''
      },
      {
        tag: 'b',
        content: 'some bold text',
        attributes: ''
      },
      {
        tag: 'img',
        content: '',
        attributes: 'src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"'
      }
    ];
    var count = 0;
    var fn = function(tag, content, attributes, s) {
      var obj = expected[count++];
      equal(tag, obj.tag, 'first argument should be the tag name');
      equal(content, obj.content, 'second argument should be the tag content');
      equal(attributes, obj.attributes, 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
    }
    test(str, [fn], 'this is a ', 'complex: outermost tag should be removed');
    equal(count, 1, 'complex: should have run 1 time');

    var str = '<p>paragraph with <b>some bold text</b> and an image <img src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"> and thats all</p>';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'img', 'first argument is img');
      equal(content, '', 'second argument is empty');
      equal(attributes, 'src="http://foobar.com/a/b/c/d.gif" alt="cool gif, bro"', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return 'not!';
    }
    test(str, ['img', fn], '<p>paragraph with <b>some bold text</b> and an image not! and thats all</p>', 'img tag should have been replaced');

  });

  method('truncate', function() {
    var str = 'Gotta be an entire sentence.';

    test(str, [29], 'Gotta be an entire sentence.', 'no arguments | 29');
    test(str, [28], 'Gotta be an entire sentence.', 'no arguments | 28');
    test(str, [21], 'Gotta be an entire se...', 'split words | 21');
    test(str, [20], 'Gotta be an entire s...', 'split words | 20');
    test(str, [14], 'Gotta be an en...', 'split words | 14');
    test(str, [13], 'Gotta be an e...', 'split words | 13');
    test(str, [11], 'Gotta be an...', 'split words | 11');
    test(str, [10], 'Gotta be a...', 'split words | 10');
    test(str, [4], 'Gott...', 'split words | 4');
    test(str, [3], 'Got...', 'split words | 3');
    test(str, [2], 'Go...', 'split words | 2');
    test(str, [1], 'G...', 'split words | 1');
    test(str, [0], '...', 'split words | 0');

    test('too short!', [30], 'too short!', 'will not add ellipsis if the string is too short');
    test('Gotta be an entire sentence.', [22, 'right', 'hooha'], 'Gotta be an entire senhooha', 'different ellipsis');
    test('booh pooh mooh', [7, 'right', 455], 'booh po455', 'converts numbers to strings');

    test(str, [21, 'middle'], 'Gotta be an... sentence.', 'middle | no arguments | 21');
    test(str, [11, 'middle'], 'Gotta ...ence.', 'middle | no arguments | 11');
    test(str, [4, 'middle'], 'Go...e.', 'middle | no arguments | 4');
    test(str, [3, 'middle'], 'Go....', 'middle | no arguments | 3');
    test(str, [2, 'middle'], 'G....', 'middle | no arguments | 2');
    test(str, [0, 'middle'], '...', 'middle | no arguments | 0');
    test(str, [-100, 'middle'], '...', 'middle | no arguments | -100');

    test(str, [21, 'left'], '...e an entire sentence.', 'left | no arguments | 21');
    test(str, [11, 'left'], '...e sentence.', 'left | no arguments | 11');
    test(str, [9, 'left'], '...sentence.', 'left | no arguments | 9');
    test(str, [4, 'left'], '...nce.', 'left | no arguments | 4');
    test(str, [3, 'left'], '...ce.', 'left | no arguments | 3');
    test(str, [2, 'left'], '...e.', 'left | no arguments | 2');
    test(str, [0, 'left'], '...', 'left | no arguments | 0');
    test(str, [-100, 'left'], '...', 'left | no arguments | -100');

    test(str, [28, 'left', '>>> '], 'Gotta be an entire sentence.', 'custom [splitter] | 28');
    test(str, [23, 'left', '>>> '], '>>>  be an entire sentence.', 'custom [splitter] | 23');
    test(str, [5, 'left', '>>> '], '>>> ence.', 'custom [splitter] | 5');
    test(str, [4, 'left', '>>> '], '>>> nce.', 'split | custom [splitter] | 4');
    test(str, [3, 'middle', '-'], 'Go-.', 'custom [splitter] | 4 | -');

    test('123456', [2, 'left'], '...56', 'split | splitter not included left | 2');
    test('123456', [2, 'middle'], '1...6', 'split | splitter not included center | 2');
    test('123456', [2], '12...', 'split | splitter not included right | 2');

  });


  method('truncateOnWord', function() {
    var str = 'Gotta be an entire sentence.';

    test(str, [21], 'Gotta be an entire...', '21');
    test(str, [20], 'Gotta be an entire...', '20');
    test(str, [19], 'Gotta be an entire...', '19');
    test(str, [18], 'Gotta be an entire...', '18');
    test(str, [17], 'Gotta be an...', '17');
    test(str, [14], 'Gotta be an...', '14');
    test(str, [13], 'Gotta be an...', '13');
    test(str, [11], 'Gotta be an...', '11');
    test(str, [10], 'Gotta be...', '10');
    test(str, [4], '...', '4');
    test(str, [3], '...', '3');
    test(str, [2], '...', '2');
    test(str, [1], '...', '1');
    test(str, [0], '...', '0');

    test('GOTTA BE AN ENTIRE SENTENCE.', [21], 'GOTTA BE AN ENTIRE...', 'caps too | 21');
    test('GOTTA BE AN ENTIRE SENTENCE.', [17], 'GOTTA BE AN...', 'caps too | 20');
    test('gotta. be. an. entire. sentence.', [17], 'gotta. be. an....', 'no special punctuation treatment | 17');
    test('almost there', [11], 'almost...', 'will not add more than the original string');
    test('Gotta be an entire sentence.', [22, 'right', 'hooha'], 'Gotta be an entirehooha', 'different ellipsis');
    test('こんな　ストリングは　あまり　ない　と　思う　けど。。。', [6], 'こんな...', 'correctly finds spaces in Japanese');
    test('한국어 도 이렇게 할 수 있어요?', [9], '한국어 도 이렇게...', 'correctly finds spaces in Korean');

    test(str, [21, 'middle'], 'Gotta be an...sentence.', 'middle | no split | 21');
    test(str, [11, 'middle'], 'Gotta...', 'middle | no split | 11');
    test(str, [4, 'middle'], '...', 'middle | no split | 4');
    test(str, [3, 'middle'], '...', 'middle | no split | 3');
    test(str, [2, 'middle'], '...', 'middle | no split | 2');
    test(str, [0, 'middle'], '...', 'middle | no split | 0');
    test(str, [-100, 'middle'], '...', 'middle | no split | -100');

    test(str, [21, 'left'], '...an entire sentence.', 'left | no split | 21');
    test(str, [11, 'left'], '...sentence.', 'left | no split | 11');
    test(str, [9, 'left'], '...sentence.', 'left | no split | 9');
    test(str, [4, 'left'], '...', 'left | no split | 4');
    test(str, [3, 'left'], '...', 'left | no split | 3');
    test(str, [2, 'left'], '...', 'left | no split | 2');
    test(str, [0, 'left'], '...', 'left | no split | 0');
    test(str, [-100, 'left'], '...', 'left | no split | -100');

    test('123456', [2, 'left'], '...', 'splitter not included left | 2');
    test('123456', [2, 'middle'], '...', 'splitter not included center | 2');
    test('123456', [2], '...', 'splitter not included right | 2');
    test(str, [3, 'left', '>>> '], '>>> ', 'custom [splitter] | 4 | >>>');

    test(str, [10, 'right', ''], 'Gotta be', 'empty [splitter]  | 10');
    test('Alpha Beta Gamma Delta Epsilon', [20, 'middle', ''], 'Alpha BetaEpsilon', 'Issue 311');
  });

  method('assign', function() {
    var obj1 = { first: 'Harry' };
    var obj2 = { last: 'Potter' };

    test('Welcome, {name}.', [{ name: 'program' }], 'Welcome, program.', 'basic functionality');
    test('Welcome, {1}.', ['program'], 'Welcome, program.', 'numeric params');
    test('Welcome, {1}.', [{ name: 'program' }], 'Welcome, {1}.', 'numeric params will be untouched if object passed');
    test('Welcome, {name}. You are {age} years old and have {points} points left.', [{ name: 'program', age: 21, points: 345 }], 'Welcome, program. You are 21 years old and have 345 points left.', '1 hash');
    test('Welcome, {1}. You are {2} years old and have {3} points left.', ['program', 21, 345], 'Welcome, program. You are 21 years old and have 345 points left.', '3 arguments');
    test('Welcome, {name}. You are {age} years old and have {3} points left.', [{ name: 'program' }, { age: 21 }, 345], 'Welcome, program. You are 21 years old and have 345 points left.', 'complex');

    test('Hello, {first} {last}', [obj1, obj2], 'Hello, Harry Potter', 'passing 2 objects');
    test(obj1.first, 'Harry', 'obj1 retains its properties');
    equal(obj1.last, undefined, 'obj1 is untampered');

    test(obj2.last, 'Potter', 'obj2 retains its properties');
    equal(obj2.first, undefined, 'obj2 is untampered');

    test('Hello, {1}', [''], 'Hello, ', 'empty string as argument');
    test('Hello, {empty}', [{ empty: '' }], 'Hello, ', 'empty string as object');

    test('{{1} {2}}', [5,6], '{5 6}', 'nested braces');
    test('{one {1} {2} two}', [5,6], '{one 5 6 two}', 'nested braces with strings outside');

    test('Hello, {first} {last}', [[obj1, obj2]], 'Hello, Harry Potter', 'passing 2 objects in an array');

  });


});
