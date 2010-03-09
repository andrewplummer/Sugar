/*
Copyright (c) 2007, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
*/
YAHOO.util.Color=function(){var HCHARS="0123456789ABCDEF",lang=YAHOO.lang;return{real2dec:function(n){return Math.min(255,Math.round(n*256));},hsv2rgb:function(h,s,v){if(lang.isArray(h)){return this.hsv2rgb.call(this,h[0],h[1],h[2]);}
var r,g,b,i,f,p,q,t;i=Math.floor((h/60)%6);f=(h/60)-i;p=v*(1-s);q=v*(1-f*s);t=v*(1-(1-f)*s);switch(i){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}
var fn=this.real2dec;return[fn(r),fn(g),fn(b)];},rgb2hsv:function(r,g,b){if(lang.isArray(r)){return this.rgb2hsv.call(this,r[0],r[1],r[2]);}
r=r/255;g=g/255;b=b/255;var min,max,delta,h,s,v;min=Math.min(Math.min(r,g),b);max=Math.max(Math.max(r,g),b);delta=max-min;switch(max){case min:h=0;break;case r:h=60*(g-b)/delta;if(g<b){h+=360;}
break;case g:h=(60*(b-r)/delta)+120;break;case b:h=(60*(r-g)/delta)+240;break;}
s=(max===0)?0:1-(min/max);var hsv=[Math.round(h),s,max];return hsv;},rgb2hex:function(r,g,b){if(lang.isArray(r)){return this.rgb2hex.call(this,r[0],r[1],r[2]);}
var f=this.dec2hex;return f(r)+f(g)+f(b);},dec2hex:function(n){n=parseInt(n,10);n=(lang.isNumber(n))?n:0;n=(n>255||n<0)?0:n;return HCHARS.charAt((n-n%16)/16)+HCHARS.charAt(n%16);},hex2dec:function(str){var f=function(c){return HCHARS.indexOf(c.toUpperCase());};var s=str.split('');return((f(s[0])*16)+f(s[1]));},hex2rgb:function(s){var f=this.hex2dec;return[f(s.substr(0,2)),f(s.substr(2,2)),f(s.substr(4,2))];},websafe:function(r,g,b){if(lang.isArray(r)){return this.websafe.call(this,r[0],r[1],r[2]);}
var f=function(v){if(lang.isNumber(v)){v=Math.min(Math.max(0,v),255);var i,next;for(i=0;i<256;i=i+51){next=i+51;if(v>=i&&v<=next){return(v-i>25)?next:i;}}
YAHOO.log("Error calculating the websafe value for "+v,"warn");}
return v;};return[f(r),f(g),f(b)];}};}();
