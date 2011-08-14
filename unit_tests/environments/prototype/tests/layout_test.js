function isDisplayed(element) {
  var originalElement = element;
  
  while (element && element.parentNode) {
    var display = element.getStyle('display');
    if (display === 'none') {
      return false;
    }
    element = $(element.parentNode);
  }    
  return true;
}

new Test.Unit.Runner({
  'test preCompute argument of layout': function() {
    var preComputedLayout = $('box1').getLayout(true),
        normalLayout = $('box1').getLayout();
    
    // restore normal get method from Hash object
    preComputedLayout.get = Hash.prototype.get;
    
    Element.Layout.PROPERTIES.each(function(key) {
      this.assertEqual(normalLayout.get(key), preComputedLayout.get(key), key);
    }, this);
  },
  'test layout on absolutely-positioned elements': function() {
    var layout = $('box1').getLayout();
    
    this.assertEqual(242, layout.get('width'),  'width' );
    this.assertEqual(555, layout.get('height'), 'height');
    
    this.assertEqual(3, layout.get('border-left'), 'border-left');    
    this.assertEqual(10, layout.get('padding-top'), 'padding-top');
    this.assertEqual(1020, layout.get('top'), 'top');
    
    this.assertEqual(25, layout.get('left'), 'left');  
  },
  
  'test layout on elements with display: none and exact width': function() {
    var layout = $('box2').getLayout();
    
    this.assert(!isDisplayed($('box2')), 'box should be hidden');

    this.assertEqual(500, layout.get('width'),            'width');
    this.assertEqual(  3, layout.get('border-right'),     'border-right');
    this.assertEqual( 10, layout.get('padding-bottom'),   'padding-bottom');    
    this.assertEqual(526, layout.get('border-box-width'), 'border-box-width');

    this.assert(!isDisplayed($('box2')), 'box should still be hidden');
  },
  
  'test layout on elements with negative margins': function() {
    var layout = $('box_with_negative_margins').getLayout();

    this.assertEqual(-10, layout.get('margin-top')  );
    this.assertEqual( -3, layout.get('margin-left') );
    this.assertEqual(  2, layout.get('margin-right'));
  },
  
  'test layout on elements with display: none and width: auto': function() {
    var layout = $('box3').getLayout();
    
    this.assert(!isDisplayed($('box3')), 'box should be hidden');
    
    this.assertEqual(364, layout.get('width'),            'width');
    this.assertEqual(400, layout.get('margin-box-width'), 'margin-box-width');
    this.assertEqual(390, layout.get('border-box-width'), 'border-box-width');
    this.assertEqual(3,   layout.get('border-right'),     'border-top');
    this.assertEqual(10,  layout.get('padding-bottom'),   'padding-right');

    // Ensure that we cleaned up after ourselves.
    this.assert(!isDisplayed($('box3')), 'box should still be hidden');
  },
  
  'test layout on elements with display: none ancestors': function() {
    var layout = $('box4').getLayout();
    
    this.assert(!isDisplayed($('box4')), 'box should be hidden');
    
    // Width and height values are nonsensical for deeply-hidden elements.
    this.assertEqual(0, layout.get('width'), 'width of a deeply-hidden element should be 0');
    this.assertEqual(0, layout.get('margin-box-height'), 'height of a deeply-hidden element should be 0');
    
    // But we can still get meaningful values for other measurements.
    this.assertEqual(0, layout.get('border-right'), 'border-top');
    this.assertEqual(13, layout.get('padding-bottom'), 'padding-right');
    
    // Ensure that we cleaned up after ourselves.
    this.assert(!isDisplayed($('box4')), 'box should still be hidden');
  },
  
  'test positioning on absolutely-positioned elements': function() {
    var layout = $('box5').getLayout();
    
    this.assertEqual(30, layout.get('top'), 'top');
    this.assertEqual(60, layout.get('right'), 'right (percentage value)');
    
    this.assertEqual(340, layout.get('left'), 'left');
  },
  
  'test positioning on absolutely-positioned element with top=0 and left=0': function() {
    var layout = $('box6').getLayout();
    
    this.assertEqual(0, layout.get('top'), 'top');
    this.assertIdentical($('box6_parent'), $('box6').getOffsetParent());
  },
  
  'test layout on statically-positioned element with percentage width': function() {
    var layout = $('box7').getLayout();
    
    this.assertEqual(150, layout.get('width'));
  },

  'test layout on absolutely-positioned element with percentage width': function() {
    var layout = $('box8').getLayout();
    
    this.assertEqual(150, layout.get('width'));
  },
  
  'test layout on fixed-position element with percentage width': function() {
    var viewportWidth = document.viewport.getWidth();
    var layout = $('box9').getLayout();
    
    function assertNear(v1, v2, message) {
      var abs = Math.abs(v1 - v2);
      this.assert(abs <= 1, message + ' (actual: ' + v1 + ', ' + v2 + ')');
    }
    
    // With percentage widths, we'll occasionally run into rounding
    // discrepancies. Assert that the values agree to within 1 pixel.
    var vWidth = viewportWidth / 4, eWidth = $('box9').measure('width');
    assertNear.call(this, vWidth, eWidth, 'width (visible)');
            
    $('box9').hide();    
    assertNear.call(this, vWidth, $('box9').measure('width'), 'width (hidden)');    
  },
  
  'test #toCSS, #toObject, #toHash': function() {
    var layout = $('box6').getLayout();
    var top = layout.get('top');
    
    var cssObject = layout.toCSS('top');

    this.assert('top' in cssObject,
     "layout object should have 'top' property");
     
    cssObject = layout.toCSS('top left bottom');
    
    $w('top left bottom').each( function(prop) {
      this.assert(prop in cssObject, "layout object should have '" + 
       prop + "' property");
    }, this);
    
    var obj = layout.toObject('top');
    this.assert('top' in obj,
     "object should have 'top' property");
  },

  'test dimensions on absolutely-positioned, hidden elements': function() {
    var layout = $('box10').getLayout();
    
    this.assertEqual(278, layout.get('width'),  'width' );
    this.assertEqual(591, layout.get('height'), 'height');
  }
});
