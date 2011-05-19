(function(){

  var tooltip;
  var arrow;
  var arrowWidth;
  var arrowHeight;
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
    var elementHeight = el.outerHeight(true);
    var elementWidth  = el.outerWidth(true);
    s.height = tooltip.outerHeight(true);
    s.width  = tooltip.outerWidth(true);
    s.offset = el.offset();
    s.offset.right = s.offset.left + elementWidth;
    s.offset.bottom = s.offset.top + elementHeight;
    s.offset.hCenter = s.offset.left + Math.floor(elementWidth / 2);
    s.offset.vCenter = s.offset.top + Math.floor(elementHeight / 2);
    s.css = {};
    s.on  = {};
    s.off = {};
    s.arrow = {};
    return s;
  }


  function checkBounds(s, direction){
    var bound, alternate;
    switch(direction){
      case 'top':
        bound = win.scrollTop();
        if(s.offset.top - s.height < bound) alternate = 'bottom';
        s.on.top  = s.offset.top - s.height;
        s.off.top = s.on.top + 10;
        s.css.top = s.on.top - 10;
        s.css.left = getCenter(s, true);
        break;
      case 'left':
        bound = win.scrollLeft();
        if(s.offset.left - s.width < bound) alternate = 'right';
        s.on.left  = s.offset.left - s.width;
        s.off.left = s.on.left + 10;
        s.css.top  = getCenter(s, false);
        s.css.left = s.on.left - 10;
        break;
      case 'bottom':
        bound = win.scrollTop() + win.height();
        if(s.offset.bottom + s.height > bound) alternate = 'top';
        s.on.top   = s.offset.bottom;
        s.off.top  = s.offset.bottom - 10;
        s.css.top  = s.on.top + 10;
        s.css.left = getCenter(s, true);
        break;
      case 'right':
        bound = win.scrollLeft() + win.width();
        if(s.offset.right + s.width > bound) alternate = 'left';
        s.on.left  = s.offset.right;
        s.off.left = s.on.left - 10;
        s.css.left = s.on.left + 10;
        s.css.top = getCenter(s, false);
        break;
    }
    getArrowOffset(s, direction);
    checkSlide(s, direction);
    if(alternate && !s.over){
      s.over = true;
      checkBounds(s, alternate);
    } else {
      s.direction = direction;
    }
  }

  function checkSlide(s, dir){
    var d = (dir == 'left' || dir == 'right') ? 'vertical' : 'horizontal';
    var offset;
    if(d == 'horizontal'){
      offset = win.scrollLeft() - (s.offset.left - Math.round(s.width / 2));
      if(offset > 0){
        s.css.left += Math.abs(offset);
        s.arrow.left -= offset;
      }
      offset = (s.offset.right + Math.round(s.width / 2)) - (win.scrollLeft() + win.width());
      if(offset > 0){
        s.css.left -= Math.abs(offset);
        s.arrow.left += offset;
      }
    }
  }

  function getArrowOffset(s, dir){
    if(dir == 'left' || dir == 'right'){
      s.arrow.top = Math.floor((s.height / 2) - (arrowHeight / 2));
    } else {
      s.arrow.left = Math.floor((s.width / 2) - (arrowWidth / 2));
    }
  }

  function getCenter(s, horizontal){
    if(horizontal){
      return s.offset.hCenter + - (s.width / 2);
    } else {
      return s.offset.vCenter + - (s.height / 2);
    }
  }

  function animateTooltip(s, options){
    tooltip.attr('class', s.direction);
    tooltip.stop(true, true).css(s.css);
    arrow.css(s.arrow);
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
    arrowWidth = arrow.width();
    arrowHeight = arrow.height();
    content = $('.content', tooltip);
    win     = $(window);
    $('[title]').tooltip();
  });

})();
