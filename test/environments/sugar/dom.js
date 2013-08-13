
test('DOM', function () {

  // Can convert special host objects if they exist.
  if(document.body.classList) {
    document.body.className += ' woot';
    equal(Array.create(document.body.classList).any('woot'), true, 'Array.create | handles array-like objects');
  }

  var tags = 'a,abbr,acronym,address,applet,area,article,aside,audio,b,base,basefont,bdi,bdo,big,blockquote,body,br,button,canvas,caption,center,cite,code,col,colgroup,command,datalist,dd,del,details,dfn,dir,div,dl,dt,em,embed,fieldset,figcaption,figure,font,footer,form,frame,frameset,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,map,mark,menu,meta,meter,nav,noframes,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,small,source,span,strike,strong,style,sub,summary,sup,table,tbody,td,textarea,tfoot,th,thead,time,title,tr,track,tt,u,ul,var,video,wbr'.split(',');

  tags.forEach(function(tag) {

    var el1 = document.createElement(tag);
    var el2 = document.createElement(tag);

    equal([el1].unique(), [el1], 'Array#unique | DOM Elements | 1 element identical by reference');
    equal([el1,el1].unique(), [el1], 'Array#unique | DOM Elements | 2 elements identical by reference');
    equal([el1,el1,el1].unique(), [el1], 'Array#unique | DOM Elements | 3 elements identical by reference');

    equal([el1,el2].unique(), [el1,el2], 'Array#unique | DOM Elements | 2 elements different by reference');

    equal([el1].subtract([el1]), [], 'Array#subtract | DOM Elements | [a] - [a]');
    equal([el1].subtract([el2]), [el1], 'Array#subtract | DOM Elements | [a] - [b]');
    equal([el1,el2].subtract([el2]), [el1], 'Array#subtract | DOM Elements | [a,b] - [b]');
    equal([el1,el2].subtract([el1,el2]), [], 'Array#subtract | DOM Elements | [a,b] - [a,b]');

    equal([el1].intersect([el2]), [], 'Array#intersect | DOM Elements | [a] & [b]');
    equal([el1].intersect([el1]), [el1], 'Array#intersect | DOM Elements | [a] & [a]');
    equal([el1,el2].intersect([el2]), [el2], 'Array#intersect | DOM Elements | [a,b] & [b]');
    equal([el1,el2].intersect([el1,el2]), [el1,el2], 'Array#intersect | DOM Elements | [a,b] & [b]');

    equal([el1,el2].any(el1), true, 'Array#any | DOM Elements | a in [a,b]');
    equal([el1,el2].any(el2), true, 'Array#any | DOM Elements | b in [a,b]');
    equal([el1].any(el1), true, 'Array#any | DOM Elements | a in [a]');
    equal([el1].any(el2), false, 'Array#any | DOM Elements | b in [a]');

    equal([el1,el2].every(el1), false, 'Array#every | DOM Elements | a in [a,b]');
    equal([el1,el2].every(el2), false, 'Array#every | DOM Elements | b in [a,b]');
    equal([el1].every(el1), true, 'Array#every | DOM Elements | a in [a]');
    equal([el1].every(el2), false, 'Array#every | DOM Elements | b in [a]');

  });

  if(Object.isObject) {
    equal(Object.isObject(document), false, 'Object.isObject | document');
  }

  if(Object.clone) {
    // Issue #307  Object.clone should error when cloning unknown types.
    raisesError(function(){ Object.clone(document.body); }, 'Object.clone | raises an error if trying to clone a DOM element');
    raisesError(function(){ Object.clone(new MouseEvent('click')); }, 'Object.clone | raises an error if trying to a browser event');
  }

  if(Object.isFunction) {
    equal(Object.isFunction(document.createElement('embed')), false, 'Object.isFunction | not true for embed objects');
  }



});
