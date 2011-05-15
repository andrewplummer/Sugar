new Test.Unit.Runner({
  testDateToJSON: function() {
    this.assertEqual('\"1970-01-01T00:00:00Z\"', new Date(Date.UTC(1970, 0, 1)).toJSON());
  }
});