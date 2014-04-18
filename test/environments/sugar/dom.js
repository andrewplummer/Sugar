package('Array', function () {

  var tags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,datalist,dd,del,details,dfn,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,map,mark,menu,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr'.split(',');

  tags.forEach(function(tag) {

    var el1 = document.createElement(tag);
    var el2 = document.createElement(tag);

    method('unique', function() {
      test([el1], [el1], 'DOM Elements | 1 element identical by reference');
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

    method('any', function() {
      test([el1,el2], [el1], true, 'DOM Elements | a in [a,b]');
      test([el1,el2], [el2], true, 'DOM Elements | b in [a,b]');
      test([el1], [el1], true, 'DOM Elements | a in [a]');
      test([el1], [el2], false, 'DOM Elements | b in [a]');
    });

    method('every', function() {
      test([el1,el2], [el1], false, 'DOM Elements | a in [a,b]');
      test([el1,el2], [el2], false, 'DOM Elements | b in [a,b]');
      test([el1], [el1], true, 'DOM Elements | a in [a]');
      test([el1], [el2], false, 'DOM Elements | b in [a]');
    });

  });

  method('create', function() {
    // Can convert special host objects if they exist.
    var el = document.createElement('div');
    if(el.classList) {
      el.className = 'woot';
      test(Array, [el.classList], ['woot'], 'handles array-like objects');
    }
    if(el.children) {
      var el2 = document.createElement('div');
      el.appendChild(el2);
      test(Array, [el.children], [el2], 'DOM element');
    }
    test(Array, [el], [el], 'DOM element');
    test(Array, [[el]], [el], 'DOM element in array');
  });


});

package('Object', function() {

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

});
