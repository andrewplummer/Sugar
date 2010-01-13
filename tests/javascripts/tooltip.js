(function(){

  var tooltip;
  var tipInTimeout;
  var tipOutTimeout;
  var active;
  var animatedDistance = 15;

  $(document).ready(function(){
    tooltip = $('#tooltip');
  });

  $('[title]').live('mouseover', function(){
    clearTimeout(tipInTimeout);
    active = this;
    tipInTimeout = setTimeout(showTip, 50);
  });

  $('[title]').live('mouseout', function(){
    clearTimeout(tipOutTimeout);
    tipOutTimeout = setTimeout(hideTip, 50);
  });

  function showTip(){
    tooltip.html(active.title);
    tooltip.show();
    var pos = $(active).position();
    var end = pos.top - tooltip.height() - $(active).height();
    var start = end - animatedDistance;
    var left = pos.left - (tooltip.width() / 2);
    if(left < 5) left = 5;
    if(end < 5){
      end = pos.top + $(active).height() + 10; 
      start = end + animatedDistance;
    }
    pos.top = start;
    pos.left = left;
    tooltip.css(pos);
    tooltip.animate({top: end}, 100, 'swing');
  }

  function hideTip(){
  //  tooltip.hide();
  }

})();
