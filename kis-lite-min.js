(function(){if("undefined"!==typeof document.querySelector){var f,d,e,c;f=function(a){c="undefined"===typeof a?"undefined"!==typeof f.el?f.el:document.documentElement:"object"!==typeof a?d(a):a;f.prototype.el=c;var a=e(f),b;for(b in a)"object"===typeof a[b]&&(a[b].el=c);a.el=c;return a};d=function(a,b){var g;if("string"!=typeof a||"undefined"===typeof a)return a;g=null!=b&&1===b.nodeType?b:document;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);g=g.querySelectorAll(a);
return 1===g.length?g[0]:g};e=function(a){var b;if("undefined"!==typeof a){if("undefined"!==typeof Object.create)return Object.create(a);b=typeof a;if(!("object"!==b&&"function"!==b))return b=function(){},b.prototype=a,new b}};f.ext=function(a,b){b.el=c;f[a]=b};f.ext("each",function(a){if("undefined"!==typeof c.length&&c!==window)if("undefined"!==typeof Array.prototype.forEach)[].forEach.call(c,a);else{var b=c.length;if(0!==b)for(var g,d=0;d<b;d++)g=c.item(d)?c.item(d):c[d],a.call(g,g)}else a.call(c,
c)});f.type=function(a){return function(){return a&&a!==this}.call(a)?(typeof a).toLowerCase():{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};f=window.$_=window.$_||f;f.$=d}})();
(function(){"undefined"===typeof window.console&&(window.console={log:function(){}});"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")});"undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event&&(Event.prototype.preventDefault=function(){window.event.returnValue=false},Event.prototype.stopPropagation=function(){window.event.cancelBubble=true});"undefined"===typeof[].isArray&&(Array.isArray=function(f){return Object.prototype.toString.apply(f)===
"[object Array]"})})();
(function(){if("undefined"!==typeof window.XMLHttpRequest){var f={_do:function(d,e,c,a){var b=new XMLHttpRequest;"undefined"===typeof c&&(c=function(){});a=a?"POST":"GET";d+="GET"===a?"?"+this._serialize(e):"";b.open(a,d);b.onreadystatechange=function(){4===b.readyState&&c(b.responseText)};"POST"===a?(b.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),b.send(this._serialize(e))):b.send(null)},_serialize:function(d){var e,c,a=[];for(e in d)d.hasOwnProperty(e)&&"function"!==typeof d[e]&&
(c=d[e].toString(),e=encodeURIComponent(e),c=encodeURIComponent(c),a.push(e+"="+c));return a.join("&")}};$_.ext("get",function(d,e,c){f._do(d,e,c,!1)});$_.ext("post",function(d,e,c){f._do(d,e,c,!0)});$_.ext("sse",function(d,e,c){"undefined"!==typeof EventSource?(d=new EventSource(d),d.onmessage=function(a){e(a.data)}):setInterval($_.get,c||3E4,d,{},function(a){a.trim().replace(/data:/gim,"");a.replace(/^event|id|retry?:(.*)$/gim,"");e(a)})})}})();
(function(){var f,d,e,c;"undefined"!==typeof document.addEventListener?(f=function(a,b,g){"undefined"!==typeof a.addEventListener&&a.addEventListener(b,g,!1)},d=function(a,b,g){"undefined"!==typeof a.removeEventListener&&a.removeEventListener(b,g,!1)}):"undefined"!==typeof document.attachEvent&&(f=function(a,b,g){function c(a){g.apply(a)}"undefined"!==typeof a.attachEvent?(d(b,g),a.attachEvent("on"+b,c),a=a.KIS_0_6_0=a.KIS_0_6_0||{},a.listeners=a.listeners||{},a.listeners[b]=a.listeners[b]||[],a.listeners[b].push({callback:g,
_listener:c})):console.log("Failed to _attach event:"+b+" on "+a)},d=function(a,b,c){if("undefined"!==typeof a.detachEvent){var d=a.KIS_0_6_0;if(d&&d.listeners&&d.listeners[b])for(var e=d.listeners[b],f=e.length,h=0;h<f;h++)if(e[h].callback===c){a.detachEvent("on"+b,e[h]._listener);e.splice(h,1);0===e.length&&delete d.listeners[b];break}}});e=function(a,b,c,j){var i,k;if(typeof a==="undefined"){console.log(arguments);console.log(b);return false}if(b.match(/^([\w\-]+)$/))j===true?f(a,b,c):d(a,b,c);
else{b=b.split(" ");k=b.length;for(i=0;i<k;i++)e(a,b[i],c,j)}};c=function(a,b,c,d){e(a,c,function(c){var e,g,f,c=c||window.event;g=$_.$(b,a);for(e in g){f=c.target||c.srcElement;if(f==g[e]){d.call(g[e],c);c.stopPropagation()}}},true)};$_.ext("event",{add:function(a,b){$_.each(function(c){e(c,a,b,true)})},remove:function(a,b){$_.each(function(c){e(c,a,b,false)})},live:function(a,b,d){c(document.documentElement,a,b,d)},delegate:function(a,b,d){$_.each(function(e){c(e,a,b,d)})}})})();
