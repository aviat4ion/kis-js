(function(){if("undefined"!==typeof document.querySelector){var e,f,d,c;e=function(a){c="undefined"===typeof a?"undefined"!==typeof e.el?e.el:document.documentElement:"object"!==typeof a?f(a):a;e.prototype.el=c;var a=d(e),b;for(b in a)if("object"===typeof a[b])a[b].el=c;a.el=c;return a};f=function(a,b){var g;if("string"!=typeof a||"undefined"===typeof a)return a;g=null!=b&&1===b.nodeType?b:document;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);g=g.querySelectorAll(a);
return 1===g.length?g[0]:g};d=function(a){var b;if("undefined"!==typeof a){if("undefined"!==typeof Object.create)return Object.create(a);b=typeof a;if(!("object"!==b&&"function"!==b))return b=function(){},b.prototype=a,new b}};e.ext=function(a,b){b.el=c;e[a]=b};e.ext("each",function(a){if("undefined"!==typeof c.length&&c!==window){var b=c.length;if(0!==b)for(var g,d=0;d<b;d++)g=c.item(d)?c.item(d):c[d],a.call(g,g)}else a.call(c,c)});e.type=function(a){return function(){return a&&a!==this}.call(a)?
(typeof a).toLowerCase():{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};e=window.$_=window.$_||e;e.$=f}})();
(function(){if("undefined"===typeof window.console)window.console={log:function(){}};if("undefined"===typeof String.prototype.trim)String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")};if("undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event)Event.prototype.preventDefault=function(){window.event.stop()},Event.prototype.stopPropagation=function(){window.event.returnValue=!1}})();
(function(){if("undefined"!==typeof window.XMLHttpRequest){var e={_do:function(f,d,c,a){var b=new XMLHttpRequest;"undefined"===typeof c&&(c=function(){});a=a?"POST":"GET";f+="GET"===a?"?"+this._serialize(d):"";b.open(a,f);b.onreadystatechange=function(){4===b.readyState&&c(b.responseText)};"POST"===a?(b.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),b.send(this._serialize(d))):b.send(null)},_serialize:function(f){var d,c,a=[];for(d in f)f.hasOwnProperty(d)&&"function"!==typeof f[d]&&
(c=f[d].toString(),d=encodeURIComponent(d),c=encodeURIComponent(c),a.push(d+"="+c));return a.join("&")}};$_.ext("get",function(f,d,c){e._do(f,d,c,!1)});$_.ext("post",function(f,d,c){e._do(f,d,c,!0)})}})();
(function(){var e,f,d,c;"undefined"!==typeof document.addEventListener?(e=function(a,b,g){"undefined"!==typeof a.addEventListener&&a.addEventListener(b,g,!1)},f=function(a,b,g){"undefined"!==typeof a.removeEventListener&&a.removeEventListener(b,g,!1)}):"undefined"!==typeof document.attachEvent&&(e=function(a,b,g){var h;function c(a){g.apply(a)}"undefined"!==typeof a.attachEvent?(f(b,g),a.attachEvent("on"+b,c),h=a.KIS_0_5_0=a.KIS_0_5_0||{},a=h,a.listeners=a.listeners||{},a.listeners[b]=a.listeners[b]||
[],a.listeners[b].push({callback:g,_listener:c})):console.log("Failed to _attach event:"+b+" on "+a)},f=function(a,b,g){if("undefined"!==typeof a.detachEvent){var c=a.KIS_0_5_0;if(c&&c.listeners&&c.listeners[b])for(var d=c.listeners[b],f=d.length,e=0;e<f;e++)if(d[e].callback===g){a.detachEvent("on"+b,d[e]._listener);d.splice(e,1);0===d.length&&delete c.listeners[b];break}}});d=function(a,b,c,i){var h,j;if("undefined"===typeof a)return console.log(arguments),console.log(b),!1;if(b.match(/^([\w\-]+)$/))!0===
i?e(a,b,c):f(a,b,c);else{b=b.split(" ");j=b.length;for(h=0;h<j;h++)d(a,b[h],c,i)}};c=function(a,b,c,e){d(a,c,function(a){var c,d,g,a=a||window.event;d=$_.$(b);for(c in d)g=a.target||a.srcElement,g==d[c]&&(e.call(d[c],a),a.stopPropagation())},!0)};$_.ext("event",{add:function(a,b){$_.each(function(c){d(c,a,b,!0)})},remove:function(a,b){$_.each(function(c){d(c,a,b,!1)})},live:function(a,b,d){c(document.documentElement,a,b,d)},delegate:function(a,b,d){$_.each(function(e){c(e,a,b,d)})}})})();
