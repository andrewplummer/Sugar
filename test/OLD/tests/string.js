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



  method('escapeHTML', function() {

    test('<p>some text</p>', '&lt;p&gt;some text&lt;/p&gt;', '<p>some text</p>');
    test('war & peace & food', 'war &amp; peace &amp; food', 'war & peace');
    test('&amp;', '&amp;amp;', 'double escapes &amp;');
    test('&lt;span&gt;already escaped, yo&lt;/span&gt;', '&amp;lt;span&amp;gt;already escaped, yo&amp;lt;/span&amp;gt;', 'already escaped will be double-escaped');

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


  method('encodeBase64', function() {

    test('This webpage is not available', 'VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=', 'webpage');
    test('I grow, I prosper; Now, gods, stand up for bastards!', 'SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ==', 'gods');
    test('räksmörgås', 'csOka3Ntw7ZyZ8Olcw==', 'shrimp sandwich');
    test('rÃ¤ksmÃ¶rgÃ¥s', 'csODwqRrc23Dg8K2cmfDg8Klcw==', 'shrimp sandwich encoded');

    test('АБВ', '0JDQkdCS', 'Russian');
    test('日本語', '5pel5pys6Kqe', 'Japanese');
    test('にほんご', '44Gr44G744KT44GU', 'Hiragana');
    test('한국어', '7ZWc6rWt7Ja0', 'Korean');

    // Ensure that btoa and atob don't leak in node
    if(environment == 'node') {
      equal(typeof btoa, 'undefined', 'btoa global does not exist in node');
      equal(typeof atob, 'undefined', 'atob global does not exist in node');
    }

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

    test('wasabi', 'Wasabi', 'lowercase word');
    test('Wasabi', 'Wasabi', 'capitalized word');
    test('WASABI', 'WASABI', 'all caps');
    test('WasAbI', 'WasAbI', 'mixed');
    test('wasabi sandwich', 'Wasabi sandwich', 'two words');
    test('WASABI SANDWICH', 'WASABI SANDWICH', 'two words all caps');
    test("wasabi's SANDWICH", "Wasabi's SANDWICH", 'mixed with apostrophe');

    withArgs([true], 'Downcase', function() {
      test('wasabi', 'Wasabi', 'downcase | lowercase word');
      test('Wasabi', 'Wasabi', 'downcase | capitalized word');
      test('WASABI', 'Wasabi', 'downcase | all caps');
      test('WasAbI', 'Wasabi', 'downcase | mixed');
      test('wasabi sandwich', 'Wasabi sandwich', 'two words');
      test('WASABI SANDWICH', 'Wasabi sandwich', 'two words all caps');

      test("wasabi's SANDWICH", "Wasabi's sandwich", 'mixed with apostrophe');
      test("wasabis' SANDWICH", "Wasabis' sandwich", 'mixed with apostrophe last');

      test('reuben sandwich', 'Reuben sandwich', 'should capitalize all first letters');
      test('фыва йцук', 'Фыва йцук', 'should capitalize unicode letters');
    });

    withArgs([false, true], 'All Words', function() {
      test('wasabi', 'Wasabi', 'lowercase word');
      test('Wasabi', 'Wasabi', 'capitalized word');
      test('WASABI', 'WASABI', 'all caps');
      test('WasAbI', 'WasAbI', 'mixed');
      test('wasabi sandwich', 'Wasabi Sandwich', 'two words');
      test('WASABI SANDWICH', 'WASABI SANDWICH', 'two words all caps');

      test("wasabi's SANDWICH", "Wasabi's SANDWICH", 'should not touch apostrophe');
      test("'you' and 'me'", "'You' And 'Me'", 'should find words in single quotes');

    });

    withArgs([true, true], 'Downcase | All Words', function() {
      test('wasabi', 'Wasabi', 'downcase | lowercase word');
      test('Wasabi', 'Wasabi', 'downcase | capitalized word');
      test('WASABI', 'Wasabi', 'downcase | all caps');
      test('WasAbI', 'Wasabi', 'downcase | mixed');
      test('wasabi sandwich', 'Wasabi Sandwich', 'two words');
      test('WASABI SANDWICH', 'Wasabi Sandwich', 'two words all caps');
      test("wasabi's SANDWICH", "Wasabi's Sandwich", 'mixed with apostrophe');

      test('reuben-sandwich', 'Reuben-Sandwich', 'hyphen');
      test('reuben(sandwich)', 'Reuben(Sandwich)', 'parentheses');
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

      test('what a shame of a title', 'What A Shame Of A Title', 'all lower-case');
      test('What A Shame Of A Title', 'What A Shame Of A Title', 'already capitalized');
      test(' what a shame of a title    ', ' What A Shame Of A Title    ', 'preserves whitespace');
      test(' what a shame of\n a title    ', ' What A Shame Of\n A Title    ', 'preserves new lines');
    });

    test('', '', 'blank');
  });

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

    raisesError(function(){ run('wasabi', 'pad', [-1]); }, '-1 raises error');
    raisesError(function(){ run('wasabi', 'pad', [-Infinity]); }, '-Infinity raises error');
    raisesError(function(){ run('wasabi', 'pad', [Infinity]); }, 'Infinity raises error');

    test('wasabi', 'wasabi', 'no arguments default to 0');
    test('wasabi', [undefined], 'wasabi', 'undefined defaults to 0');
    test('wasabi', [null], 'wasabi', 'null defaults to 0');
    test('wasabi', [NaN], 'wasabi', 'NaN defaults to 0');

    test('', [false], '', 'false is 0');
    test('', [true], ' ', 'true is 1');

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

  method('isEmpty', function() {
    test('', true);
    test('0', false);
    test(' ', false);
    test('　', false);
    test('\t', false);
    test('\n', false);
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

  method('remove', function() {
    test('schfifty five', ['fi'], 'schfty five', 'should remove first fi only');
    test('schfifty five', ['five'], 'schfifty ', 'should remove five');
    test('schfifty five', [/five/], 'schfifty ', 'basic regex');
    test('schfifty five', [/f/], 'schifty five', 'single char regex');
    test('schfifty five', [/f/g], 'schity ive', 'respects global flag');
    test('schfifty five', [/[a-f]/g], 'shity iv', 'character class');
    test('?', ['?'], '', 'strings have tokens escaped');
    test('?(', ['?('], '', 'strings have all tokens escaped');
    test('schfifty five', ['F'], 'schfifty five', 'should be case sensitive');
    test('schfifty five', [], 'schfifty five', 'no args');
  });

  method('removeAll', function() {
    test('schfifty five', ['fi'], 'schfty ve', 'should remove all fi');
    test('schfifty five', ['five'], 'schfifty ', 'should remove five');
    test('schfifty five', [/five/], 'schfifty ', 'basic regex');
    test('schfifty five', [/f/], 'schity ive', 'single char regex replaces all');
    test('schfifty five', [/f/g], 'schity ive', 'global regex replaces all');
    test('schfifty five', [/[a-f]/g], 'shity iv', 'character class');
    test('?', ['?'], '', 'strings have tokens escaped');
    test('?(', ['?('], '', 'strings have all tokens escaped');
    test('schfifty five', ['F'], 'schfifty five', 'should be case sensitive');
    test('schfifty five', [], 'schfifty five', 'no args');
  });

  method('replaceAll', function() {
    test('-x -y -z', ['-', 1, 2, 3], '1x 2y 3z', 'basic');
    test('-x -y -z', ['-'], 'x y z', 'no args');
    test('-x -y -z', ['-', 1, 2], '1x 2y z', 'not enough args');
    test('-x -y -z', ['-', 1, 2, 3, 4], '1x 2y 3z', 'too many args');
    test('-x -y -z', ['-', 1, 0, 3], '1x 0y 3z', 'arg can be 0');
    test('-x -y -z', ['-', 1, null, 3], '1x y 3z', 'null arg will be blank');
    test('-x -y -z', ['-', 1, undefined, 3], '1x y 3z', 'undefined will be blank');
    test('-x -y -z', ['-', 1, NaN, 3], '1x NaNy 3z', 'NaN is stringifiable');

    test('a', [/a/, 'hi'], 'hi', 'basic regex');
    test('aaa', [/a/g,'b','c','d'], 'bcd', 'global regex');
    test('aaa', [/a/,'b','c','d'], 'bcd', 'non-global regex still matches all');
    test('a1 b2', [/a|b/, 'x', 'y'], 'x1 y2', 'alternator');

    test('a', ['A', 'b'], 'a', 'should be case sensitive');
    test('?', ['?', 'a'], 'a', 'strings have tokens escaped');
    test('?(', ['?(', 'b'], 'b', 'strings have all tokens escaped');

    test('abc', [], 'abc', 'no args');
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
  method('toNumber', function() {
    test('ff', [16], 255, 'ff');
    test('00', [16], 0, '00');
    test('33', [16], 51, '33');
    test('66', [16], 102, '66');
    test('99', [16], 153, '99');
    test('bb', [16], 187, 'bb');
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
    test('foop', [4], '', 'pos 4');
    test('foop', [1224], '', 'out of bounds');
    test('foop', [-1], 'p', 'negative | pos -1');
    test('foop', [-2], 'o', 'negative | pos -2');
    test('foop', [-3], 'o', 'negative | pos -3');
    test('foop', [-4], 'f', 'negative | pos -4');
    test('foop', [-5], '', 'negative | pos -5');
    test('foop', [-1224], '', 'negative | out of bounds');

    test('foop', [0, true], 'f', 'pos 0');
    test('foop', [1, true], 'o', 'pos 1');
    test('foop', [2, true], 'o', 'pos 2');
    test('foop', [3, true], 'p', 'pos 3');
    test('foop', [4, true], 'f', 'pos 4');
    test('foop', [5, true], 'o', 'pos 5');
    test('foop', [1224, true], 'f', 'out of bounds');
    test('foop', [-1, true], 'p', 'negative | pos -1');
    test('foop', [-2, true], 'o', 'negative | pos -2');
    test('foop', [-3, true], 'o', 'negative | pos -3');
    test('foop', [-4, true], 'f', 'negative | pos -4');
    test('foop', [-5, true], 'p', 'negative | pos -5');
    test('foop', [-1224, true], 'f', 'negative | out of bounds');

    test('wowzers', [[0,2,4,6,18]], ['w','w','e','s',''], 'handles enumerated params');
    test('wowzers', [[0,2,4,6], true], ['w','w','e','s'], 'handles enumerated params');
    test('wowzers', [[0,2,4,6,18], true], ['w','w','e','s','e'], 'handles enumerated params');

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

    test('street', 'street', 'street | basic');
    test('street_address', 'street-address', 'street-address | basic');
    test('person_street_address', 'person-street-address', 'person-street-address | basic');

    withMethod('underscore', function() {
      equal(run(run('street', 'dasherize'), 'underscore'), 'street', 'street | reversed')
      equal(run(run('street_address', 'dasherize'), 'underscore'), 'street_address', 'street_address | reversed')
      equal(run(run('person_street_address', 'dasherize'), 'underscore'), 'person_street_address', 'street_address | reversed')
    });

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

    withArgs([false], function() {
      test('hop-on-pop', [false], 'hopOnPop', 'first false | dashes');
      test('HOP-ON-POP', [false], 'hopOnPop', 'first false | capital dashes');
      test('hop_on_pop', [false], 'hopOnPop', 'first false | underscores');
      test('watch me fail', [false], 'watchMeFail', 'first false | whitespace');
      test('watch me fail-sad-face', [false], 'watchMeFailSadFace', 'first false | whitespace sad face');
      test('waTch me su-cCeed', [false], 'waTchMeSuCCeed', 'first false | complex whitespace');
    });

    withArgs([false], function() {
      test('hop-on-pop', [true], 'HopOnPop', 'first true | dashes');
      test('HOP-ON-POP', [true], 'HopOnPop', 'first true | capital dashes');
      test('hop_on_pop', [true], 'HopOnPop', 'first true | underscores');
    });

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

    test('_hop_on_pop_', '_hop_on_pop_', 'underscores are left alone');

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
    test(html, [['a', 'b']], stripped, 'array | stripped <a> and <b> tags');


    stripped =
    '<div class="outer">' +
    'text with links, &quot;entities&quot; and <b>bold</b> tags' +
    '</div>';
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
    test('<b>bold<b> and <i>italic</i> and <a>link</a>', [['b','i']], 'bold and italic and <a>link</a>', 'handles multi args');

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
    test(html, [['input', 'p', 'form']], '<label>label for text:</label>', 'form | input, p, and form tags stripped');

    // Stripping namespaced tags
    test('<xsl:template>foobar</xsl:template>', [], 'foobar', 'strips tags with xml namespaces');
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

    test('<span>foo</span>', ['all', '|'], '|foo|', 'can strip with just a string');

    var fn = function() { return 'bar'; };
    test('<span>foo</span>', ['all', fn], 'barfoobar', 'replaces content with result of callback');

    var fn = function() { return ''; };
    test('<span>foo</span>', ['all', fn], 'foo', 'replaces content with empty string');

    var fn = function() {};
    test('<span>foo</span>', ['all', fn], 'foo', 'returning undefined removes as normal');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!" />', ['all', fn], 'wow', 'can replace self-closing tags');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!"> noway', ['all', fn], 'wow noway', 'can replace void tag');

    var fn = function() { return 'wow'; };
    test('<IMG SRC="cool.jpg" DATA-FACE="nice face!"> noway', ['all', fn], 'wow noway', 'can replace void tag with caps');

    var fn = function(a,b,c) { return c; };
    test('<span></span>', ['all', fn], '', 'attributes should be blank');

    var fn = function(a,b,c) { return c; };
    test('<span class="orange">foo</span>', ['all', fn], 'class="orange"fooclass="orange"', 'attributes should not be blank');


    var str = 'which <b>way</b> to go';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'b', 'first argument should be the tag name');
      equal(content, 'way', 'second argument should be the tag content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
      return '|';
    }
    test(str, ['all', fn], 'which |way| to go', 'stripped tag should be replaced');

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
      return '|';
    }
    test(str, ['all', fn], '|very|nested|spans|are|we|||||', 'stripped tag should be replaced');
    equal(count, 5, 'should have run 5 times');

    var str = '<span>very</span>';
    var fn = function(tag, content, attributes, s) {
      return content;
    }
    test(str, ['all', fn], 'veryveryvery', 'replacing with content will not endlessly recurse');

    var str = '<span>very<span>';
    var fn = function(tag, content, attributes, s) {
      return content;
    }
    test(str, ['all', fn], 'very<span>veryvery<span>', 'malformed content will not infinitely recurse with replacements');

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
    test(str, ['all', fn], 'paragraph with some bold text and an image  and thats all', 'complex: all tags should be stripped');
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


    // Issue #467
    test('<img src="cool.jpg">', ['i'], '<img src="cool.jpg">', 'will not replace <img> for <i>');

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
    test(html, [['a', 'b']], removed, 'array | <a> and <b> tags removed');


    removed =
    '<div class="outer"></div>';
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
    test(html, [['input', 'p', 'form']], '', 'form | removing input, p, and form tags');

    // Stripping namespaced tags
    test('<xsl:template>foobar</xsl:template>', '', 'form | xml namespaced tags removed');
    test('<xsl:template>foobar</xsl:template>', ['xsl:template'], '', 'form | xsl:template removed');
    test('<xsl/template>foobar</xsl/template>', ['xsl/template'], '', 'form | xsl/template removed');
    test('<xsl(template>foobar</xsl(template>', ['xsl(template'], '', 'form | xsl(template removed');

    test('<b>bold</b> and <i>italic</i> and <a>link</a>', [['b','i']], ' and  and <a>link</a>', 'handles multi args');
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

    test('<span>foo</span>', ['all', 'bar'], 'bar', 'can replace with just a string');

    var fn = function() { return 'bar'; };
    test('<span>foo</span>', ['all', fn], 'bar', 'replaces content with result of callback');

    var fn = function() { return ''; };
    test('<span>foo</span>', ['all', fn], '', 'replaces content with empty string');

    var fn = function() {};
    test('<span>foo</span>', ['all', fn], '', 'returning undefined strips as normal');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!" />', ['all', fn], 'wow', 'can replace self-closing tags');

    var fn = function() { return 'wow'; };
    test('<img src="cool.jpg" data-face="nice face!"> noway', ['all', fn], 'wow noway', 'can replace void tag');

    var fn = function() { return 'wow'; };
    test('<IMG SRC="cool.jpg" DATA-FACE="nice face!"> noway', ['all', fn], 'wow noway', 'can replace void tag with caps');

    var fn = function(a,b,c) { return c; };
    test('<span></span>', ['all', fn], '', 'attributes should be blank');

    var str = 'which <b>way</b> to go';
    var fn = function(tag, content, attributes, s) {
      equal(tag, 'b', 'first argument should be the tag name');
      equal(content, 'way', 'second argument should be the tag content');
      equal(attributes, '', 'third argument should be the attributes');
      equal(s, str, 'fourth argument should be the string');
    }
    test(str, ['all', fn], 'which  to go', 'stripped tag should be replaced');

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
    test(str, ['all', fn], 'verynestedspansarewe', 'stripped tag should be replaced');
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
    test(str, ['all', fn], 'this is a ', 'complex: outermost tag should be removed');
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


    // Issue #467
    test('<img src="cool.jpg">', ['i'], '<img src="cool.jpg">', 'will not replace <img> for <i>');

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

  method('format', function() {

    var obj1 = { firstName: 'Harry' };
    var obj2 = { lastName: 'Potter' };
    var obj3 = { firstName: 'program', age: 21, points: 345 };

    test('Welcome, {0}.', ['program'], 'Welcome, program.', 'array index');
    test('Welcome, {firstName}.', [obj1], 'Welcome, Harry.', 'keyword');
    test('Welcome, {firstName}. You are {age} years old and have {points} points left.', [obj3], 'Welcome, program. You are 21 years old and have 345 points left.', '3 arguments by keyword');
    test('Welcome, {0}. You are {1} years old and have {2} points left.', ['program', 21, 345], 'Welcome, program. You are 21 years old and have 345 points left.', '3 arguments by index');
    test('Welcome, {0}.', [obj1], 'Welcome, undefined.', 'numeric key does not exist in object');
    test('hello {0.firstName}', [obj1], 'hello undefined', 'does not allow dot expressions');
    test('hello {firstName} {lastName}', [obj1, obj2], 'hello undefined undefined', 'objects will not be merged');
    test('hello {0.firstName} {1.lastName}', [obj1, obj2], 'hello Harry Potter', 'arrays are accessible through indexes');
    test('hello {0.firstName} {1.lastName}', [[obj1, obj2]], 'hello Harry Potter', 'passing an array as the only argument will get unwrapped');

    test('hello {0} {1.firstName}', ['Dirty', obj1], 'hello Dirty Harry', 'string and object');
    test('hello {0} {1}', ['Dirty', obj1.firstName], 'hello Dirty Harry', 'string and object property');
    test('hello {0.firstName} {1}', [obj1, 'Dirty'], 'hello Harry Dirty', 'object and string');

    test(obj1.firstName, 'Harry', 'obj1 retains its properties');
    equal(obj1.lastName, undefined, 'obj1 is untampered');

    test(obj2.lastName, 'Potter', 'obj2 retains its properties');
    equal(obj2.firstName, undefined, 'obj2 is untampered');

    test('Hello, {0}.', [''], 'Hello, .', 'empty string has no index');
    test('Hello, {empty}.', [{ empty: '' }], 'Hello, .', 'empty string matches');
    test('Hello, {0}.', [], 'Hello, undefined.', 'no argument with index');
    test('Hello, {name}.', [], 'Hello, undefined.', 'no argument with keyword');

    test('{}', ['foo'], '{}', 'single curly braces does not match');
    test('{{}}', ['foo'], '{}', 'double curly braces escapes');
    test('}}{{', ['foo'], '}{', 'reverse double curly braces');
    test('{{{0} {1}}}', ['foo', 'bar'], '{foo bar}', 'properly nested braces');
    test('{{0 {1}', ['foo', 'bar'], '{0 bar', 'escaped open with non-escaped');

    test('{{0}}', ['foo'], '{0}', 'single nested');
    test('{{{0}}}', ['foo'], '{foo}', 'double nested');
    test('{{{{0}}}}', ['foo'], '{{0}}', '3 nested');
    test('{{{{{0}}}}}', ['foo'], '{{foo}}', '4 nested');
    test('{{{{{{0}}}}}}', ['foo'], '{{{0}}}', '5 nested');

    test('%', [], '%', '%');
    test('%%', [], '%%', '%%');
    test('%f', [], '%f', '%f');

    raisesError(function() { run('0}', 'format', ['foo']); }, 'unmatched }');
    raisesError(function() { run('{0', 'format', ['foo']); }, 'unmatched {');
    raisesError(function() { run('}{', 'format', ['foo']); }, 'reversed curly braces');
    raisesError(function() { run('{{foo}', 'format', ['foo']); }, 'escaped open with unmatched close');
    raisesError(function() { run('{{0} {1}}', 'format', ['foo', 'bar']); }, 'improperly nested braces');
    raisesError(function() { run('{0}}', 'format', ['foo']); }, 'two trailing braces');
    raisesError(function() { run('{0}}}}', 'format', ['foo']); }, 'four trailing braces');

    test('{0}}}', ['foo'], 'foo}', 'three trailing braces');
    test('{0}}}}}', ['foo'], 'foo}}', 'five trailing braces');

    test('Welcome, {0}.', [Object('user')], 'Welcome, user.', 'string object should be coerced');
    test('Welcome, {0}.', [Object(3)], 'Welcome, 3.', 'number should be coerced');
    test('Welcome, {0}.', [Object(true)], 'Welcome, true.', 'boolean should be coerced');
    test('Welcome, {0}.', [null], 'Welcome, null.', 'passing null');
    test('Welcome, {0}.', [undefined], 'Welcome, undefined.', 'passing undefined');

    var obj1 = {a:{b:{c:'foo'}}};
    var obj2 = {a:{b:{c:'bar'}}};
    test('{0.a.b.c}{1.a.b.c}', [obj1, obj2], 'foobar', 'deep objects');

    // Taken from Python format docs.
    test('First, thou shalt count to {0}', ['foo'], 'First, thou shalt count to foo', '');
    test('Bring me a {}', ['foo'], 'Bring me a {}', 'requires a key to be passed');
    test('From {} to {}', ['foo', 'bar'], 'From {} to {}', 'requires keys to be passed');
    test('My quest is {name}', [{name:'partying'}], 'My quest is partying', 'allows keyword arguments as objects');
    test('Weight in tons {0.weight}', ['foo'], 'Weight in tons undefined', 'does not allow operators as part of format');
    test('Units destroyed: {players[0]}', [{players: ['huey', 'duey']}], 'Units destroyed: huey', 'allows bracket syntax');

    test('{0}, {1}, {2}', ['a', 'b', 'c'], 'a, b, c', 'simple enumeration');
    test('{}, {}, {}', ['a', 'b', 'c'], '{}, {}, {}', 'empty tokens');
    test('{2}, {1}, {0}', ['a', 'b', 'c'], 'c, b, a', 'reversed');
    test('{0}{1}{0}', ['abra', 'cad'], 'abracadabra', 'indices can be repeated');

    test('Coordinates: {latitude}, {longitude}', [{latitude: '37.24N', longitude: '-115.81W'}], 'Coordinates: 37.24N, -115.81W', 'coordinates separate');

    var coord = {'latitude': '37.24N', 'longitude': '-115.81W'};
    test('Coordinates: {latitude}, {longitude}', [coord], 'Coordinates: 37.24N, -115.81W', 'coords as object');

    // Sugar departs somewhat from Python here as it is not greedy in matching
    // nested braces. This is largely for the sake of simplicity; not requiring
    // a recursive and/or tokenized system lets a single regex cover 99% of use
    // cases, and is highly optimized by the browser. Although "one {0} {1} two"
    // could in theory be an object key in Javascript, a key such as "{one}" is
    // impossible to access (see test below), so it also makes things cleaner
    // to simply not allow nested braces from the start, and instead require the
    // properties to be enumerated or mapped to a new object.
    raisesError(function() { run('{one {0} {1} two}', 'format', []); }, 'nested without escaping');

    // There is currently no way to access properties that have braces in the keynames.
    // They will have to be enumerated as arguments or mapped to different property names.
    // This is not possible in Python as kwargs names cannot have special characters.
    test('{{{name}}}', [{'{name}': 'John'}], '{undefined}', 'cannot access properties with braces');

  });

  method('includes', function() {

    test('foo', ['foo'],  true, 'string still works');
    test('foo', [/foo/],  true, 'simple regex');
    test('foo', [/^foo/], true, 'with lead');
    test('foo', [/foo$/], true, 'with trail');
    test('poo', [/foo/],  false, 'simple regex no match');
    test('poo', [/^foo/], false, 'with lead no match');
    test('poo', [/foo$/], false, 'with trail no match');

    test('foo', [/foo/,  0], true,  'with position 0 | simple regex');
    test('foo', [/^foo/, 0], true,  'with position 0 | with lead');
    test('foo', [/foo$/, 0], true,  'with position 0 | with trail');
    test('poo', [/foo/,  0], false, 'with position 0 | simple regex no match');
    test('poo', [/^foo/, 0], false, 'with position 0 | with lead no match');
    test('poo', [/foo$/, 0], false, 'with position 0 | with trail no match');

    test('foo', [/foo/,  1], false, 'with position 1 | simple regex');
    test('foo', [/^foo/, 1], false, 'with position 1 | with lead');
    test('foo', [/foo$/, 1], false, 'with position 1 | with trail');
    test('poo', [/foo/,  1], false, 'with position 1 | simple regex no match');
    test('poo', [/^foo/, 1], false, 'with position 1 | with lead no match');
    test('poo', [/foo$/, 1], false, 'with position 1 | with trail no match');

    test('foo', [/oo/,  1],  true,  'with position 1 | match');
    test('foo', [/o/, 2],    true,  'with position 2 | match');
    test('foo', [/./, 3],    false, 'with position 3 | no match');
    test('foo', [/$/, 3],    true,  'with position 3 | match');

    storeNativeState();

    Sugar.String.extend('includes');
    equal(String.prototype.includes.length, 1, 'should have argument length of 1');

    restoreNativeState();
  });

  method('titleize', function() {

    var MixtureToTitleCase = {
      'active_record'       : 'Active Record',
      'ActiveRecord'        : 'Active Record',
      'action web service'  : 'Action Web Service',
      'Action Web Service'  : 'Action Web Service',
      'Action web service'  : 'Action Web Service',
      'actionwebservice'    : 'Actionwebservice',
      'Actionwebservice'    : 'Actionwebservice',
      "david's code"        : "David's Code",
      "David's code"        : "David's Code",
      "david's Code"        : "David's Code",

      // Added test cases for non-titleized words

      'the day of the jackal'        : 'The Day of the Jackal',
      'what color is your parachute?': 'What Color Is Your Parachute?',
      'a tale of two cities'         : 'A Tale of Two Cities',
      'where am i going to'          : 'Where Am I Going To',

      // From the titleize docs
      'man from the boondocks'       :  'Man from the Boondocks',
      'x-men: the last stand'        :  'X Men: The Last Stand',
      'i am a sentence. and so am i.':  'I Am a Sentence. And so Am I.',
      'hello! and goodbye!'          :  'Hello! And Goodbye!',
      'hello, and goodbye'           :  'Hello, and Goodbye',
      'hello; and goodbye'           :  'Hello; And Goodbye',
      "about 'you' and 'me'"         :  "About 'You' and 'Me'",
      'TheManWithoutAPast'           :  'The Man Without a Past',
      'raiders_of_the_lost_ark'      :  'Raiders of the Lost Ark'
    }

    testIterateOverObject(MixtureToTitleCase, function(src, expected) {
      test(src, expected, 'mixed cases')
    });
  });

  method('parameterize', function() {

    test('Donald E. Knuth', 'donald-e-knuth');
    test('Random text with *(bad)* characters', 'random-text-with-bad-characters');
    test('Allow_Under_Scores', 'allow_under_scores');
    test('Trailing bad characters!@#', 'trailing-bad-characters');
    test('!@#Leading bad characters', 'leading-bad-characters');
    test('Squeeze   separators', 'squeeze-separators');
    test('Test with + sign', 'test-with-sign');
    test('Test with malformed utf8 \251', 'test-with-malformed-utf8');

    withArgs([''], function() {
      test('Donald E. Knuth', 'donaldeknuth');
      test('With-some-dashes', 'with-some-dashes');
      test('Random text with *(bad)* characters', 'randomtextwithbadcharacters');
      test('Trailing bad characters!@#', 'trailingbadcharacters');
      test('!@#Leading bad characters', 'leadingbadcharacters');
      test('Squeeze   separators', 'squeezeseparators');
      test('Test with + sign', 'testwithsign');
      test('Test with malformed utf8 \251', 'testwithmalformedutf8');
    });

    withArgs(['_'], function() {
      test('Donald E. Knuth', 'donald_e_knuth');
      test('Random text with *(bad)* characters', 'random_text_with_bad_characters');
      test('With-some-dashes', 'with-some-dashes');
      test('Retain_underscore', 'retain_underscore');
      test('Trailing bad characters!@#', 'trailing_bad_characters');
      test('!@#Leading bad characters', 'leading_bad_characters');
      test('Squeeze   separators', 'squeeze_separators');
      test('Test with + sign', 'test_with_sign');
      test('Test with malformed utf8 \251', 'test_with_malformed_utf8');
    });

    if (Sugar.String.toAscii) {
      test('Malmö here', 'malmo-here');
      test('Garçons', 'garcons');
      test('Ops\331', 'opsu');
      test('Ærøskøbing', 'aeroskobing');
      test('Aßlar', 'asslar');
      test('Japanese: 日本語', 'japanese')
    }

  });

});
