'use strict';

describe('ja-JP', () => {

  beforeAll(() => {
    // Set system time to 2020-01-01
    setSystemTime(new Date(2020, 0));
    Intl.DateTimeFormat.mockDefaultLocale('en-US');
  });

  describeNamespace('Date', () => {

    describeStatic('create', (create) => {

      it('should parse basic dates', () => {
        assertDateEqual(create('2011年5月15日', 'ja'), new Date(2011, 4, 15));
        assertDateEqual(create('2016年2月02日', 'ja'), new Date(2016, 1, 2));
        assertDateEqual(create('2011年5月', 'ja'), new Date(2011, 4));
        assertDateEqual(create('5月15日', 'ja'), new Date(2020, 4, 15));
        assertDateEqual(create('2011年', 'ja'), new Date(2011, 0));
        assertDateEqual(create('5月', 'ja'), new Date(2020, 4));
        assertDateEqual(create('15日', 'ja'), new Date(2020, 0, 15));
        assertDateEqual(create('月曜日', 'ja'), new Date(2019, 11, 30));
        assertDateEqual(create('3時45分', 'ja'), new Date(2020, 0, 1, 3, 45));
        assertDateEqual(create('月曜日3時45分', 'ja'), new Date(2019, 11, 30, 3, 45));
      });

      it('should match implied day period', () => {
        assertDateEqual(create('午後10時', 'ja'), new Date(2020, 0, 1, 22));
      });

      it('should handle kabuki-cho', () => {
        assertDateEqual(create('29時', 'ja'), new Date(2020, 0, 2, 5));
      });

      it('should handle hanidec months ', () => {
        assertDateEqual(create('一月', 'ja'), new Date(2020, 0));
        assertDateEqual(create('二月', 'ja'), new Date(2020, 1));
        assertDateEqual(create('三月', 'ja'), new Date(2020, 2));
        assertDateEqual(create('四月', 'ja'), new Date(2020, 3));
        assertDateEqual(create('五月', 'ja'), new Date(2020, 4));
        assertDateEqual(create('六月', 'ja'), new Date(2020, 5));
        assertDateEqual(create('七月', 'ja'), new Date(2020, 6));
        assertDateEqual(create('八月', 'ja'), new Date(2020, 7));
        assertDateEqual(create('九月', 'ja'), new Date(2020, 8));
        assertDateEqual(create('十月', 'ja'), new Date(2020, 9));
        assertDateEqual(create('十一月', 'ja'), new Date(2020, 10));
        assertDateEqual(create('十二月', 'ja'), new Date(2020, 11));
      });

      it('should handle hanidec dates', () => {
        assertDateEqual(create('二十五日', 'ja'), new Date(2020, 0, 25));
      });

    });

  });
});
