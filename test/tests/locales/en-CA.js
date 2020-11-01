'use strict';

describe('en-CA', () => {

  namespace('Date', function () {

    describeStatic('create', function (create) {

      it('should not parse ambiguous year last format', () => {
        // Format is ambiguous in Canada where UK style and
        // American style are mixed, so these should not be parseable.
        assertUndefined(create('01/01/2020', 'en-CA'));
        assertUndefined(create('01-01-2020', 'en-CA'));
      });

      it('should not parse ambiguous day month format', () => {
        // This should technically not be parseable as above, however unfortunately
        // American style are mixed, so these should not be parseable.
        assertUndefined(create('8/10', 'en-CA'), new Date(2020, 7, 10));
        assertUndefined(create('8-10', 'en-CA'), new Date(2020, 7, 10));
      });

      it('should parse date first dash format', () => {
        assertDateEqual(create('15-Oct-2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15-Oct-2020 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
      });

      it('should parse long month format', () => {
        assertDateEqual(create('15 Oct. 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('15 July, 2008', 'en-CA'), new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008', 'en-CA'), new Date(2008, 6, 15));
        assertDateEqual(create('March 15th', 'en-CA'), new Date(2020, 2, 15));
        assertDateEqual(create('the 15th of March', 'en-CA'), new Date(2020, 2, 15));
      });

      it('should parse all year first formats', () => {
        assertDateEqual(create('2020/10/15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020/10/15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-10-15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-10-15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-Oct-15', 'en-CA'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-Oct-15 5:15pm', 'en-CA'), new Date(2020, 9, 15, 17, 15));
      });

      it('should parse unambiguous long month formats', () => {
        assertDateEqual(create('Mar-03', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('Mar-3', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('03-Mar', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('3-Mar', 'en-CA'), new Date(2020, 2, 3));
        assertDateEqual(create('09-May-78', 'en-CA'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978', 'en-CA'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978 3:45pm', 'en-CA'), new Date(1978, 4, 9, 15, 45));
      });

      it('should numeric month and year', () => {
        assertDateEqual(create('06-2008'), new Date(2008, 5));
        assertDateEqual(create('6-2008'), new Date(2008, 5));
      });

    });

  });
});
