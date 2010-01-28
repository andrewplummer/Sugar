new Test.Unit.Runner({
  testBrowserDetection: function() {
    var results = $H(Prototype.Browser).map(function(engine){
      return engine;
    }).partition(function(engine){
      return engine[1] === true
    });
    var trues = results[0], falses = results[1];

    this.info('User agent string is: ' + navigator.userAgent);

    this.assert(trues.size() == 0 || trues.size() == 1,
      'There should be only one or no browser detected.');

    // we should have definite trues or falses here
    trues.each(function(result) {
      this.assert(result[1] === true);
    }, this);
    falses.each(function(result) {
      this.assert(result[1] === false);
    }, this);

    if(navigator.userAgent.indexOf('AppleWebKit/') > -1) {
      this.info('Running on WebKit');
      this.assert(Prototype.Browser.WebKit);
    }

    if(!!window.opera) {
      this.info('Running on Opera');
      this.assert(Prototype.Browser.Opera);
    }

    if(!!(window.attachEvent && !window.opera)) {
      this.info('Running on IE');
      this.assert(Prototype.Browser.IE);
    }

    if(navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1) {
      this.info('Running on Gecko');
      this.assert(Prototype.Browser.Gecko);
    }
  }
});