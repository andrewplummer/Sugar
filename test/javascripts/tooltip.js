(function($){

  var tooltip;
  var arrow;
  var arrowWidth;
  var arrowHeight;
  var content;
  var win;

  function getState(el, options){
    var s = {};
    var elementHeight = el.outerHeight();
    var elementWidth  = el.outerWidth();
    var offset = el.offset();
    s.height = tooltip.outerHeight(true);
    s.width  = tooltip.outerWidth(true);
    s.offset = {};
    s.offset.top = offset.top;
    s.offset.left = offset.left;
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

  function checkBounds(s, direction, margin){
    var bound, alternate;
    margin = parseInt(margin);
    switch(direction){
      case 'top':
        bound = win.scrollTop();
        if(s.offset.top - s.height < bound) alternate = 'bottom';
        s.on.top  = s.offset.top - s.height - margin;
        s.off.top = s.on.top + 15;
        s.css.top = s.on.top - 15;
        s.css.left = getCenter(s, true);
        break;
      case 'left':
        bound = win.scrollLeft();
        if(s.offset.left - s.width < bound) alternate = 'right';
        s.on.left  = s.offset.left - s.width - margin;
        s.off.left = s.on.left + 15;
        s.css.top  = getCenter(s, false);
        s.css.left = s.on.left - 15;
        break;
      case 'bottom':
        bound = win.scrollTop() + win.height();
        if(s.offset.bottom + s.height > bound) alternate = 'top';
        s.on.top   = s.offset.bottom + margin;
        s.off.top  = s.offset.bottom - 15 + margin;
        s.css.top  = s.on.top + 15;
        s.css.left = getCenter(s, true);
        break;
      case 'right':
        bound = win.scrollLeft() + win.width();
        if(s.offset.right + s.width > bound) alternate = 'left';
        s.on.left  = s.offset.right + margin;
        s.off.left = s.on.left - 15;
        s.css.left = s.on.left + 15;
        s.css.top = getCenter(s, false);
        break;
    }
    if(alternate && !s.over){
      s.over = true;
      checkBounds(s, alternate, margin);
    } else {
      s.direction = direction;
      getArrowOffset(s, direction);
      checkSlide(s, direction);
    }
  }

  function checkSlide(s, dir){
    var offset;
    if(dir == 'top' || dir == 'bottom') {
      offset = win.scrollLeft() - s.css.left + 5;
      if(offset > 0){
        s.css.left += Math.abs(offset);
        s.arrow.left -= offset;
      }
      offset = (s.css.left + s.width) - (win.scrollLeft() + win.width()) + 5;
      if(offset > 0){
        s.css.left -= Math.abs(offset);
        s.arrow.left += offset;
      }
    } else if(dir == 'left' || dir == 'right') {
      offset = win.scrollTop() - s.css.top + 5;
      if(offset > 0){
        s.css.top += Math.abs(offset);
        s.arrow.top -= offset;
      }
      offset = (s.css.top + s.height) - (win.scrollTop() + win.height()) + 5;
      if(offset > 0){
        s.css.top -= Math.abs(offset);
        s.arrow.top += offset;
      }
    }
  }

  function getArrowOffset(s, dir){
    if(dir == 'left' || dir == 'right'){
      s.arrow.top = Math.floor((s.height / 2) - (arrowHeight / 2));
    } else {
      s.arrow.left = Math.floor((s.width / 2) - (arrowWidth / 2));
    }
    s.arrow[getInverseDirection(dir)] = -arrowHeight;
  }

  function getInverseDirection(dir){
    switch(dir){
      case 'top':    return 'bottom';
      case 'bottom': return 'top';
      case 'left':   return 'right';
      case 'right':  return 'left';
    }
  }

  function getCenter(s, horizontal){
    if(horizontal){
      return s.offset.hCenter + (-s.width / 2);
    } else {
      return s.offset.vCenter + (-s.height / 2);
    }
  }

  function animateTooltip(s, options, el, fn){
    var color = getDefault('color', options, el, 'white');
    var duration = getDefault('duration', options, el, 250);
    tooltip.attr('class', color + ' ' + s.direction);
    tooltip.stop(true, true).css(s.css);
    arrow.attr('style', '').css(s.arrow);
    tooltip.animate(s.on, {
      duration: duration,
      queue: false,
      complete: fn
    });
    tooltip.fadeIn(duration);
  }

  function animateTooltipOut(s, options, el, fn){
    var duration = getDefault('duration', options, el, 250);
    tooltip.animate(s.off, {
      duration: duration,
      queue: false,
      complete: fn
    });
    tooltip.fadeOut(duration);
  }

  function setContent(el, title) {
    var html;
    try {
      var ref = $(title);
    } catch(e){
      // May throw a malfolmed selector error
    }
    if(ref && ref.length > 0) {
      html = ref.html();
    } else {
      html = title;
    }
    content.html(html);
  }

  function getDefault(name, options, el, defaultValue) {
    return options[name] || el.data('tooltip-'+name) || defaultValue;
  }

  jQuery.fn.tooltip = function(options){
    options = options || {};
    this.each(function(){
      var el = $(this);
      var title = el.attr('title');
      if(!title) return;
      var animating = false;
      var state;
      el.unbind('mouseenter').mouseenter(function(){
        var margin    = getDefault('margin', options, el, 20);
        var direction = getDefault('direction', options, el, 'top');
        var t = el.attr('title');
        if(t) {
          title = t;
        }
        el.removeAttr('title');
        setContent(el, title);
        state = getState(el, options);
        checkBounds(state, direction, margin);
        animateTooltip(state, options, el, function(){
          animating = false;
        });
        animating = true;
      });
      el.unbind('mouseleave').mouseleave(function(){
        if(animating){
          tooltip.fadeOut(100);
          return;
        }
        animateTooltipOut(state, options, el);
      });
    });
  };

  $(document).ready(function(){
    tooltip = $('<div id="tooltip" />').appendTo(document.body).css('position', 'absolute').hide();
    arrow   = $('<div class="arrow" />').appendTo(tooltip);
    content = $('<div class="content" />').appendTo(tooltip);
    win     = $(window);
    arrowWidth = arrow.width();
    arrowHeight = arrow.height();
    $('[title]').tooltip();
  });

})(jQuery);
