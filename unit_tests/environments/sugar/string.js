test('String', function () {

  equal('test regexp'.escapeRegExp(), 'test regexp', 'String#escapeRegExp | nothing to escape');
  equal('test reg|exp'.escapeRegExp(), 'test reg\\|exp', 'String#escapeRegExp | should escape pipe');
  equal('hey there (budday)'.escapeRegExp(), 'hey there \\(budday\\)', 'String#escapeRegExp | should escape parentheses');
  equal('.'.escapeRegExp(), '\\.', 'String#escapeRegExp | should escape period');
  equal('what a day...'.escapeRegExp(), 'what a day\\.\\.\\.', 'String#escapeRegExp | should escape many period');
  equal('*.+[]{}()?|/'.escapeRegExp(), '\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/', 'String#escapeRegExp | complex regex tokens');

  /* Leaving these tests but this method seems all but totally useless
   equal('test regexp'.unescapeRegExp(), 'test regexp', 'String#unescapeRegExp | nothing to unescape');
   equal('test reg\\|exp'.unescapeRegExp(), 'test reg|exp', 'String#unescapeRegExp | should unescape pipe');
   equal('hey there \\(budday\\)'.unescapeRegExp(), 'hey there (budday)', 'String#unescapeRegExp | should unescape parentheses');
   equal('\\.'.unescapeRegExp(), '.', 'String#unescapeRegExp | should unescape period');
   equal('what a day\\.\\.\\.'.unescapeRegExp(), 'what a day...', 'String#unescapeRegExp | should unescape many period');
   equal('\\*\\.\\+\\[\\]\\{\\}\\(\\)\\?\\|\\/'.unescapeRegExp(), '*.+[]{}()?|/', 'String#unescapeRegExp | complex regex tokens');
   */


  equal('what a day...'.escapeURL(), 'what%20a%20day...', 'String#escapeURL | ...');
  equal('/?:@&=+$#'.escapeURL(), '/?:@&=+$#', 'String#escapeURL | url chars');
  equal('!%^*()[]{}\\:'.escapeURL(), '!%25%5E*()%5B%5D%7B%7D%5C:', 'String#escapeURL | non url special chars');
  equal('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846'.escapeURL(), 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'String#escapeURL | amazon link');
  equal('http://twitter.com/#!/nov/status/85613699410296833'.escapeURL(), 'http://twitter.com/#!/nov/status/85613699410296833', 'String#escapeURL | twitter link');
  equal('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.escapeURL(), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC&otn=10&pmod=260625794431%252B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'String#escapeURL | ebay link');


  equal('what a day...'.escapeURL(true), 'what%20a%20day...', 'String#escapeURL | full | ...');
  equal('/?:@&=+$#'.escapeURL(true), '%2F%3F%3A%40%26%3D%2B%24%23', 'String#escapeURL | full | url chars');
  equal('!%^*()[]{}\\:'.escapeURL(true), '!%25%5E*()%5B%5D%7B%7D%5C%3A', 'String#escapeURL | full | non url special chars');
  equal('http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846'.escapeURL(true), 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'String#escapeURL | full | amazon link');
  equal('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2 fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.escapeURL(true), 'http%3A%2F%2Fcgi.ebay.com%2FT-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-%2F350233503515%3F_trksid%3Dp5197.m263%26_trkparms%3Dalgo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252%20fBUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716%23ht_3216wt_1141', 'String#escapeURL | full | ebay link');

  equal('what%20a%20day...'.unescapeURL(), 'what a day...', 'String#unescapeURL | full | ...');
  equal('%2F%3F%3A%40%26%3D%2B%24%23'.unescapeURL(), '/?:@&=+$#', 'String#unescapeURL | full | url chars');
  equal('!%25%5E*()%5B%5D%7B%7D%5C%3A'.unescapeURL(), '!%^*()[]{}\\:', 'String#unescapeURL | full | non url special chars');
  equal('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22'.unescapeURL(), 'http://somedomain.com?param="this: isn\'t an easy URL to escape"', 'String#unescapeURL | full | fake url')
  equal('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846'.unescapeURL(), 'http://www.amazon.com/Kindle-Special-Offers-Wireless-Reader/dp/B004HFS6Z0/ref=amb_link_356652042_2?pf_rd_m=ATVPDKIKX0DER&pf_rd_s=center-1&pf_rd_r=1RKN5V41WJ23AXKFSQ56&pf_rd_t=101&pf_rd_p=1306249942&pf_rd_i=507846', 'String#unescapeURL | full | amazon link');
  equal('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo%3DSIC%26itu%3DUCI%252BIA%252BUA%252BFICS%252BUFI%252BDDSIC%26otn%3D10%26pmod%3D260625794431%252B370476659389%26po%3DLVI%26ps%3D63%26clkid%3D962675460977455716'.unescapeURL(), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2BUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716', 'String#unescapeURL | full | ebay link');


  equal('what%20a%20day...'.unescapeURL(true), 'what a day...', 'String#unescapeURL | ...');
  equal('%2F%3F%3A%40%26%3D%2B%24%23'.unescapeURL(true), '%2F%3F%3A%40%26%3D%2B%24%23', 'String#unescapeURL | url chars');
  equal('!%25%5E*()%5B%5D%7B%7D%5C:'.unescapeURL(true), '!%^*()[]{}\\:', 'String#unescapeURL | non url special chars');
  equal('http%3A%2F%2Fsomedomain.com%3Fparam%3D%22this%3A%20isn\'t%20an%20easy%20URL%20to%20escape%22'.unescapeURL(true), 'http%3A%2F%2Fsomedomain.com%3Fparam%3D"this%3A isn\'t an easy URL to escape"', 'String#unescapeURL | fake url')
  equal('http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846'.unescapeURL(true), 'http%3A%2F%2Fwww.amazon.com%2FKindle-Special-Offers-Wireless-Reader%2Fdp%2FB004HFS6Z0%2Fref%3Damb_link_356652042_2%3Fpf_rd_m%3DATVPDKIKX0DER%26pf_rd_s%3Dcenter-1%26pf_rd_r%3D1RKN5V41WJ23AXKFSQ56%26pf_rd_t%3D101%26pf_rd_p%3D1306249942%26pf_rd_i%3D507846', 'String#unescapeURL | amazon link');
  equal('http://twitter.com/#!/nov/status/85613699410296833'.unescapeURL(true), 'http://twitter.com/#!/nov/status/85613699410296833', 'String#unescapeURL | twitter link');
  equal('http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141'.unescapeURL(true), 'http://cgi.ebay.com/T-Shirt-Tee-NEW-Naruto-Shippuuden-Kakashi-Adult-Men-XL-/350233503515?_trksid=p5197.m263&_trkparms=algo=SIC&itu=UCI%2BIA%2BUA%2BFICS%2fBUFI%2BDDSIC&otn=10&pmod=260625794431%2B370476659389&po=LVI&ps=63&clkid=962675460977455716#ht_3216wt_1141', 'String#unescapeURL | ebay link');



  raisesError(function() { '% 23'.unescapeURL(); }, 'String#unescapeURL | partial | should raise an error for malformed urls');
  raisesError(function() { '% 23'.unescapeURL(true); }, 'String#unescapeURL | full | should raise an error for malformed urls');




  equal('<p>some text</p>'.escapeHTML(), '&lt;p&gt;some text&lt;&#x2f;p&gt;', 'String#escapeHTML | <p>some text</p>');
  equal('war & peace & food'.escapeHTML(), 'war &amp; peace &amp; food', 'String#escapeHTML | war & peace');
  equal('&lt;span&gt;already escaped, yo&lt;/span&gt;', '&lt;span&gt;already escaped, yo&lt;/span&gt;', 'String#escapeHTML | already escaped will stay escaped');

  equal("hell's".escapeHTML(), 'hell&apos;s', "String#escapeHTML | works on '");
  equal('I know that "feel" bro'.escapeHTML(), 'I know that &quot;feel&quot; bro', 'String#escapeHTML | works on "');
  equal('feel the /'.escapeHTML(), 'feel the &#x2f;', 'String#escapeHTML | works on /');

  equal('&lt;p&gt;some text&lt;/p&gt;'.unescapeHTML(), '<p>some text</p>', 'String#unescapeHTML | <p>some text</p>');
  equal('war &amp; peace &amp; food'.unescapeHTML(), 'war & peace & food', 'String#unescapeHTML | war & peace');
  equal('<span>already escaped, yo</span>', '<span>already escaped, yo</span>', 'String#escapeHTML | already escaped will stay escaped');

  equal('hell&apos;s'.unescapeHTML(), "hell's", "String#unescapeHTML | works on '");
  equal('I know that &quot;feel&quot; bro'.unescapeHTML(), 'I know that "feel" bro', 'String#unescapeHTML | works on "');
  equal('feel the &#x2f;'.unescapeHTML(), 'feel the /', 'String#unescapeHTML | works on /');

  equal('&gt;'.escapeHTML().unescapeHTML(), '&gt;', 'String#unescapeHTML | is the reverse of escapeHTML');
  equal('&amp;lt;'.unescapeHTML(), '&lt;', 'String#unescapeHTML | unescapes a single level of HTML escaping');

  equal('This webpage is not available'.encodeBase64(), 'VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU=', 'String#encodeBase64 | webpage');
  equal('I grow, I prosper; Now, gods, stand up for bastards!'.encodeBase64(), 'SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ==', 'String#encodeBase64 | gods');
  equal('räksmörgås'.encodeBase64(), 'cuRrc232cmflcw==', 'String#encodeBase64 | shrimp sandwich');
  equal('rÃ¤ksmÃ¶rgÃ¥s'.encodeBase64(), 'csOka3Ntw7ZyZ8Olcw==', 'String#encodeBase64 | shrimp sandwich');

  // Ensure that btoa and atob don't leak in node
  if(environment == 'node') {
    equal(typeof btoa, 'undefined', 'btoa global does not exist in node');
    equal(typeof atob, 'undefined', 'atob global does not exist in node');
  }

  equal('L2hvd2FyZHNmaXJld29ya3MvYXBpL29yZGVyLzc1TU0lMjBNSVg='.decodeBase64(), '/howardsfireworks/api/order/75MM%20MIX', 'String#decodeBase64 | %20')

  equal('VGhpcyB3ZWJwYWdlIGlzIG5vdCBhdmFpbGFibGU='.decodeBase64(), 'This webpage is not available', 'String#decodeBase64 | webpage');
  equal('SSBncm93LCBJIHByb3NwZXI7IE5vdywgZ29kcywgc3RhbmQgdXAgZm9yIGJhc3RhcmRzIQ=='.decodeBase64(), 'I grow, I prosper; Now, gods, stand up for bastards!', 'String#decodeBase64 | gods');

  raisesError(function() { '@#$^#$^#@$^'.decodeBase64(); }, 'String#decodeBase64 | should throw an error on non-base64 chars');

  var test;

  equal('reuben sandwich'.capitalize(), 'Reuben sandwich', 'String#capitalize | should capitalize first letter of first word only.', { mootools: 'Reuben Sandwich' });
  equal('Reuben sandwich'.capitalize(), 'Reuben sandwich', 'String#capitalize | should leave the string alone', { mootools: 'Reuben Sandwich' });
  equal('REUBEN SANDWICH'.capitalize(), 'Reuben sandwich', 'String#capitalize | should uncapitalize all other letters', { mootools: 'REUBEN SANDWICH' });
  equal('фыва йцук'.capitalize(), 'Фыва йцук', 'String#capitalize | should capitalize unicode letters', { mootools: 'Фыва йцук' });

  equal('reuben sandwich'.capitalize(true), 'Reuben Sandwich', 'String#capitalize | all | should capitalize all first letters', { prototype: 'Reuben sandwich' });
  equal('Reuben sandwich'.capitalize(true), 'Reuben Sandwich', 'String#capitalize | all | should capitalize the second letter only', { prototype: 'Reuben sandwich' });
  equal('REUBEN SANDWICH'.capitalize(true), 'Reuben Sandwich', 'String#capitalize | all | should uncapitalize all other letters', { prototype: 'Reuben sandwich', mootools: 'REUBEN SANDWICH' });
  equal('фыва йцук'.capitalize(true), 'Фыва Йцук', 'String#capitalize | all | should capitalize unicode letters', { prototype: 'Фыва йцук' });
  equal('what a shame of a title'.capitalize(true), 'What A Shame Of A Title', 'String#capitalize | all | all lower-case', { prototype: 'What a shame of a title' });
  equal('What A Shame Of A Title'.capitalize(true), 'What A Shame Of A Title', 'String#capitalize | all | already capitalized', { prototype: 'What a shame of a title' });
  equal(' what a shame of a title    '.capitalize(true), ' What A Shame Of A Title    ', 'String#capitalize | all | preserves whitespace', { prototype: ' what a shame of a title    ' });
  equal(' what a shame of\n a title    '.capitalize(true), ' What A Shame Of\n A Title    ', 'String#capitalize | all | preserves new lines', { prototype: ' what a shame of\n a title    ' });

  equal('reuben-sandwich'.capitalize(true), 'Reuben-Sandwich', 'String#capitalize | all | hyphen');
  equal('reuben,sandwich'.capitalize(true), 'Reuben,Sandwich', 'String#capitalize | all | comma');
  equal('reuben;sandwich'.capitalize(true), 'Reuben;Sandwich', 'String#capitalize | all | semicolon');
  equal('reuben.sandwich'.capitalize(true), 'Reuben.Sandwich', 'String#capitalize | all | period');
  equal('reuben_sandwich'.capitalize(true), 'Reuben_Sandwich', 'String#capitalize | all | underscore');
  equal('фыва-йцук'.capitalize(true), 'Фыва-Йцук', 'String#capitalize | all | Russian with hyphens');
  equal('фыва,йцук'.capitalize(true), 'Фыва,Йцук', 'String#capitalize | all | Russian with comma');
  equal('фыва;йцук'.capitalize(true), 'Фыва;Йцук', 'String#capitalize | all | Russian with semicolon');
  equal('фыва7йцук'.capitalize(true), 'Фыва7Йцук', 'String#capitalize | all | Russian with 7');

  equal('wasabi'.chars(), ['w','a','s','a','b','i'], 'String#chars | splits string into constituent chars');
  equal(' wasabi \n'.chars(), [' ','w','a','s','a','b','i',' ','\n'], 'String#chars | should not trim whitespace');

  equal('   wasabi   '.trim(), 'wasabi', 'String#trim | should trim both left and right whitespace');
  equal('   wasabi   '.trimLeft(), 'wasabi   ', 'String#trim | should trim left whitespace only');
  equal('   wasabi   '.trimRight(), '   wasabi', 'String#trim | should trim right whitespace only');

  equal('wasabi'.pad(), 'wasabi', 'String#pad | passing no params');
  equal('wasabi'.pad('"'), '"wasabi"', 'String#pad | padding with quotes');
  equal('wasabi'.pad('s'), 'swasabis', 'String#pad | padding with s');
  equal('wasabi'.pad(5), '5wasabi5', 'String#pad | padding with a number');
  equal('wasabi'.pad(null), 'wasabi', 'String#pad | padding with a null');
  equal('wasabi'.pad(undefined), 'wasabi', 'String#pad | padding with undefined');
  equal('wasabi'.pad(NaN), 'wasabi', 'String#pad | padding with NaN');
  equal('wasabi'.pad(' ', 0), 'wasabi', 'String#pad | passing in 0');
  equal('wasabi'.pad(' ', -1), 'wasabi', 'String#pad | passing in -1');
  equal('wasabi'.pad(' ', 3), '   wasabi   ', 'String#pad | should pad the string with 3 spaces');
  equal('wasabi'.pad(' ', 5), '     wasabi     ', 'String#pad | should pad the string with 5 spaces');
  equal('wasabi'.pad('-', 5), '-----wasabi-----', 'String#pad | should pad the string with 5 hyphens');
  equal('wasabi'.pad(' ', 2).pad('-', 3), '---  wasabi  ---', 'String#pad | should pad the string with 2 spaces and 3 hyphens');

  equal('wasabi'.padRight('-', 0), 'wasabi', 'String#padRight | 0 does not pad');
  equal('wasabi'.padRight('-', 3), 'wasabi---', 'String#padRight | should pad the string with 3 hyphens on the right');
  equal('wasabi'.padRight(' ', 3), 'wasabi   ', 'String#padRight | should pad the string with 3 spaces on the right');
  equal('wasabi'.padLeft('-', 0), 'wasabi', 'String#padLeft | 0 does not pad');
  equal('4'.padLeft('0', 3), '0004', 'String#padLeft | should pad the string with 4 zeroes on the left');
  equal('wasabi'.padLeft(' ', 3), '   wasabi', 'String#padLeft | should pad the string with 3 spaces on the left');

  equal('wasabi'.repeat(0), '', 'String#repeat | 0 should repeat the string 0 times');
  equal('wasabi'.repeat(-1), '', 'String#repeat | -1 should repeat the string 0 times');
  equal('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat | 2 should repeat the string 2 times');

  // "each" will return an array of everything that was matched, defaulting to individual characters
  equal('g'.each(), ['g'], 'String#each | each should return an array of each char');

  // Each without a first parameter assumes "each character"
  var result = 'g'.each(function(str, i) {
    equal(str, 'g', 'String#each | char should be passed as the first argument');
  });

  equal(result, ['g'], "String#each | ['g'] should be the resulting value");

  var counter = 0;
  result = 'ginger'.each(function(str, i) {
    equal(str, 'ginger'.charAt(counter), 'String#each | ginger | char should be passed as the first argument');
    equal(i, counter, 'String#each | ginger | index should be passed as the second argument');
    counter++;
  });
  equal(counter, 6, 'String#each | ginger | should have ran 6 times');
  equal(result, ['g','i','n','g','e','r'], 'String#each | ginger | resulting array should contain all the characters');

  counter = 0;
  result = 'ginger'.each('g', function(str, i) {
    equal(str, 'g', 'String#each | string argument | match should be passed as the first argument to the block');
    counter++;
  });
  equal(counter, 2, 'String#each | string argument | should have ran 2 times');
  equal(result, ['g','g'], "String#each | string argument | resulting array should be ['g','g']");

  counter = 0;
  test = ['g','i','g','e'];
  result = 'ginger'.each(/[a-i]/g, function(str, i) {
    equal(str, test[i], 'String#each | regexp argument | match should be passed as the first argument to the block');
    counter++;
  });
  equal(counter, 4, 'String#each | regexp argument | should have ran 4 times');
  equal(result, ['g','i','g','e'], "String#each | regexp argument | resulting array should have been ['g','i','g','e']");


  // .each should do the same thing as String#scan in ruby except that .each doesn't respect capturing groups
  var testString = 'cruel world';

  result = testString.each(/\w+/g);
  equal(result, ['cruel', 'world'], 'String#each | complex regexp | /\\w+/g');

  result = testString.each(/.../g);
  equal(result, ['cru', 'el ', 'wor'], 'String#each | complex regexp | /.../');

  result = testString.each(/(..)(..)/g);
  equal(result, ['crue', 'l wo'], 'String#each | complex regexp | /(..)(..)/');


  result = testString.each(/\w+/);
  equal(result, ['cruel', 'world'], 'String#each non-global regexes should still be global');


  // #shift


  equal('ク'.shift(1), 'グ', 'String#shift | should shift 1 code up');
  equal('グ'.shift(-1), 'ク', 'String#shift | should shift 1 code down');
  equal('ヘ'.shift(2), 'ペ', 'String#shift | should shift 2 codes');
  equal('ペ'.shift(-2), 'ヘ', 'String#shift | should shift -2 codes');
  equal('ク'.shift(0), 'ク', 'String#shift | should shift 0 codes');
  equal('ク'.shift(), 'ク', 'String#shift | no params simply returns the string');
  equal('カキクケコ'.shift(1), 'ガギグゲゴ', 'String#shift | multiple characters up one');
  equal('ガギグゲゴ'.shift(-1), 'カキクケコ', 'String#shift | multiple characters down one');



  // test each char code

  equal('jumpy'.codes(), [106,117,109,112,121], 'String#codes | jumpy');

  counter = 0;
  test = [103,105,110,103,101,114];
  result = 'ginger'.codes(function(str, i) {
    equal(str, test[i], 'String#codes | ginger codes | char code should have been passed into the block');
    counter++;
  });
  equal(counter, 6, 'String#codes | ginger codes | should have ran 6 times');
  equal(result, test, 'String#codes | ginger codes | result should be an array');

  // test each char
  counter = 0;
  result = 'ginger'.chars(function(str, i) {
    equal(str, 'ginger'.charAt(counter), 'String#chars | ginger | char code should be the first argument in the block');
    equal(i, counter, 'String#chars | ginger | index should be the second argument in the block');
    counter++;
  });
  equal(counter, 6, 'String#chars | ginger | should have run 6 times');
  equal(result, ['g','i','n','g','e','r'], 'String#chars | result should be an array');

  // test each char collects when properly returned
  counter = 0;
  result = 'ginger'.chars(function(str, i) {
    counter++;
    return str.toUpperCase();
  });
  equal(result, ['G','I','N','G','E','R'], 'String#chars | ginger | resulting array is properly collected');

  counter = 0;
  var sentence = 'these pretzels are \n\n making me         thirsty!\n\n';
  test = ['these', 'pretzels', 'are', 'making', 'me', 'thirsty!'];
  result = sentence.words(function(str, i) {
    equal(str, test[i], 'String#words | match is the first argument');
    counter++;
  });
  equal(counter, 6, 'String#words | should have run 6 times');
  equal(result, test, 'String#words | result should be an array of matches');

  counter = 0;
  var paragraph = 'these\npretzels\nare\n\nmaking\nme\n         thirsty!\n\n\n\n';
  test = ['these', 'pretzels', 'are', '', 'making', 'me', '         thirsty!'];
  result = paragraph.lines(function(str, i) {
    equal(str, test[i], 'String#lines | match is the first argument');
    counter++;
  });
  equal(counter, 7, 'String#lines | should have run 7 times');
  equal(result, test, 'String#lines | result should be an array of matches');

  result = 'one\ntwo'.lines(function(str, i) {
    return str.capitalize();
  });
  equal(['One','Two'], result, 'String#lines | lines can be modified');

  counter = 0;
  var essay = 'the history of the united states\n\n';
  essay +=    'it all began back in 1776 when someone declared something from someone.\n';
  essay +=    'it was at this point that we had to get our rears in gear\n\n';
  essay +=    'The British got their revenge in the late 60s with the British Invasion,\n';
  essay +=    'which claimed the lives of over 32,352 young women across the nation.\n\n\n\n\n';
  essay +=    'The End\n\n\n\n\n\n\n';
  test = ['the history of the united states', 'it all began back in 1776 when someone declared something from someone.\nit was at this point that we had to get our rears in gear', 'The British got their revenge in the late 60s with the British Invasion,\nwhich claimed the lives of over 32,352 young women across the nation.', 'The End'];
  result = essay.paragraphs(function(str, i) {
    equal(str, test[i], 'String#paragraphs | match is the first argument');
    counter ++;
  });
  equal(counter, 4, 'String#paragraphs | should have run 4 times');
  equal(result, test, 'String#paragraphs | result should be an array of matches');


  equal(''.codes(), [], 'String#codes | empty string');
  equal(''.chars(), [], 'String#chars | empty string');
  equal(''.words(), [], 'String#words | empty string');
  equal(''.lines(), [''], 'String#lines | empty string');
  equal(''.paragraphs(), [''], 'String#paragraphs | empty string');
  equal(''.each('f'), [], 'String#each | empty string | each f');
  equal(''.each(/foo/), [], 'String#each | empty string | each /foo/');
  equal(''.each(function() {}), [], 'String#each | empty string | passing a block');




  // startsWith/endsWith is defined in Harmony, so only passing a regex or
  // 3 arguments will actually test this code.

  equal('hello'.startsWith('hell', 0, true), true, 'String#startsWith | hello starts with hell');
  equal('HELLO'.startsWith('HELL', 0, true), true, 'String#startsWith | HELLO starts with HELL');
  equal('HELLO'.startsWith('hell', 0, true), false, 'String#startsWith | HELLO starts with hell');
  equal('HELLO'.startsWith('hell', 0, true), false, 'String#startsWith | case sensitive | HELLO starts with hell');
  equal('hello'.startsWith(/hell/, 0, true), true, 'String#startsWith | accepts regex', { prototype: false });
  equal('hello'.startsWith(/[a-h]/, 0, true), true, 'String#startsWith | accepts regex alternates', { prototype: false });
  equal('HELLO'.startsWith('hell', 0, false), true, 'String#startsWith | case insensitive | HELLO starts with hell', { prototype: false });
  equal('HELLO'.startsWith(), false, 'String#startsWith | undefined produces false');
  equal('hello'.startsWith('hell', -20, true), true, 'String#startsWith | from pos -20');
  equal('hello'.startsWith('hell', 1, true), false, 'String#startsWith | from pos 1');
  equal('hello'.startsWith('hell', 2, true), false, 'String#startsWith | from pos 2');
  equal('hello'.startsWith('hell', 3, true), false, 'String#startsWith | from pos 3');
  equal('hello'.startsWith('hell', 4, true), false, 'String#startsWith | from pos 4');
  equal('hello'.startsWith('hell', 5, true), false, 'String#startsWith | from pos 5');
  equal('hello'.startsWith('hell', 20, true), false, 'String#startsWith | from pos 20');
  equal('10'.startsWith(10), true, 'String#startsWith | Numbers will be converted');
  equal('valley girls\nrock'.startsWith('valley girls', 0, true), true, 'String#startsWith | valley girls rock starts with valley girls');
  equal('valley girls\nrock'.startsWith('valley girls r', 0, true), false, 'String#startsWith | valley girls rock starts with valley girls r');


  equal('vader'.endsWith('der', 5, true), true, 'String#endsWith | vader ends with der');
  equal('VADER'.endsWith('DER', 5, true), true, 'String#endsWith | VADER ends with DER');
  equal('VADER'.endsWith('der', 5, true), false, 'String#endsWith | VADER ends with der');
  equal('VADER'.endsWith('DER', 5, false), true, 'String#endsWith | case insensitive | VADER ends with DER');
  equal('vader'.endsWith(/der/, 5, true), true, 'String#endsWith | accepts regex', { prototype: false });
  equal('vader'.endsWith(/[q-z]/, 5, true), true, 'String#endsWith | accepts regex alternates', { prototype: false });
  equal('VADER'.endsWith('der', 5, false), true, 'String#endsWith | case insensitive |  VADER ends with der', { prototype: false });
  equal('VADER'.endsWith('DER', 5, true), true, 'String#endsWith | case sensitive | VADER ends with DER');
  equal('VADER'.endsWith('der', 5, true), false, 'String#endsWith | case sensitive |  VADER ends with der');
  equal('vader'.endsWith('der', -20, true), false, 'String#startsWith | from pos -20');
  equal('vader'.endsWith('der', 0, true), false, 'String#startsWith | from pos 0');
  equal('vader'.endsWith('der', 1, true), false, 'String#startsWith | from pos 1');
  equal('vader'.endsWith('der', 2, true), false, 'String#startsWith | from pos 2');
  equal('vader'.endsWith('der', 3, true), false, 'String#startsWith | from pos 3');
  equal('vader'.endsWith('der', 4, true), false, 'String#startsWith | from pos 4');
  equal('vader'.endsWith('der', 20, true), true, 'String#startsWith | from pos 20');
  equal('HELLO'.endsWith(), false, 'String#endsWith | undefined produces false');
  equal('10'.endsWith(10), true, 'String#endsWith | Numbers will be converted');
  equal('i aint your\nfather'.endsWith('father', 18, true), true, 'String#endsWith | vader ends with der');
  equal('i aint your\nfather'.endsWith('r father', 18, false), false, 'String#endsWith | vader ends with der');


  equal(''.isBlank(), true, 'String#blank | blank string');
  equal('0'.isBlank(), false, 'String#blank | 0');
  equal('            '.isBlank(), true, 'String#blank | successive blanks');
  equal('\n'.isBlank(), true, 'String#blank | new line');
  equal('\t\t\t\t'.isBlank(), true, 'String#blank | tabs');
  equal('日本語では　「マス」　というの知ってた？'.isBlank(), false, 'String#blank | japanese');
  equal('mayonnaise'.isBlank(), false, 'String#blank | mayonnaise');


  equal('foo'.has('f'), true, 'String#has | foo has f');
  equal('foo'.has('oo'), true, 'String#has | foo has oo');
  equal('foo'.has(/f/), true, 'String#has | foo has /f/');
  equal('foo'.has(/[a-g]/), true, 'String#has | foo has /[a-g]/');
  equal('foo'.has(/[p-z]/), false, 'String#has | foo has /[p-z]/');
  equal('flu?ffy'.has('?'), true, 'String#has | flu?ffy has ?');
  equal('flu?ffy'.has('\?'), true, 'String#has | flu?ffy has one slash and ?');
  equal('flu?ffy'.has('\\?'), false, 'String#has | flu?ffy has two slashes and ?');
  equal('flu?ffy'.has('\\\?'), false, 'String#has | flu?ffy has three slashes and ?');
  equal('flu?ffy'.has(/\?/), true, 'String#has | flu?ffy has one slash and ? in a regex');
  equal('flu?ffy'.has(/\\?/), true, 'String#has | flu?ffy has two slashes and ? in a regex');
  equal('flu?ffy'.has(/\\\?/), false, 'String#has | flu?ffy has three slashes and ? in a regex');
  equal('flu\\?ffy'.has(/\\\?/), true, 'String#has | flu\\?ffy has three slashes and ? in a regex');

  equal('schfifty'.add(' five'), 'schfifty five', 'String#add | schfifty five');
  equal('dopamine'.add('e', 3), 'dopeamine', 'String#add | dopeamine');
  equal('spelling eror'.add('r', -3), 'spelling error', 'String#add | add from the end');
  equal('flack'.add('a', 0), 'aflack', 'String#add | add at 0');
  equal('five'.add('schfifty', 20), 'fiveschfifty', 'String#add | adds out of positive range');
  equal('five'.add('schfifty ', -20), 'schfifty five', 'String#add | adds out of negative range');
  equal('five'.add('schfifty', 4), 'fiveschfifty', 'String#add | add at position 4');
  equal('five'.add('schfifty', 5), 'fiveschfifty', 'String#add | add at position 5');
  equal(''.add(['schfifty', ' five']), 'schfifty, five', 'String#add | arrays are stringified');

  equal('schfifty five'.remove('five'), 'schfifty ', 'String#remove | five');
  equal('schfifty five'.remove(/five/), 'schfifty ', 'String#remove | /five/');
  equal('schfifty five'.remove(/f/), 'schifty five', 'String#remove | /f/');
  equal('schfifty five'.remove(/f/g), 'schity ive', 'String#remove | /f/g');
  equal('schfifty five'.remove(/[a-f]/g), 'shity iv', 'String#remove | /[a-f]/');
  equal('?'.remove('?'), '', 'String#remove | strings have tokens escaped');
  equal('?('.remove('?('), '', 'String#remove | strings have all tokens escaped');

  equal('schfifty'.insert(' five'), 'schfifty five', 'String#insert | schfifty five');
  equal('dopamine'.insert('e', 3), 'dopeamine', 'String#insert | dopeamine');
  equal('spelling eror'.insert('r', -3), 'spelling error', 'String#insert | inserts from the end');
  equal('flack'.insert('a', 0), 'aflack', 'String#insert | inserts at 0');
  equal('five'.insert('schfifty', 20), 'fiveschfifty', 'String#insert | adds out of positive range');
  equal('five'.insert('schfifty', -20), 'schfiftyfive', 'String#insert | adds out of negative range');
  equal('five'.insert('schfifty', 4), 'fiveschfifty', 'String#insert | inserts at position 4');
  equal('five'.insert('schfifty', 5), 'fiveschfifty', 'String#insert | inserts at position 5');

  equal('abcd'.insert('X', 2), 'abXcd', 'String#insert | X | 2');
  equal('abcd'.insert('X', 1), 'aXbcd', 'String#insert | X | 1');
  equal('abcd'.insert('X', 0), 'Xabcd', 'String#insert | X | 0');
  equal('abcd'.insert('X', -1), 'abcXd', 'String#insert | X | -1');
  equal('abcd'.insert('X', -2), 'abXcd', 'String#insert | X | -2');


  equal('4em'.toNumber(), 4, 'String#toNumber | 4em');
  equal('10px'.toNumber(), 10, 'String#toNumber | 10px');
  equal('10,000'.toNumber(), 10000, 'String#toNumber | 10,000');
  equal('5,322,144,444'.toNumber(), 5322144444, 'String#toNumber | 5,322,144,444');
  equal('10.532'.toNumber(), 10.532, 'String#toNumber | 10.532');
  equal('10'.toNumber(), 10, 'String#toNumber | 10');
  equal('95.25%'.toNumber(), 95.25, 'String#toNumber | 95.25%');
  equal('10.848'.toNumber(), 10.848, 'String#toNumber | 10.848');

  equal('1234blue'.toNumber(), 1234, 'String#toNumber | 1234blue');
  equal(isNaN('0xA'.toNumber()), false, 'String#toNumber | "0xA" should not be NaN');
  equal('22.5'.toNumber(), 22.5, 'String#toNumber | 22.5');
  equal(isNaN('blue'.toNumber()), true, 'String#toNumber | "blue" should not be NaN');

  equal('010'.toNumber(), 10, 'String#toNumber | "010" should be 10');
  equal('0908'.toNumber(), 908, 'String#toNumber | "0908" should be 908');
  equal('22.34.5'.toNumber(), 22.34, 'String#toNumber | "22.34.5" should be 22.34');

  equal(isNaN('........'.toNumber()), true, 'String#toNumber | "......." should be NaN');

  equal('1.45kg'.toNumber(), 1.45, 'String#toNumber | "1.45kg"');
  equal('77.3'.toNumber(), 77.3, 'String#toNumber | 77.3');
  equal('077.3'.toNumber(), 77.3, 'String#toNumber | "077.3" should be 77.3');
  equal(isNaN('0x77.3'.toNumber()), false, 'String#toNumber | "0x77.3" is not NaN');
  equal('.3'.toNumber(), 0.3, 'String#toNumber | ".3" should be 0.3');
  equal('0.1e6'.toNumber(), 100000, 'String#toNumber | "0.1e6" should be 100000');


  // This should handle hexadecimal, etc
  equal('ff'.toNumber(16), 255, 'String#toNumber | hex | ff');
  equal('00'.toNumber(16), 0, 'String#toNumber | hex | 00');
  equal('33'.toNumber(16), 51, 'String#toNumber | hex | 33');
  equal('66'.toNumber(16), 102, 'String#toNumber | hex | 66');
  equal('99'.toNumber(16), 153, 'String#toNumber | hex | 99');
  equal('bb'.toNumber(16), 187, 'String#toNumber | hex | bb');




  equal('spoon'.reverse(), 'noops', 'String#reverse | spoon');
  equal('amanaplanacanalpanama'.reverse(), 'amanaplanacanalpanama', 'String#reverse | amanaplanacanalpanama');


  equal('the rain in     spain    falls mainly   on     the        plain'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact | basic');
  equal('\n\n\nthe \n\n\nrain in     spain    falls mainly   on     the        plain\n\n'.compact(), 'the rain in spain falls mainly on the plain', 'String#compact | with newlines');
  equal('\n\n\n\n           \t\t\t\t          \n\n      \t'.compact(), '', 'String#compact | with newlines and tabs');

  var largeJapaneseSpaces = '　　　日本語　　　　　の　　　　　スペース　　　　　も　　';
  var compactedWithoutJapaneseSpaces = '日本語　の　スペース　も';
  var compactedWithTrailingJapaneseSpaces = '　日本語　の　スペース　も　';

  equal('moo\tmoo'.compact(), 'moo moo', 'String#compact | moo moo tab');
  equal('moo \tmoo'.compact(), 'moo moo', 'String#compact | moo moo space tab');
  equal('moo \t moo'.compact(), 'moo moo', 'String#compact | moo moo space tab space');


  equal('foop'.at(0), 'f', 'String#at | pos 0');
  equal('foop'.at(1), 'o', 'String#at | pos 1');
  equal('foop'.at(2), 'o', 'String#at | pos 2');
  equal('foop'.at(3), 'p', 'String#at | pos 3');
  equal('foop'.at(4), 'f', 'String#at | pos 4');
  equal('foop'.at(5), 'o', 'String#at | pos 5');
  equal('foop'.at(1224), 'f', 'String#at | out of bounds');
  equal('foop'.at(-1), 'p', 'String#at | negative | pos -1');
  equal('foop'.at(-2), 'o', 'String#at | negative | pos -2');
  equal('foop'.at(-3), 'o', 'String#at | negative | pos -3');
  equal('foop'.at(-4), 'f', 'String#at | negative | pos -4');
  equal('foop'.at(-5), 'p', 'String#at | negative | pos -5');
  equal('foop'.at(-1224), 'f', 'String#at | negative | out of bounds');

  equal('foop'.at(0, false), 'f', 'String#at | pos 0');
  equal('foop'.at(1, false), 'o', 'String#at | pos 1');
  equal('foop'.at(2, false), 'o', 'String#at | pos 2');
  equal('foop'.at(3, false), 'p', 'String#at | pos 3');
  equal('foop'.at(4, false), '', 'String#at | pos 4');
  equal('foop'.at(1224, false), '', 'String#at | out of bounds');
  equal('foop'.at(-1, false), '', 'String#at | negative | pos -1');
  equal('foop'.at(-2, false), '', 'String#at | negative | pos -2');
  equal('foop'.at(-3, false), '', 'String#at | negative | pos -3');
  equal('foop'.at(-4, false), '', 'String#at | negative | pos -4');
  equal('foop'.at(-5, false), '', 'String#at | negative | pos -5');
  equal('foop'.at(-1224, false), '', 'String#at | negative | out of bounds');

  equal('wowzers'.at(0,2,4,6), ['w','w','e','s'], 'String#at | handles enumerated params');
  equal('wowzers'.at(0,2,4,6,18), ['w','w','e','s','e'], 'String#at | handles enumerated params');
  equal('wowzers'.at(0,2,4,6,18,false), ['w','w','e','s',''], 'String#at | handles enumerated params');


  equal('quack'.first(), 'q', 'String#first | first character');
  equal('quack'.first(2), 'qu', 'String#first | first 2 characters');
  equal('quack'.first(3), 'qua', 'String#first | first 3 characters');
  equal('quack'.first(4), 'quac', 'String#first | first 4 characters');
  equal('quack'.first(20), 'quack', 'String#first | first 20 characters');
  equal('quack'.first(0), '', 'String#first | first 0 characters');
  equal('quack'.first(-1), '', 'String#first | first -1 characters');
  equal('quack'.first(-5), '', 'String#first | first -5 characters');
  equal('quack'.first(-10), '', 'String#first | first -10 characters');



  equal('quack'.last(), 'k', 'String#last | last character');
  equal('quack'.last(2), 'ck', 'String#last | last 2 characters');
  equal('quack'.last(3), 'ack', 'String#last | last 3 characters');
  equal('quack'.last(4), 'uack', 'String#last | last 4 characters');
  equal('quack'.last(10), 'quack', 'String#last | last 10 characters');
  equal('quack'.last(-1), '', 'String#last | last -1 characters');
  equal('quack'.last(-5), '', 'String#last | last -5 characters');
  equal('quack'.last(-10), '', 'String#last | last -10 characters');
  equal('fa'.last(3), 'fa', 'String#last | last 3 characters');


  equal('quack'.from(), 'quack', 'String#from | no params');
  equal('quack'.from(0), 'quack', 'String#from | from 0');
  equal('quack'.from(2), 'ack', 'String#from | from 2');
  equal('quack'.from(4), 'k', 'String#from | from 4');
  equal('quack'.from(-1), 'k', 'String#from | from -1');
  equal('quack'.from(-3), 'ack', 'String#from | from -3');
  equal('quack'.from(-4), 'uack', 'String#from | from -4');


  equal('quack'.to(), 'quack', 'String#to | no params');
  equal('quack'.to(0), '', 'String#to | to 0');
  equal('quack'.to(1), 'q', 'String#to | to 1');
  equal('quack'.to(2), 'qu', 'String#to | to 2');
  equal('quack'.to(4), 'quac', 'String#to | to 4');
  equal('quack'.to(-1), 'quac', 'String#to | to -1');
  equal('quack'.to(-3), 'qu', 'String#to | to -3');
  equal('quack'.to(-4), 'q', 'String#to | to -4');


  equal('hop_on_pop'.dasherize(), 'hop-on-pop', 'String#dasherize | underscores');
  equal('HOP_ON_POP'.dasherize(), 'hop-on-pop', 'String#dasherize | capitals and underscores', { prototype: 'HOP-ON-POP' });
  equal('hopOnPop'.dasherize(), 'hop-on-pop', 'String#dasherize | camel-case', { prototype: 'hopOnPop' });
  equal('watch me fail'.dasherize(), 'watch-me-fail', 'String#dasherize | whitespace', { prototype: 'watch me fail' });
  equal('watch me fail_sad_face'.dasherize(), 'watch-me-fail-sad-face', 'String#dasherize | whitespace sad face', { prototype: 'watch me fail-sad-face' });
  equal('waTch me su_cCeed'.dasherize(), 'wa-tch-me-su-c-ceed', 'String#dasherize | complex whitespace', { prototype: 'waTch me su-cCeed' });

  equal('aManAPlanACanalPanama'.dasherize(), 'a-man-a-plan-a-canal-panama', 'String#dasherize | single characters', { prototype: 'aManAPlanACanalPanama' });



  equal('hop-on-pop'.camelize(), 'HopOnPop', 'String#camelize | dashes', { prototype: 'hopOnPop' });
  equal('HOP-ON-POP'.camelize(), 'HopOnPop', 'String#camelize | capital dashes', { prototype: 'HOPONPOP' });
  equal('hop_on_pop'.camelize(), 'HopOnPop', 'String#camelize | underscores', { prototype: 'hop_on_pop' });
  equal('hop-on-pop'.camelize(false), 'hopOnPop', 'String#camelize | first false | dashes');
  equal('HOP-ON-POP'.camelize(false), 'hopOnPop', 'String#camelize | first false | capital dashes', { prototype: 'HOPONPOP' });
  equal('hop_on_pop'.camelize(false), 'hopOnPop', 'String#camelize | first false | underscores', { prototype: 'hop_on_pop' });
  equal('hop-on-pop'.camelize(true), 'HopOnPop', 'String#camelize | first true | dashes', { prototype: 'hopOnPop' });
  equal('HOP-ON-POP'.camelize(true), 'HopOnPop', 'String#camelize | first true | capital dashes', { prototype: 'HOPONPOP' });
  equal('hop_on_pop'.camelize(true), 'HopOnPop', 'String#camelize | first true | underscores', { prototype: 'hop_on_pop' });

  equal('watch me fail'.camelize(), 'WatchMeFail', 'String#camelize | whitespace', { prototype: 'watch me fail' });
  equal('watch   me   fail'.camelize(), 'WatchMeFail', 'String#camelize | long whitespace', { prototype: 'watch   me   fail' });
  equal('watch me fail-sad-face'.camelize(), 'WatchMeFailSadFace', 'String#camelize | whitespace sad face', { prototype: 'watch me failSadFace' });
  equal('waTch me su-cCeed'.camelize(), 'WaTchMeSuCCeed', 'String#camelize | complex whitespace', { prototype: 'waTch me suCCeed' });

  equal('watch me fail'.camelize(false), 'watchMeFail', 'String#camelize | first false | whitespace', { prototype: 'watch me fail' });
  equal('watch me fail-sad-face'.camelize(false), 'watchMeFailSadFace', 'String#camelize | first false | whitespace sad face', { prototype: 'watch me failSadFace' });
  equal('waTch me su-cCeed'.camelize(false), 'waTchMeSuCCeed', 'String#camelize | first false | complex whitespace', { prototype: 'waTch me suCCeed' });




  equal('hopOnPop'.underscore(), 'hop_on_pop', 'String#underscore | camel-case');
  equal('HopOnPop'.underscore(), 'hop_on_pop', 'String#underscore | camel-case capital first');
  equal('HOPONPOP'.underscore(), 'hoponpop', 'String#underscore | all caps', { prototype: 'hoponpop' });
  equal('HOP-ON-POP'.underscore(), 'hop_on_pop', 'String#underscore | caps and dashes', { prototype: 'hop_on_pop' });
  equal('hop-on-pop'.underscore(), 'hop_on_pop', 'String#underscore | lower-case and dashes');

  equal('watch me fail'.underscore(), 'watch_me_fail', 'String#underscore | whitespace', { prototype: 'watch me fail' });
  equal('watch   me   fail'.underscore(), 'watch_me_fail', 'String#underscore | long whitespace', { prototype: 'watch   me   fail' });
  equal('watch me fail-sad-face'.underscore(), 'watch_me_fail_sad_face', 'String#underscore | whitespace sad face', { prototype: 'watch me fail_sad_face' });
  equal('waTch me su-cCeed'.underscore(), 'wa_tch_me_su_c_ceed', 'String#underscore | complex whitespace', { prototype: 'wa_tch me su_c_ceed' });


  equal('hopOnPop'.spacify(), 'hop on pop', 'String#spacify | camel-case');
  equal('HopOnPop'.spacify(), 'hop on pop', 'String#spacify | camel-case capital first');
  equal('HOPONPOP'.spacify(), 'hoponpop', 'String#spacify | all caps', { prototype: 'hoponpop' });
  equal('HOP-ON-POP'.spacify(), 'hop on pop', 'String#spacify | caps and dashes', { prototype: 'hop on pop' });
  equal('hop-on-pop'.spacify(), 'hop on pop', 'String#spacify | lower-case and dashes');

  equal('watch_me_fail'.spacify(), 'watch me fail', 'String#spacify | whitespace');
  equal('watch-meFail-sad-face'.spacify(), 'watch me fail sad face', 'String#spacify | whitespace sad face');
  equal('waTch me su-cCeed'.spacify(), 'wa tch me su c ceed', 'String#spacify | complex whitespace');


  var stripped;
  var html =
  '<div class="outer">' +
  '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
  '</div>';
  var allStripped = 'text with links, &quot;entities&quot; and bold tags';

  var malformed_html = '<div class="outer"><p>paragraph';


  stripped =
  '<div class="outer">' +
  '<p>text with links, &quot;entities&quot; and <b>bold</b> tags</p>' +
  '</div>';

  equal(html.stripTags('a'), stripped, 'String#stripTags | stripped a tags', { prototype: allStripped });
  equal(html.stripTags('a') == html, false, 'String#stripTags | stripped <a> tags was changed');


  stripped =
  '<div class="outer">' +
  '<p>text with links, &quot;entities&quot; and bold tags</p>' +
  '</div>';
  equal(html.stripTags('a', 'b'), stripped, 'String#stripTags | stripped <a> and <b> tags', { prototype: allStripped });
  equal(html.stripTags(['a', 'b']), stripped, 'String#stripTags | array | stripped <a> and <b> tags', { prototype: allStripped });


  stripped =
  '<div class="outer">' +
  'text with links, &quot;entities&quot; and <b>bold</b> tags' +
  '</div>';
  equal(html.stripTags('p', 'a'), stripped, 'String#stripTags | stripped <p> and <a> tags', { prototype: allStripped });
  equal(html.stripTags(['p', 'a']), stripped, 'String#stripTags | array | stripped <p> and <a> tags', { prototype: allStripped });


  stripped = '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>';
  equal(html.stripTags('div'), stripped, 'String#stripTags | stripped <div> tags', { prototype: allStripped});


  stripped = 'text with links, &quot;entities&quot; and bold tags';
  equal(html.stripTags(), stripped, 'String#stripTags | all tags stripped');


  stripped = '<p>paragraph';
  equal(malformed_html.stripTags('div'), stripped, 'String#stripTags | malformed | div tag stripped', { prototype: 'paragraph' });

  stripped = '<div class="outer">paragraph';
  equal(malformed_html.stripTags('p'), stripped, 'String#stripTags | malformed | p tags stripped', { prototype: 'paragraph' });

  stripped = 'paragraph';
  equal(malformed_html.stripTags(), stripped, 'String#stripTags | malformed | all tags stripped');



  equal('<b NOT BOLD</b>'.stripTags(), '<b NOT BOLD', "String#stripTags | does not strip tags that aren't properly closed", { prototype: '' });
  equal('a < b'.stripTags(), 'a < b', 'String#stripTags | does not strip less than');
  equal('a > b'.stripTags(), 'a > b', 'String#stripTags | does not strip greater than');
  equal('</foo  >>'.stripTags(), '>', 'String#stripTags | strips closing tags with white space', { prototype: '</foo  >>' });



  /* Stipping self-closing tags */
  equal('<input type="text" class="blech" />'.stripTags(), '', 'String#stripTags | full input stripped');

  equal('<b>bold<b> and <i>italic</i> and <a>link</a>'.stripTags('b','i'), 'bold and italic and <a>link</a>', 'String#stripTags | handles multi args', { prototype: 'bold and italic and link' });

  html =
  '<form action="poo.php" method="post">' +
  '<p>' +
  '<label>label for text:</label>' +
  '<input type="text" value="brabra" />' +
  '<input type="submit" value="submit" />' +
  '</p>' +
  '</form>';

  equal(html.stripTags(), 'label for text:', 'String#stripTags | form | all tags removed');
  equal(html.stripTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'String#stripTags | form | input tags stripped', { prototype: 'label for text:' });
  equal(html.stripTags('input', 'p', 'form'), '<label>label for text:</label>', 'String#stripTags | form | input, p, and form tags stripped', { prototype: 'label for text:' });

  /* Stripping namespaced tags */
  equal('<xsl:template>foobar</xsl:template>'.stripTags(), 'foobar', 'String#stripTags | strips tags with xml namespaces', { prototype: '<xsl:template>foobar</xsl:template>' });
  equal('<xsl:template>foobar</xsl:template>'.stripTags('xsl:template'), 'foobar', 'String#stripTags | strips xsl:template', { prototype: '<xsl:template>foobar</xsl:template>' });
  equal('<xsl/template>foobar</xsl/template>'.stripTags('xsl/template'), 'foobar', 'String#stripTags | strips xsl/template', { prototype: '<xsl/template>foobar</xsl/template>' });


  /* No errors on RegExp */
  equal('<xsl(template>foobar</xsl(template>'.stripTags('xsl(template'), 'foobar', 'String#stripTags | no regexp errors on tokens', { prototype: '<xsl(template>foobar</xsl(template>' });




  html =
  '<div class="outer">' +
  '<p>text with <a href="http://foobar.com/">links</a>, &quot;entities&quot; and <b>bold</b> tags</p>' +
  '</div>';
  var removed;

  removed =
  '<div class="outer">' +
  '<p>text with , &quot;entities&quot; and <b>bold</b> tags</p>' +
  '</div>';
  equal(html.removeTags('a'), removed, 'String#removeTags | <a> tag removed');
  equal(html.removeTags('a') == html, false, 'String#removeTags | html was changed');


  removed =
  '<div class="outer">' +
  '<p>text with , &quot;entities&quot; and  tags</p>' +
  '</div>';
  equal(html.removeTags('a', 'b'), removed, 'String#removeTags | <a> and <b> tags removed');
  equal(html.removeTags(['a', 'b']), removed, 'String#removeTags | array | <a> and <b> tags removed');


  removed =
  '<div class="outer"></div>';
  equal(html.removeTags('p', 'a'), removed, 'String#removeTags | <p> and <a> tags removed');
  equal(html.removeTags(['p', 'a']), removed, 'String#removeTags | array | <p> and <a> tags removed');


  equal(html.removeTags('div'), '', 'String#removeTags | <div> tags removed');
  equal(html.removeTags(), '', 'String#removeTags | removing all tags');

  equal(malformed_html.removeTags('div'), malformed_html, 'String#removeTags | malformed | <div> tags removed');
  equal(malformed_html.removeTags('p'), malformed_html, 'String#removeTags | malformed | <p> tags removed');
  equal(malformed_html.removeTags(), malformed_html, 'String#removeTags | malformed | all tags removed');



  equal('<b NOT BOLD</b>'.removeTags(), '<b NOT BOLD</b>', 'String#removeTags | unclosed opening tag untouched');
  equal('a < b'.removeTags(), 'a < b', 'String#removeTags | less than unaffected');
  equal('a > b'.removeTags(), 'a > b', 'String#removeTags | greater than unaffected');
  equal('</foo  >>'.removeTags(), '</foo  >>', 'String#removeTags | malformed closing tag unaffected');



  /* Stipping self-closing tags */
  equal('<input type="text" class="blech" />'.removeTags(), '', 'String#removeTags');

  html =
  '<form action="poo.php" method="post">' +
  '<p>' +
  '<label>label for text:</label>' +
  '<input type="text" value="brabra" />' +
  '<input type="submit" value="submit" />' +
  '</p>' +
  '</form>';

  equal(html.removeTags(), '', 'String#removeTags | form | removing all tags');
  equal(html.removeTags('input'), '<form action="poo.php" method="post"><p><label>label for text:</label></p></form>', 'String#removeTags | form | removing input tags');
  equal(html.removeTags('input', 'p', 'form'), '', 'String#removeTags | form | removing input, p, and form tags');

  /* Stripping namespaced tags */
  equal('<xsl:template>foobar</xsl:template>'.removeTags(), '', 'String#removeTags | form | xml namespaced tags removed');
  equal('<xsl:template>foobar</xsl:template>'.removeTags('xsl:template'), '', 'String#removeTags | form | xsl:template removed');
  equal('<xsl/template>foobar</xsl/template>'.removeTags('xsl/template'), '', 'String#removeTags | form | xsl/template removed');


  /* No errors on RegExp */
  raisesError(function(){ '<xsl(template>foobar</xsl(template>'.removeTags('xsl(template') }, 'String#removeTags | form | you now have the power to cause your own regex pain');

  equal('<b>bold</b> and <i>italic</i> and <a>link</a>'.removeTags('b','i'), ' and  and <a>link</a>', 'String#removeTags | handles multi args');



  equal(''.escapeRegExp(), '', 'String#escapeRegExp | blank');
  equal('|'.escapeRegExp(), '\\|', 'String#escapeRegExp | pipe');
  equal(''.capitalize(), '', 'String#capitalize | blank');
  equal('wasabi'.capitalize(), 'Wasabi', 'String#capitalize | wasabi');
  equal(''.trim(), '', 'String#trim | blank');
  equal(' wasabi '.trim(), 'wasabi', 'String#trim | wasabi with whitespace');
  equal(''.trimLeft(), '', 'String#trimLeft | blank');
  equal(' wasabi '.trimLeft(), 'wasabi ', 'String#trimLeft | wasabi with whitespace');
  equal(''.trimRight(), '', 'String#trimRight | blank');
  equal(' wasabi '.trimRight(), ' wasabi', 'String#trimRight | wasabi with whitespace');
  equal(''.pad(' ', 0), '', 'String#pad | blank');
  equal('wasabi'.pad(' ', 1), ' wasabi ', 'String#pad | wasabi padded to 1');
  equal('wasabi'.repeat(0), '', 'String#repeat | repeating 0 times');
  equal('wasabi'.repeat(1), 'wasabi', 'String#repeat | repeating 1 time');
  equal('wasabi'.repeat(2), 'wasabiwasabi', 'String#repeat | repeating 2 time');
  equal(''.insert('-', 0), '-', 'String#insert | - inserted at 0');
  equal('b'.insert('-', 0), '-b', 'String#insert | b inserted at 0');
  equal('b'.insert('-', 1), 'b-', 'String#insert | b inserted at 1');
  equal(''.reverse(), '', 'String#reverse | blank');
  equal('wasabi'.reverse(), 'ibasaw', 'String#reverse | wasabi');
  equal(''.compact(), '', 'String#compact | blank');
  equal('run   tell    dat'.compact(), 'run tell dat', 'String#compact | with extra whitespace');
  equal(''.at(3), '', 'String#at | blank');
  equal('wasabi'.at(0), 'w', 'String#at | wasabi at pos 0');
  equal(''.first(), '', 'String#first | blank');
  equal('wasabi'.first(), 'w', 'String#first | no params');
  equal(''.last(), '', 'String#last | blank');
  equal('wasabi'.last(), 'i', 'String#last | no params');
  equal(''.from(0), '', 'String#from | blank');
  equal('wasabi'.from(3), 'abi', 'String#from | from pos 3');
  equal(''.to(0), '', 'String#to | blank');
  equal('wasabi'.to(3), 'was', 'String#to | to pos 3');
  equal(''.dasherize(), '', 'String#dasherize | blank');
  equal('noFingWay'.dasherize(), 'no-fing-way', 'String#dasherize | noFingWay', { prototype: 'noFingWay' });
  equal(''.underscore(), '', 'String#underscore | blank');
  equal('noFingWay'.underscore(), 'no_fing_way', 'String#underscore | noFingWay');
  equal(''.camelize(), '', 'String#camelize | blank');
  equal('no-fing-way'.camelize(), 'NoFingWay', 'String#camelize | no-fing-way', { prototype: 'noFingWay' });
  equal(''.stripTags(), '', 'String#stripTags | blank');
  equal('chilled <b>monkey</b> brains'.stripTags(), 'chilled monkey brains', 'String#stripTags | chilled <b>monkey</b> brains');
  equal(''.removeTags(), '', 'String#removeTags | blank');
  equal('chilled <b>monkey</b> brains'.removeTags(), 'chilled  brains', 'String#removeTags | chilled <b>monkey</b> brains');


  // Thanks to Steven Levitah (http://stevenlevithan.com/demo/split.cfm) for inspiration and information here.


  // String#split is now removed from the main packages and is in /lib/extra...
  // keeping the unit tests as they are valuable.
  //equal('a,b,c,d,e'.split(',') , ['a','b','c','d','e'] , 'Array#split | splits on standard commas');
  //equal('a|b|c|d|e'.split(',') , ['a|b|c|d|e'] , "Array#split | doesn't split on standard commas");
  //equal('a|b|c|d|e'.split('|') , ['a','b','c','d','e'] , 'Array#split | splits on pipes');
  //equal('a,b,c,d,e'.split(/,/) , ['a','b','c','d','e'] , 'Array#split | splits on standard regexp commas');
  //equal('a|b|c|d|e'.split(/\|/) , ['a','b','c','d','e'] , 'Array#split | splits on standard regexp pipes');
  //equal('a|b|c|d|e'.split(/[,|]/) , ['a','b','c','d','e'] , 'Array#split | splits on classes');
  //equal('a|b|c|d|e'.split(/[a-z]/) , ['','|','|','|','|',''] , 'Array#split | splits on classes with ranges');
  //equal('a|b|c|d|e'.split(/\|*/) , ['a','b','c','d','e'] , 'Array#split | splits on star');
  //equal('a|b|c|d|e'.split(/\|?/) , ['a','b','c','d','e'] , 'Array#split | splits on optionals');

  //equal('a,b,c,d,e'.split(',', 2) , ['a','b'] , 'Array#split | handles limits');

  //equal('a|||b|c|d|e'.split('|') , ['a', '', '', 'b','c','d','e'] , 'Array#split | splits back-to-back separators on a string');
  //equal('a|||b|c|d|e'.split(/\|/) , ['a', '', '', 'b','c','d','e'] , 'Array#split | splits back-to-back separators on a regexp');

  //equal('paragraph one\n\nparagraph two\n\n\n'.split(/\n/) , ['paragraph one', '', 'paragraph two','','',''] , 'Array#split | splits on new lines');
  //equal(''.split() , [''] , 'Array#split | has a single null string for null separators on null strings');
  //equal(''.split(/./) , [''] , 'Array#split | has a single null string for separators on null strings');

  //equal(''.split(/.?/) , [] , 'Array#split | has a single null string for optionals on null strings');
  //equal(''.split(/.??/) , [] , 'Array#split | has a single null string for double optionals on null strings');

  //equal('a'.split(/./) , ['',''] , 'Array#split | has two entries when splitting on the only character in the string');
  //equal('a'.split(/-/) , ['a'] , 'Array#split | has one entry when only one character and no match');
  //equal('a-b'.split(/-/) , ['a', 'b'] , 'Array#split | properly splits hyphens');
  //equal('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split | properly splits optional hyphens');


  //equal('a:b:c'.split(/(:)/) , ['a',':','b',':','c'] , 'Array#split | respects capturing groups');


  //equal('ab'.split(/a*/) , ['', 'b'] , 'Array#split | complex regex splitting | /a*/');
  //equal('ab'.split(/a*?/) , ['a', 'b'] , 'Array#split | complex regex splitting | /a*?/');
  //equal('ab'.split(/(?:ab)/) , ['', ''] , 'Array#split | complex regex splitting | /(?:ab)/');
  //equal('ab'.split(/(?:ab)*/) , ['', ''] , 'Array#split | complex regex splitting | /(?:ab)*/');
  //equal('ab'.split(/(?:ab)*?/) , ['a', 'b'] , 'Array#split | complex regex splitting | /(?:ab)*?/');
  //equal('test'.split('') , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | empty string');
  //equal('test'.split() , ['test'] , 'Array#split | complex regex splitting | no argument');
  //equal('111'.split(1) , ['', '', '', ''] , 'Array#split | complex regex splitting | 1');
  //equal('test'.split(/(?:)/, 2) , ['t', 'e'] , 'Array#split | complex regex splitting | index is 2');
  //equal('test'.split(/(?:)/, -1) , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | index is -1');
  //equal('test'.split(/(?:)/, undefined) , ['t', 'e', 's', 't'] , 'Array#split | complex regex splitting | index is undefined');
  //equal('test'.split(/(?:)/, null) , [] , 'Array#split | complex regex splitting | index is undefined');
  //equal('test'.split(/(?:)/, NaN) , [] , 'Array#split | complex regex splitting | index is NaN');
  //equal('test'.split(/(?:)/, true) , ['t'] , 'Array#split | complex regex splitting | index is true');
  //equal('test'.split(/(?:)/, '2') , ['t', 'e'] , 'Array#split | complex regex splitting | index is "2"');
  //equal('test'.split(/(?:)/, 'two') , [] , 'Array#split | complex regex splitting | index is two');
  //equal('a'.split(/-/) , ['a'] , 'Array#split | complex regex splitting | a | /-/');
  //equal('a'.split(/-?/) , ['a'] , 'Array#split | complex regex splitting | a | /-?/');
  //equal('a'.split(/-??/) , ['a'] , 'Array#split | complex regex splitting | a | /-??/');
  //equal('a'.split(/a/) , ['', ''] , 'Array#split | complex regex splitting | a | /a/');
  //equal('a'.split(/a?/) , ['', ''] , 'Array#split | complex regex splitting | a | /a?/');
  //equal('a'.split(/a??/) , ['a'] , 'Array#split | complex regex splitting | a | /a??/');
  //equal('ab'.split(/-/) , ['ab'] , 'Array#split | complex regex splitting | ab | /-/');
  //equal('ab'.split(/-?/) , ['a', 'b'] , 'Array#split | complex regex splitting | ab | /-?/');
  //equal('ab'.split(/-??/) , ['a', 'b'] , 'Array#split | complex regex splitting | ab | /-??/');
  //equal('a-b'.split(/-/) , ['a', 'b'] , 'Array#split | complex regex splitting | a-b | /-/');
  //equal('a-b'.split(/-?/) , ['a', 'b'] , 'Array#split | complex regex splitting | a-b | /-?/');
  //equal('a-b'.split(/-??/) , ['a', '-', 'b'] , 'Array#split | complex regex splitting | a-b | /-??/');
  //equal('a--b'.split(/-/) , ['a', '', 'b'] , 'Array#split | complex regex splitting | a--b | /-/');
  //equal('a--b'.split(/-?/) , ['a', '', 'b'] , 'Array#split | complex regex splitting | a--b | /-?/');
  //equal('a--b'.split(/-??/) , ['a', '-', '-', 'b'] , 'Array#split | complex regex splitting | a--b | /-??/');
  //equal(''.split(/()()/) , [] , 'Array#split | complex regex splitting | empty string | /()()/');
  //equal('.'.split(/()()/) , ['.'] , 'Array#split | complex regex splitting | . | /()()/');
  //equal('.'.split(/(.?)(.?)/) , ['', '.', '', ''] , 'Array#split | complex regex splitting | . | /(.?)(.?)/');
  //equal('.'.split(/(.??)(.??)/) , ['.'] , 'Array#split | complex regex splitting | . | /(.??)(.??)/');
  //equal('.'.split(/(.)?(.)?/) , ['', '.', undefined, ''] , 'Array#split | complex regex splitting | . | /(.)?(.)?/');
  //equal('tesst'.split(/(s)*/) , ['t', undefined, 'e', 's', 't'] , 'Array#split | complex regex splitting | tesst | /(s)*/');
  //equal('tesst'.split(/(s)*?/) , ['t', undefined, 'e', undefined, 's', undefined, 's', undefined, 't'] , 'Array#split | complex regex splitting | tesst | /(s)*?/');
  //equal('tesst'.split(/(s*)/) , ['t', '', 'e', 'ss', 't'] , 'Array#split | complex regex splitting | tesst | /(s*)/');
  //equal('tesst'.split(/(s*?)/) , ['t', '', 'e', '', 's', '', 's', '', 't'] , 'Array#split | complex regex splitting | tesst | /(s*?)/');
  //equal('tesst'.split(/(?:s)*/) , ['t', 'e', 't'] , 'Array#split | complex regex splitting | tesst | /(?:s)*/');
  //equal('tesst'.split(/(?=s+)/) , ['te', 's', 'st'] , 'Array#split | complex regex splitting | tesst | /(?=s+)/');
  //equal('test'.split('t') , ['', 'es', ''] , 'Array#split | complex regex splitting | test | t');
  //equal('test'.split('es') , ['t', 't'] , 'Array#split | complex regex splitting | test | es');
  //equal('test'.split(/t/) , ['', 'es', ''] , 'Array#split | complex regex splitting | test | /t/');
  //equal('test'.split(/es/) , ['t', 't'] , 'Array#split | complex regex splitting | test | /es/');
  //equal('test'.split(/(t)/) , ['', 't', 'es', 't', ''] , 'Array#split | complex regex splitting | test | /(t)/');
  //equal('test'.split(/(es)/) , ['t', 'es', 't'] , 'Array#split | complex regex splitting | test | /(es)/');
  //equal('test'.split(/(t)(e)(s)(t)/) , ['', 't', 'e', 's', 't', ''] , 'Array#split | complex regex splitting | test | /(t)(e)(s)(t)/');
  //equal('.'.split(/(((.((.??)))))/) , ['', '.', '.', '.', '', '', ''] , 'Array#split | complex regex splitting | . | /(((.((.??)))))/');
  //equal('.'.split(/(((((.??)))))/) , ['.'] , 'Array#split | complex regex splitting | . | /(((((.??)))))/');


  /*
   * Patching the String#match method broke Prototype in IE in a very specific way:
   *
   *  var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
   *    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
   *    .replace(/\s+/g, '').split(',');
   *
   * Very unlikely that this would cause problems but after much debate I've decided not to
   * patch the method, as it's simply too far-reaching with too few benefits, and too few unit tests
   * to justify it. Will reconsider if the demand arises.
   *
   var match = 'on'.match(/on(e)?/);
   equal(match[1], undefined, 'String#match | capturing group should be undefined');

   var match = 'on'.match(/\b/g);
   equal(match[0], '', 'String#match | first match should be empty string');
   equal(match[1], '', 'String#match | second match should be empty string');
   */

  var str = 'Gotta be an entire sentence.';

  equal(str.truncate(29), 'Gotta be an entire sentence.', 'String#truncate | no arguments | 29');
  equal(str.truncate(28), 'Gotta be an entire sentence.', 'String#truncate | no arguments | 28');
  equal(str.truncate(21), 'Gotta be an entire se...', 'String#truncate | split words | 21');
  equal(str.truncate(20), 'Gotta be an entire s...', 'String#truncate | split words | 20');
  equal(str.truncate(14), 'Gotta be an en...', 'String#truncate | split words | 14');
  equal(str.truncate(13), 'Gotta be an e...', 'String#truncate | split words | 13');
  equal(str.truncate(11), 'Gotta be an...', 'String#truncate | split words | 11');
  equal(str.truncate(10), 'Gotta be a...', 'String#truncate | split words | 10');
  equal(str.truncate(4), 'Gott...', 'String#truncate | split words | 4');
  equal(str.truncate(3), 'Got...', 'String#truncate | split words | 3', { prototype: '...' });
  equal(str.truncate(2), 'Go...', 'String#truncate | split words | 2', { prototype: '...' });
  equal(str.truncate(1), 'G...', 'String#truncate | split words | 1', { prototype: '...' });
  equal(str.truncate(0), '...', 'String#truncate | split words | 0', { prototype: '...' });

  equal(str.truncate(21, false), 'Gotta be an entire...', 'String#truncate | no split | 21');
  equal(str.truncate(20, false), 'Gotta be an entire...', 'String#truncate | no split | 20');
  equal(str.truncate(19, false), 'Gotta be an entire...', 'String#truncate | no split | 19');
  equal(str.truncate(18, false), 'Gotta be an entire...', 'String#truncate | no split | 18');
  equal(str.truncate(17, false), 'Gotta be an...', 'String#truncate | no split | 17');
  equal(str.truncate(14, false), 'Gotta be an...', 'String#truncate | no split | 14');
  equal(str.truncate(13, false), 'Gotta be an...', 'String#truncate | no split | 13', { prototype: 'Gotta be a...' });
  equal(str.truncate(11, false), 'Gotta be an...', 'String#truncate | no split | 11');
  equal(str.truncate(10, false), 'Gotta be...', 'String#truncate | no split | 10', { prototype: 'Gotta b...' });
  equal(str.truncate(4, false), 'Gott...', 'String#truncate | no split | 4', { prototype: 'G...' });
  equal(str.truncate(3, false), 'Got...', 'String#truncate | no split | 3', { prototype: '...' });
  equal(str.truncate(2, false), 'Go...', 'String#truncate | no split | 2', { prototype: '...' });
  equal(str.truncate(1, false), 'G...', 'String#truncate | no split | 1', { prototype: '...' });
  equal(str.truncate(0, false), '...', 'String#truncate | no split | 0', { prototype: '...' });

  equal('GOTTA BE AN ENTIRE SENTENCE.'.truncate(21, false), 'GOTTA BE AN ENTIRE...', 'String#truncate | caps too | 21');
  equal('GOTTA BE AN ENTIRE SENTENCE.'.truncate(17, false), 'GOTTA BE AN...', 'String#truncate | caps too | 20', { prototype: 'GOTTA BE AN ENTIR...' });

  equal('gotta. be. an. entire. sentence.'.truncate(17, false), 'gotta. be. an....', 'String#truncate | no special punctuation treatment | 17');
  equal('too short!'.truncate(30), 'too short!', 'String#truncate | will not add ellipsis if the string is too short');
  equal('almost there'.truncate(11, false), 'almost...', 'String#truncate | will not add more than the original string', { prototype: 'almost t...' });

  equal('Gotta be an entire sentence.'.truncate(22, false, 'right', 'hooha'), 'Gotta be an entirehooha', 'String#truncate | different ellipsis', { prototype: 'Gotta be an entirhooha' });
  equal('Gotta be an entire sentence.'.truncate(22, true, 'right', 'hooha'), 'Gotta be an entire senhooha', 'String#truncate | different ellipsis');

  equal('booh pooh mooh'.truncate(7, true, 'right', 455), 'booh po455', 'String#truncate | converts numbers to strings', { prototype: '455' });

  equal('こんな　ストリングは　あまり　ない　と　思う　けど。。。'.truncate(6, false), 'こんな...', 'String#truncate | correctly finds spaces in Japanese');
  equal('한국어 도 이렇게 할 수 있어요?'.truncate(9, false), '한국어 도 이렇게...', 'String#truncate | correctly finds spaces in Korean', { prototype: '한국어 도 ...' });


  // String#truncate

  equal(str.truncate(21, true, 'middle'), 'Gotta be a...sentence.', 'String#truncate | middle | no arguments | 21');
  equal(str.truncate(11, true, 'middle'), 'Gotta...ence.', 'String#truncate | middle | no arguments | 11');
  equal(str.truncate(4, true, 'middle'), 'Go...e.', 'String#truncate | middle | no arguments | 4');
  equal(str.truncate(3, true, 'middle'), 'G....', 'String#truncate | middle | no arguments | 3');
  equal(str.truncate(2, true, 'middle'), 'G....', 'String#truncate | middle | no arguments | 2');
  equal(str.truncate(0, true, 'middle'), '...', 'String#truncate | middle | no arguments | 0');
  equal(str.truncate(-100, true, 'middle'), '...', 'String#truncate | middle | no arguments | -100');

  equal(str.truncate(21, false, 'middle'), 'Gotta be...sentence.', 'String#truncate | middle | no split | 21');
  equal(str.truncate(11, false, 'middle'), 'Gotta...ence.', 'String#truncate | middle | no split | 11');
  equal(str.truncate(4, false, 'middle'), 'Go...e.', 'String#truncate | middle | no split | 4');
  equal(str.truncate(3, false, 'middle'), 'G....', 'String#truncate | middle | no split | 3');
  equal(str.truncate(2, false, 'middle'), 'G....', 'String#truncate | middle | no split | 2');
  equal(str.truncate(0, false, 'middle'), '...', 'String#truncate | middle | no split | 0');
  equal(str.truncate(-100, false, 'middle'), '...', 'String#truncate | middle | no split | -100');

  equal(str.truncate(21, true, 'left'), '...e an entire sentence.', 'String#truncate | left | no arguments | 21');
  equal(str.truncate(11, true, 'left'), '...e sentence.', 'String#truncate | left | no arguments | 11');
  equal(str.truncate(9, true, 'left'), '...sentence.', 'String#truncate | left | no arguments | 9');
  equal(str.truncate(4, true, 'left'), '...nce.', 'String#truncate | left | no arguments | 4');
  equal(str.truncate(3, true, 'left'), '...ce.', 'String#truncate | left | no arguments | 3');
  equal(str.truncate(2, true, 'left'), '...e.', 'String#truncate | left | no arguments | 2');
  equal(str.truncate(0, true, 'left'), '...', 'String#truncate | left | no arguments | 0');
  equal(str.truncate(-100, true, 'left'), '...', 'String#truncate | left | no arguments | -100');

  equal(str.truncate(21, false, 'left'), '...an entire sentence.', 'String#truncate | left | no split | 21');
  equal(str.truncate(11, false, 'left'), '...sentence.', 'String#truncate | left | no split | 11');
  equal(str.truncate(9, false, 'left'), '...sentence.', 'String#truncate | left | no split | 9');
  equal(str.truncate(4, false, 'left'), '...nce.', 'String#truncate | left | no split | 4');
  equal(str.truncate(3, false, 'left'), '...ce.', 'String#truncate | left | no split | 3');
  equal(str.truncate(2, false, 'left'), '...e.', 'String#truncate | left | no split | 2');
  equal(str.truncate(0, false, 'left'), '...', 'String#truncate | left | no split | 0');
  equal(str.truncate(-100, false, 'left'), '...', 'String#truncate | left | no split | -100');


  equal('123456'.truncate(2, false, 'left'), '...56', 'String#truncate | splitter not included left | 2');
  equal('123456'.truncate(2, false, 'middle'), '1...6', 'String#truncate | splitter not included center | 2');
  equal('123456'.truncate(2, false), '12...', 'String#truncate | splitter not included right | 2');

  equal(str.truncate(28, true, 'left', '>>> '), 'Gotta be an entire sentence.', 'String#truncate | custom [splitter] | 28');
  equal(str.truncate(23, true, 'left', '>>> '), '>>>  be an entire sentence.', 'String#truncate | custom [splitter] | 23');
  equal(str.truncate(5, true, 'left', '>>> '), '>>> ence.', 'String#truncate | custom [splitter] | 5');
  equal(str.truncate(4, true, 'left', '>>> '), '>>> nce.', 'String#truncate | custom [splitter] | 4');
  equal(str.truncate(3, false, 'left', '>>> '), '>>> ce.', 'String#truncate | custom [splitter] | 4');

  equal(str.truncate(3, true, 'middle', '-'), 'G-.', 'String#truncate | custom [splitter] | 4');
  equal(str.truncate(10, false, 'right', ''), 'Gotta be', 'String#truncate | empty [splitter]  | 10');


  // String#assign

  var obj1 = { first: 'Harry' };
  var obj2 = { last: 'Potter' };

  equal('Welcome, {name}.'.assign({ name: 'program' }), 'Welcome, program.', 'String#assign | basic functionality');
  equal('Welcome, {1}.'.assign('program'), 'Welcome, program.', 'String#assign | numeric params');
  equal('Welcome, {1}.'.assign({ name: 'program' }), 'Welcome, {1}.', 'String#assign | numeric params will be untouched if object passed');
  equal('Welcome, {name}. You are {age} years old and have {points} points left.'.assign({ name: 'program', age: 21, points: 345 }), 'Welcome, program. You are 21 years old and have 345 points left.', 'String#assign | 1 hash');
  equal('Welcome, {1}. You are {2} years old and have {3} points left.'.assign('program', 21, 345), 'Welcome, program. You are 21 years old and have 345 points left.', 'String#assign | 3 arguments');
  equal('Welcome, {name}. You are {age} years old and have {3} points left.'.assign({ name: 'program' }, { age: 21 }, 345), 'Welcome, program. You are 21 years old and have 345 points left.', 'String#assign | complex');

  equal('Hello, {first} {last}'.assign(obj1, obj2), 'Hello, Harry Potter', 'String#assign | passing 2 objects');
  equal(obj1.first, 'Harry', 'String#assign | obj1 retains its properties');
  equal(obj1.last, undefined, 'String#assign | obj1 is untampered');
  equal(obj2.last, 'Potter', 'String#assign | obj2 retains its properties');
  equal(obj2.first, undefined, 'String#assign | obj2 is untampered');

  equal('Hello, {1}'.assign(''), 'Hello, ', 'String#assign | empty string as argument');
  equal('Hello, {empty}'.assign({ empty: '' }), 'Hello, ', 'String#assign | empty string as object');

  equal('{{1} {2}}'.assign(5,6), '{5 6}', 'String#assign | nested braces');
  equal('{one {1} {2} two}'.assign(5,6), '{one 5 6 two}', 'String#assign | nested braces with strings outside');



});
