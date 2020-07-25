namespace('String', function () {

  // Skipping strict mode here as testing
  // malformed utf-8 is part of these tests.

  var whiteSpace = '\u0009\u000B\u000C\u0020\u00A0\uFEFF\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000';
  var lineTerminators = '\u000A\u000D\u2028\u2029';

  method('escapeURL', function() {

    test('what a day...', 'what%20a%20day...', '...');
    test('/?:@&=+$#', '/?:@&=+$#', 'url chars');
    test('!%^*()[]{}\\:', '!%25%5E*()%5B%5D%7B%7D%5C:', 'non url special chars');

    test('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'amazon link');
    test('http://twitter.com/#!/nov/status/85613699410296833', 'http://twitter.com/#!/nov/status/85613699410296833', 'twitter link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC&otn=10&pmod=260625794431%252B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'ebay link');

  });

  method('escapeURL', function() {
    test('what a day...', [true], 'what%20a%20day...', '...');
    test('/?:@&=+$#', [true], '%2F%3F%3A%40%26%3D%2B%24%23', 'url chars');
    test('!%^*()[]{}\\:', [true], '!%25%5E*()%5B%5D%7B%7D%5C%3A', 'non url special chars');
    test('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', [true], 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'amazon link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', [true], 'http%3A%2F%2Fcgi.ebay.com%2FT-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-%2F350233503515%3F_trksid%3Dp5197.m263%26_trkparms%3Dalgo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716%23ht_3216wt_1141', 'ebay link');

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

  method('unescapeURL', function() {
    test('what%20a%20day...', [true], 'what a day...', '...');
    test('%2F%3F%3A%40%26%3D%2B%24%23', [true], '%2F%3F%3A%40%26%3D%2B%24%23', 'url chars');
    test('!%25%5E*()%5B%5D%7B%7D%5C:', [true], '!%^*()[]{}\\:', 'non url special chars');
    test('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22', [true], 'http%3A%2F%2Fsomedomain.com%3Fparam%3D"this%3A isn\'t an easy URL to escape"', 'fake url')
    test('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', [true], 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'amazon link');
    test('http://twitter.com/#!/nov/status/85613699410296833', [true], 'http://twitter.com/#!/nov/status/85613699410296833', 'twitter link');
    test('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', [true], 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'ebay link');

    raisesError(function() { run('% 23'); }, 'should raise an error for malformed urls');
  });

  method('forEach', function() {

    var callbackTest, result;

    // "each" will return an array of everything that was matched, defaulting to individual characters
    test('g', ['g'], 'each should return an array of each char');


    callbackTest = function(str, i) {
      equal(str, 'g', 'char should be passed as the first argument');
    }

    // Each without a first parameter assumes "each character"
    result = run('g', 'forEach', [callbackTest]);
    equal(result, ['g'], "['g'] should be the resulting value");


    var counter = 0, result, callback;
    callback = function(str, i) {
      equal(str, 'ginger'.charAt(counter), 'char should be passed as the first argument');
      equal(i, counter, 'index should be passed as the second argument');
      counter++;
    }
    result = run('ginger', 'forEach', [callback]);
    equal(counter, 6, 'should have ran 6 times');
    equal(result, ['g','i','n','g','e','r'], 'resulting array should contain all the characters');


    var counter = 0, result, callback;

    callback = function(str, i) {
      equal(str, 'g', 'string argument | match should be passed as the first argument to the block');
      counter++;
    }

    result = run('ginger', 'forEach', ['g', callback]);
    equal(counter, 2, 'string argument | should have ran 2 times');
    equal(result, ['g','g'], "string argument | resulting array should be ['g','g']");


    var counter = 0, result, callback, arr;
    arr = ['g','i','g','e'];

    callback = function(str, i) {
      equal(str, arr[i], 'regexp argument | match should be passed as the first argument to the block');
      counter++;
    }

    result = run('ginger', 'forEach', [/[a-i]/g, callback]);
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
    result = run('foo', 'forEach', [fn])

    equal(result, ['f'], 'returning false should break the loop - result');
    equal(letters, ['f'], 'returning false should break the loop - pushed');

  });

  method('chars', function() {

    test('wasabi', ['w','a','s','a','b','i'], 'splits string into constituent chars');
    test(' wasabi \n', [' ','w','a','s','a','b','i',' ','\n'], 'should not trim whitespace');

    var counter = 0;
    var chars = ['g','i','n','g','e','r'];
    var indexes = [0,1,2,3,4,5];
    var callback = function(chr, i, a) {
      equal(chr, chars[i], 'First argument should be the code.');
      equal(i, indexes[i], 'Second argument should be the index.');
      equal(a, chars, 'Third argument the array of characters.');
      counter++;
    };

    var result = run('ginger', 'chars', [callback]);
    equal(counter, 6, 'should have run 6 times');
    equal(result, ['g','i','n','g','e','r'], 'result should be an array');

    // test each char collects when properly returned
    counter = 0;
    callback = function(str, i) {
      counter++;
      return str.toUpperCase();
    }
    var result = run('ginger', 'chars', [callback]);
    equal(result, ['G','I','N','G','E','R'], 'can be mapped');

    test('', [], 'empty string');
  });

  method('words', function() {

    var counter = 0, result, callback;
    var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
    var words = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
    var indexes = [0,1,2,3,4,5];
    var callback = function(word, i, a) {
      equal(word, words[i], 'First argument should be the word.');
      equal(i, indexes[i], 'Second argument should be the index.');
      equal(a, words, 'Third argument the array of words.');
      counter++;
    };

    result = run(sentence, 'words', [callback]);
    equal(counter, 6, 'should have run 6 times');
    equal(result, words, 'result should be an array of matches');

    test('', [], 'empty string');

  });

  method('lines', function() {

    var counter = 0, result, callback;
    var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!\n\n\n\n';
    var lines = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
    var indexes = [0,1,2,3,4,5,6];
    var callback = function(line, i, a) {
      equal(line, lines[i], 'First argument should be the line.');
      equal(i, indexes[i], 'Second argument should be the index.');
      equal(a, lines, 'Third argument the array of lines.');
      counter++;
    };

    result = run(paragraph, 'lines', [callback]);
    equal(counter, 7, 'should have run 7 times');
    equal(result, lines, 'result should be an array of matches');

    callback = function(str, i) {
      return run(str, 'capitalize');
    }
    result = run('one\ntwo', 'lines', [callback]);
    equal(['One','Two'], result, 'lines can be modified');

    test('', [''], 'empty string');

  });

  method('codes', function() {

    test('jumpy', [106,117,109,112,121], 'jumpy');

    var counter = 0, result;
    var arr = [103,105,110,103,101,114];
    var indexes = [0,1,2,3,4,5];
    var callback = function(code, i, s) {
      equal(code, arr[i], 'First argument should be the code.');
      equal(i, indexes[i], 'Second argument should be the index.');
      equal(s, 'ginger', 'Third argument should be the string.');
      counter++;
    }

    result = run('ginger', 'codes', [callback]);
    equal(counter, 6, 'should have ran 6 times');
    equal(result, arr, 'result should be an array');

    test('', [], 'empty string');
  });

});
