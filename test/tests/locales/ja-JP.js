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

      it('should handle hanidec years ', () => {
        assertDateEqual(create('千九百三十七年', 'ja'), new Date(1937, 0));
        assertDateEqual(create('二千十三年', 'ja'), new Date(2013, 0));
        assertDateEqual(create('一九九五年', 'ja'), new Date(1995, 0));
        assertDateEqual(create('二千三年', 'ja'), new Date(2003, 0));
        assertDateEqual(create('二千年', 'ja'), new Date(2000, 0));
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
        assertDateEqual(create('一日', 'ja'), new Date(2020, 0, 1));
        assertDateEqual(create('二日', 'ja'), new Date(2020, 0, 2));
        assertDateEqual(create('三日', 'ja'), new Date(2020, 0, 3));
        assertDateEqual(create('四日', 'ja'), new Date(2020, 0, 4));
        assertDateEqual(create('五日', 'ja'), new Date(2020, 0, 5));
        assertDateEqual(create('六日', 'ja'), new Date(2020, 0, 6));
        assertDateEqual(create('七日', 'ja'), new Date(2020, 0, 7));
        assertDateEqual(create('八日', 'ja'), new Date(2020, 0, 8));
        assertDateEqual(create('九日', 'ja'), new Date(2020, 0, 9));
        assertDateEqual(create('十日', 'ja'), new Date(2020, 0, 10));
        assertDateEqual(create('十五日', 'ja'), new Date(2020, 0, 15));
        assertDateEqual(create('二十五日', 'ja'), new Date(2020, 0, 25));
      });

      it('should handle relative time', () => {
        assertDateEqual(create('一秒前', 'ja'), new Date(2019, 11, 31, 23, 59, 59));
        assertDateEqual(create('一分前', 'ja'), new Date(2019, 11, 31, 23, 59));
        assertDateEqual(create('一時間前', 'ja'), new Date(2019, 11, 31, 23));
        assertDateEqual(create('一日前', 'ja'), new Date(2019, 11, 31));
        assertDateEqual(create('一週間前', 'ja'), new Date(2019, 11, 25));
        assertDateEqual(create('一か月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('一ヶ月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('一ヵ月前', 'ja'), new Date(2019, 11));
        assertDateEqual(create('一年前', 'ja'), new Date(2019, 0));

        assertDateEqual(create('2秒前', 'ja'), new Date(2019, 11, 31, 23, 59, 58));
        assertDateEqual(create('2分前', 'ja'), new Date(2019, 11, 31, 23, 58));
        assertDateEqual(create('2時間前', 'ja'), new Date(2019, 11, 31, 22));
        assertDateEqual(create('2日前', 'ja'), new Date(2019, 11, 30));
        assertDateEqual(create('2週間前', 'ja'), new Date(2019, 11, 18));
        assertDateEqual(create('2か月前', 'ja'), new Date(2019, 10));
        assertDateEqual(create('2ヶ月前', 'ja'), new Date(2019, 10));
        assertDateEqual(create('2ヵ月前', 'ja'), new Date(2019, 10));
        assertDateEqual(create('2年前', 'ja'), new Date(2018, 0));
      });

    });

  });
});
