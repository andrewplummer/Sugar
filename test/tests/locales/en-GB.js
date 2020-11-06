'use strict';

describe('en-GB', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse slashes as day first', () => {
        assertDateEqual(create('8/10/1978', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('08/10/1978', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('8/10/78', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('08/10/78', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('8/10/01', 'en-GB'), new Date(2001, 9, 8));
        assertDateEqual(create('8/10/49', 'en-GB'), new Date(2049, 9, 8));
        assertDateEqual(create('8/10/50', 'en-GB'), new Date(1950, 9, 8));
        assertDateEqual(create('15/10/2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15/10/2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('08/10', 'en-GB'), new Date(2020, 9, 8));
        assertDateEqual(create('8/10', 'en-GB'), new Date(2020, 9, 8));
        assertDateEqual(create('08/10/0001', 'en-GB'), new Date('0001-10-08T00:00:00'));
        assertDateEqual(create('01/02/03', 'en-GB'), new Date(2003, 1, 1));
        assertDateEqual(create('8/10/50', 'en-GB'), new Date(1950, 9, 8));
        assertDateEqual(create('08/25', 'en-GB'), new Date(2022, 0, 8));
      });

      it('should parse dot format', () => {
        assertDateEqual(create('08.10.1978', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('8.10.1978',  'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('1978.8.10',  'en-GB'), new Date(1978, 7, 10));
        assertDateEqual(create('10.1978',    'en-GB'), new Date(1978, 9, 1));
        assertDateEqual(create('8.10',       'en-GB'), new Date(2020, 9, 8));
      });

      it('should parse date first dash format', () => {
        assertDateEqual(create('15-10-2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15-10-2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('01-02-03', 'en-GB'), new Date(2003, 1, 1));
        assertDateEqual(create('08-05-05', 'en-GB'), new Date(2005, 4, 8));
        assertDateEqual(create('15-Oct-2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('08-10-1978', 'en-GB'), new Date(1978, 9, 8));
        assertDateEqual(create('15-Oct-2020 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
      });

      it('should parse long month format', () => {
        assertDateEqual(create('15 Oct. 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15 October, 2020', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('15 July, 2008', 'en-GB'), new Date(2008, 6, 15));
        assertDateEqual(create('15 July 2008', 'en-GB'), new Date(2008, 6, 15));
        assertDateEqual(create('March 15th', 'en-GB'), new Date(2020, 2, 15));
        assertDateEqual(create('the 15th of March', 'en-GB'), new Date(2020, 2, 15));
      });

      it('should parse all year first formats', () => {
        assertDateEqual(create('2020/10/15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020/10/15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-10-15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-10-15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
        assertDateEqual(create('2020-Oct-15', 'en-GB'), new Date(2020, 9, 15));
        assertDateEqual(create('2020-Oct-15 5:15pm', 'en-GB'), new Date(2020, 9, 15, 17, 15));
      });

      it('should parse unambiguous long month formats', () => {
        assertDateEqual(create('Mar-03', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('Mar-3', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('03-Mar', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('3-Mar', 'en-GB'), new Date(2020, 2, 3));
        assertDateEqual(create('09-May-78', 'en-GB'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978', 'en-GB'), new Date(1978, 4, 9));
        assertDateEqual(create('09-May-1978 3:45pm', 'en-GB'), new Date(1978, 4, 9, 15, 45));
      });

      it('should numeric month and year', () => {
        assertDateEqual(create('06-2008'), new Date(2008, 5));
        assertDateEqual(create('6-2008'), new Date(2008, 5));
      });
    });

  });
});

