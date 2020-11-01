'use strict';

describe('en-US', () => {

  namespace('Date', function () {

    describeStatic('create', function (create) {

      it('should parse slashes as month first', () => {
        assertDateEqual(create('08/25', 'en-US'), new Date(2020, 7, 25));
        assertDateEqual(create('8/25', 'en-US'), new Date(2020, 7, 25));
        assertDateEqual(create('08/25/1978', 'en-US'), new Date(1978, 7, 25));
        assertDateEqual(create('8/25/1978', 'en-US'), new Date(1978, 7, 25));
        assertDateEqual(create('8/25/78', 'en-US'), new Date(1978, 7, 25));
        assertDateEqual(create('08/25/78', 'en-US'), new Date(1978, 7, 25));
        assertDateEqual(create('8/25/01', 'en-US'), new Date(2001, 7, 25));
        assertDateEqual(create('8/25/49', 'en-US'), new Date(2049, 7, 25));
        assertDateEqual(create('8/25/50', 'en-US'), new Date(1950, 7, 25));
        assertDateEqual(create('01/02/03', 'en-US'), new Date(2003, 0, 2));
        assertDateEqual(create('08/25/0001', 'en-US'), new Date('0001-08-25T00:00:00'));
      });

      it('should parse 2-digit last format', () => {
        // yy-mm-dd is NOT a valid ISO 8601 representation as of 2004, hence this format will
        // revert to a little endian representation, where year truncation is allowed. See:
        // http://en.wikipedia.org/wiki/ISO_8601#Truncated_representations
        assertDateEqual(create('08-05-05'), new Date(2005, 7, 5));
      });

      it('should parse numeric month and year', () => {
        assertDateEqual(create('06-2008'), new Date(2008, 5));
        assertDateEqual(create('6-2008'), new Date(2008, 5));
      });

      it('should parse year last dash format', () => {
        assertDateEqual(create('08-25-1978'), new Date(1978, 7, 25));
        assertDateEqual(create('8-25-1978'), new Date(1978, 7, 25));
      });

      it('should parse dot format', () => {
        assertDateEqual(create('08.25.1978'), new Date(1978, 7, 25));
        assertDateEqual(create('8.25.1978'), new Date(1978, 7, 25));
      });

    });

  });

});
