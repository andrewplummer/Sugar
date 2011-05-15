(function(){

  var tooltip;
  var arrow;
  var content;
  var win;
  var timer;

  function setDefaults(options, el){
    options = options || {};
    options.margin = options.margin || 20;
    options.animateOffset = options.animateOffset || 10;
    options.direction = options.direction || el.attr('data-tooltip-direction') || tooltip.attr('data-tooltip-direction') || 'top';
    options.duration = options.duration || 250;
    return options;
  }

  function getState(el, options){
    var s = {};
    var offset = el.offset();
    s.height = tooltip.outerHeight(true);
    s.width  = tooltip.outerWidth(true);
    s.anchorHeight = el.outerHeight(true);
    s.anchorWidth  = el.outerWidth(true);
    s.top  = offset.top;
    s.left = offset.left;
    s.right = s.left + s.anchorWidth;
    s.bottom = s.top + s.anchorHeight;
    s.css = {};
    s.on  = {};
    s.off = {}
    return s;
  }


  function checkBounds(s, direction){
    var bound, alternate;
    switch(direction){
      case 'top':
        bound = win.scrollTop();
        if(s.top - s.height < bound) alternate = 'bottom';
        s.on.top  = s.top - s.height;
        s.off.top = s.on.top + 10;
        s.css.top = s.on.top - 10;
        s.css.left = getCenter(s, true);
        break;
      case 'left':
        bound = win.scrollLeft();
        if(s.left - s.width < bound) alternate = 'right';
        s.on.left  = s.left - s.width;
        s.off.left = s.on.left + 10;
        s.css.top  = getCenter(s, false);
        s.css.left = s.on.left - 10;
        break;
      case 'bottom':
        bound = win.scrollTop() + win.height();
        if(s.bottom + s.height > bound) alternate = 'top';
        s.on.top   = s.bottom;
        s.off.top  = s.bottom - 10;
        s.css.top  = s.on.top + 10;
        s.css.left = getCenter(s, true);
        break;
      case 'right':
        bound = win.scrollLeft() + win.width();
        if(s.right + s.width > bound) alternate = 'left';
        s.on.left  = s.right;
        s.off.left = s.on.left - 10;
        s.css.left = s.on.left + 10;
        s.css.top = getCenter(s, false);
        break;
    }
    if(alternate && !s.over){
      s.over = true;
      checkBounds(s, alternate);
    } else {
      s.direction = direction;
    }
  }

  function getCenter(s, horizontal){
    if(horizontal){
      return s.left + Math.round((s.anchorWidth / 2) - (s.width / 2));
    } else {
      return s.top + Math.round((s.anchorHeight / 2) - (s.height / 2));
    }
  }

  function animateTooltip(s, options){
    tooltip.attr('class', s.direction);
    tooltip.stop(true, true).css(s.css);
    tooltip.animate(s.on, { duration: options.duration, queue: false });
    tooltip.fadeIn(options.duration);
  }

  function animateTooltipOut(s, options){
    tooltip.animate(s.off, { duration: options.duration, queue: false });
    tooltip.fadeOut(options.duration);
  }

  jQuery.fn.tooltip = function(options){

    options = setDefaults(options, this);

    this.each(function(){

      var el = $(this);
      var html = el.attr('title');
      var width = el.width();
      var height = el.height();
      var state;
      el.removeAttr('title');

      el.mouseover(function(){
        content.html(html);
        state = getState(el, options);
        checkBounds(state, options.direction);
        animateTooltip(state, options);
      });

      el.mouseout(function(){
        animateTooltipOut(state, options);
      });


    });

  };

  $(document).ready(function(){
    tooltip = $('#tooltip');
    arrow   = $('.arrow', tooltip);
    content = $('.content', tooltip);
    win     = $(window);
    $('[title]').tooltip();
  });

})();
