(() => {

  function mockDateTimeFormat() {
    const DateTimeFormat = Intl.DateTimeFormat;

    let defaultLocale;
    let mockTimeZoneOffset;
    let mockTimeZoneNames;

    // Get and hold the internal offset in case it is mocked later.
    const internalOffset = new Date().getTimezoneOffset();

    class MockDateTimeFormat extends DateTimeFormat {

      static mockDefaultLocale(locale) {
        defaultLocale = locale;
      }

      static mockTimeZoneOffset(offset) {
        mockTimeZoneOffset = offset;
      }

      static mockTimeZoneNames(set) {
        mockTimeZoneNames = set;
      }

      constructor(locale, options) {
        super(locale || defaultLocale, options);
      }

      formatToParts(date) {
        const options = this.resolvedOptions();
        if ('timeZone' in options && mockTimeZoneOffset != null) {
          let time = date ? date.getTime() : Date.now();
          time -= (internalOffset - mockTimeZoneOffset) * 60 * 1000;
          date = new Date(time);
        }
        let parts = super.formatToParts(date);
        if ('timeZoneName' in options && mockTimeZoneNames) {
          const style = options.timeZoneName;
          parts = parts.map((part) => {
            let { type, value } = part;
            if (type === 'timeZoneName') {
              value = mockTimeZoneNames[style];
              part = {
                type,
                value,
              }
            }
            return part;
          });
        }
        return parts;
      }

    }

    Intl.DateTimeFormat = MockDateTimeFormat;
  }

  mockDateTimeFormat();
})();
