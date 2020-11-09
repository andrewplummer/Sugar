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

    });

  });
});
