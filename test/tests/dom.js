namespace('Array', function () {
  'use strict';

  var tags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,datalist,dd,del,details,dfn,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,map,mark,menu,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr'.split(',');

  for (var i = 0; i < tags.length; i++) {

    var tag = tags[i];

    var el1 = document.createElement(tag);
    var el2 = document.createElement(tag);

    method('unique', function() {
      test([el1], [el1], 'DOM Elements | 1 element identical by reference');
      test([[el1]], [[el1]], 'DOM Elements | deep nested');
      test([el1,el1], [el1], 'DOM Elements | 2 elements identical by reference');
      test([el1,el1,el1], [el1], 'DOM Elements | 3 elements identical by reference');
      test([el1,el2], [el1,el2], 'DOM Elements | 2 elements different by reference');
    });


    method('subtract', function() {
      test([el1], [[el1]], [], 'DOM Elements | [a] - [a]');
      test([el1], [[el2]], [el1], 'DOM Elements | [a] - [b]');
      test([el1,el2], [[el2]], [el1], 'DOM Elements | [a,b] - [b]');
      test([el1,el2], [[el1,el2]], [], 'DOM Elements | [a,b] - [a,b]');
    });

    method('intersect', function() {
      test([el1], [[el2]], [], 'DOM Elements | [a] & [b]');
      test([el1], [[el1]], [el1], 'DOM Elements | [a] & [a]');
      test([el1,el2], [[el2]], [el2], 'DOM Elements | [a,b] & [b]');
      test([el1,el2], [[el1,el2]], [el1,el2], 'DOM Elements | [a,b] & [b]');
    });

    method('every', function() {
      test([el1,el2], [el1], false, 'DOM Elements | a in [a,b]');
      test([el1,el2], [el2], false, 'DOM Elements | b in [a,b]');
      test([el1], [el1], true, 'DOM Elements | a in [a]');
      test([el1], [el2], false, 'DOM Elements | b in [a]');
    });

  }

});

namespace('Object', function() {

  method('isObject', function() {
    if(!Sugar.Object.isObject) return;
    test(Object, [document], false, 'document does not respond to isObject');
  });

  method('clone', function() {
    if(!Sugar.Object.clone) return;

    // Issue #307  Object.clone should error when cloning unknown types.
    raisesError(function(){ run(Object, 'clone', [document.body]); }, 'raises an error if trying to clone a DOM element');
    raisesError(function(){ run(Object, 'clone', [new MouseEvent('click')]); }, 'raises an error if trying to a browser event');

  });

  method('isFunction', function() {
    if(!Sugar.Object.isFunction) return;
    test(Object, [document.createElement('embed')], false, 'not true for embed objects');
  });

  // Confirmed that these tests pass, but avoid subjecting the user
  // to external frames constantly popping up on each test run.
  xgroup('Cross Domain Access', function() {

    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = 'http://www.foo.com/';
    document.body.appendChild(iframe);
    equal(run(Object, 'isObject', [iframe.contentWindow]), false, 'Cross Domain iframe should not be a plain object');

    var win = window.open('http://foo.com/', '', 'top=0,left=0,width=0,height=0');
    equal(run(Object, 'isObject', [win]), false, 'Cross Domain Popup window should not be a plain object');
    win && win.close();

  });

});
