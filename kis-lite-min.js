(function(){if("undefined"!==typeof document.querySelector){var f,g,d,c;f=function(a){c="undefined"===typeof a?"undefined"!==typeof f.el?f.el:document.documentElement:"object"!==typeof a?g(a):a;f.prototype.el=c;var a=d(f),b;for(b in a)"object"===typeof a[b]&&(a[b].el=c);a.el=c;return a};g=function(a,b){var e;if("string"!=typeof a||"undefined"===typeof a)return a;e=null!=b&&1===b.nodeType?b:document;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);e=e.querySelectorAll(a);
return 1===e.length?e[0]:e};d=function(a){var b;if("undefined"!==typeof a){if("undefined"!==typeof Object.create)return Object.create(a);b=typeof a;if(!("object"!==b&&"function"!==b))return b=function(){},b.prototype=a,new b}};f.ext=function(a,b){b.el=c;f[a]=b};f.ext("each",function(a){if("undefined"!==typeof c.length&&c!==window)if("undefined"!==typeof Array.prototype.forEach)[].forEach.call(c,a);else{var b=c.length;if(0!==b)for(var e,d=0;d<b;d++)e=c.item(d)?c.item(d):c[d],a.call(e,e)}else a.call(c,
c)});f.type=function(a){return function(){return a&&a!==this}.call(a)?(typeof a).toLowerCase():{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};f=window.$_=window.$_||f;f.$=g}})();"undefined"===typeof window.console&&(window.console={log:function(){}});"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")});
"undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event&&(Event.prototype.preventDefault=function(){window.event.returnValue=false},Event.prototype.stopPropagation=function(){window.event.cancelBubble=true});"undefined"===typeof Array.isArray&&(Array.isArray=function(f){return Object.prototype.toString.apply(f)==="[object Array]"});
(function(){if(typeof window.XMLHttpRequest!=="undefined"){var f={_do:function(g,d,c,a,b){var e=new XMLHttpRequest;typeof c==="undefined"&&(c=function(){});b=b?"POST":"GET";g=g+(b==="GET"?"?"+this._serialize(d):"");e.open(b,g);e.onreadystatechange=function(){e.readyState===4&&(e.status===200?c.call(e.responseText,e.responseText):typeof a!=="undefined"&&a.call(e.status,e.status))};if(b==="POST"){e.setRequestHeader("Content-Type","application/x-www-form-urlencoded");e.send(this._serialize(d))}else e.send(null)},
_serialize:function(g){var d,c,a=[];for(d in g)if(g.hasOwnProperty(d)&&typeof g[d]!=="function"){c=g[d].toString();d=encodeURIComponent(d);c=encodeURIComponent(c);a.push(d+"="+c)}return a.join("&")}};$_.ext("get",function(g,d,c,a){f._do(g,d,c,a,false)});$_.ext("post",function(g,d,c,a){f._do(g,d,c,a,true)});$_.ext("sse",function(g,d){var c;if(typeof EventSource!=="undefined"){c=new EventSource(g);c.onmessage=function(a){d.call(a.data,a.data)}}})}})();
(function(){var f,g,d,c;if(typeof document.addEventListener!=="undefined"){f=function(a,b,e){typeof a.addEventListener!=="undefined"&&a.addEventListener(b,e,false)};g=function(a,b,e){typeof a.removeEventListener!=="undefined"&&a.removeEventListener(b,e,false)}}else if(typeof document.attachEvent!=="undefined"){f=function(a,b,e){function c(a){e.apply(a)}if(typeof a.attachEvent!=="undefined"){g(b,e);a.attachEvent("on"+b,c);a=a.KIS_0_6_0=a.KIS_0_6_0||{};a.listeners=a.listeners||{};a.listeners[b]=a.listeners[b]||
[];a.listeners[b].push({callback:e,_listener:c})}else console.log("Failed to _attach event:"+b+" on "+a)};g=function(a,b,e){if(typeof a.detachEvent!=="undefined"){var c=a.KIS_0_6_0;if(c&&c.listeners&&c.listeners[b])for(var d=c.listeners[b],g=d.length,f=0;f<g;f++)if(d[f].callback===e){a.detachEvent("on"+b,d[f]._listener);d.splice(f,1);d.length===0&&delete c.listeners[b];break}}}}d=function(a,b,e,c){var h,i;if(typeof a==="undefined"){console.log(arguments);console.log(b);return false}if(b.match(/^([\w\-]+)$/))c===
true?f(a,b,e):g(a,b,e);else{b=b.split(" ");i=b.length;for(h=0;h<i;h++)d(a,b[h],e,c)}};c=function(a,b,c,f){d(a,c,function(c){var e,d,g,c=c||window.event;d=$_.$(b,a);for(e in d){g=c.target||c.srcElement;if(g==d[e]){f.call(d[e],c);c.stopPropagation()}}},true)};$_.ext("event",{add:function(a,b){$_.each(function(c){d(c,a,b,true)})},remove:function(a,b){$_.each(function(c){d(c,a,b,false)})},live:function(a,b,e){c(document.documentElement,a,b,e)},delegate:function(a,b,e){$_.each(function(d){c(d,a,b,e)})}})})();
