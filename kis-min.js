(function(){if("undefined"!==typeof document.querySelector){var e,n,q,f;e=function(g){f="undefined"===typeof g?"undefined"!==typeof e.el?e.el:document.documentElement:"object"!==typeof g?n(g):g;e.prototype.el=f;var g=q(e),i;for(i in g)"object"===typeof g[i]&&(g[i].el=f);g.el=f;return g};n=function(g,e){var f;if("string"!=typeof g||"undefined"===typeof g)return g;f=null!=e&&1===e.nodeType?e:document;if(g.match(/^#([\w\-]+$)/))return document.getElementById(g.split("#")[1]);f=f.querySelectorAll(g);
return 1===f.length?f[0]:f};q=function(e){var f;if("undefined"!==typeof e){if("undefined"!==typeof Object.create)return Object.create(e);f=typeof e;if(!("object"!==f&&"function"!==f))return f=function(){},f.prototype=e,new f}};e.ext=function(g,i){i.el=f;e[g]=i};e.ext("each",function(e){if("undefined"!==typeof f.length&&f!==window)if("undefined"!==typeof Array.prototype.forEach)[].forEach.call(f,e);else{var i=f.length;if(0!==i)for(var k,j=0;j<i;j++)k=f.item(j)?f.item(j):f[j],e.call(k,k)}else e.call(f,
f)});e.type=function(e){return function(){return e&&e!==this}.call(e)?(typeof e).toLowerCase():{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};e=window.$_=window.$_||e;e.$=n}})();"undefined"===typeof window.console&&(window.console={log:function(){}});"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")});
"undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event&&(Event.prototype.preventDefault=function(){window.event.returnValue=false},Event.prototype.stopPropagation=function(){window.event.cancelBubble=true});"undefined"===typeof Array.isArray&&(Array.isArray=function(e){return Object.prototype.toString.apply(e)==="[object Array]"});
(function(e){function n(a,b,c){var d,h;if(typeof a.hasAttribute!=="undefined"){a.hasAttribute(b)&&(d=a.getAttribute(b));h=true}else if(typeof a[b]!=="undefined"){d=a[b];h=false}else if(b==="class"&&typeof a.className!=="undefined"){b="className";d=a.className;h=false}if(typeof d==="undefined"&&(typeof c==="undefined"||c===null)){console.log(c);console.log(a);console.log("Element does not have the selected attribute");return null}if(typeof c==="undefined")return d;typeof c!=="undefined"&&c!==null?
h===true?a.setAttribute(b,c):a[b]=c:c===null&&(h===true?a.removeAttribute(b):delete a[b]);return typeof c!=="undefined"?c:d}function q(a){return a.replace(/(\-[a-z])/g,function(a){return a.toUpperCase().replace("-","")})}function f(a,b,c){var d,b=q(b);d={outerHeight:"offsetHeight",outerWidth:"offsetWidth",top:"posTop"};if(typeof c==="undefined"&&a.style[b]!=="undefined")return a.style[b];if(typeof c==="undefined"&&a.style[d[b]]!=="undefined")return a.style[d[b]];if(typeof a.style[b]!=="undefined"){a.style[b]=
c;return null}if(a.style[d[b]]){a.style[d[b]]=c;return null}console.log("Property "+b+" nor an equivalent seems to exist")}typeof document!=="undefined"&&!("classList"in document.createElement("a"))&&function(a){var a=(a.HTMLElement||a.Element).prototype,b=Object,c=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},d=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1},h=function(a,b){this.name=a;this.code=DOMException[a];
this.message=b},e=function(a,b){if(b==="")throw new h("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(b))throw new h("INVALID_CHARACTER_ERR","String contains an invalid character");return d.call(a,b)},o=function(a){for(var b=c.call(a.className),b=b?b.split(/\s+/):[],d=0,h=b.length;d<h;d++)this.push(b[d]);this._updateClassName=function(){a.className=this.toString()}},f=o.prototype=[],g=function(){return new o(this)};h.prototype=Error.prototype;f.item=function(a){return this[a]||
null};f.contains=function(a){return e(this,a+"")!==-1};f.add=function(a){a=a+"";if(e(this,a)===-1){this.push(a);this._updateClassName()}};f.remove=function(a){a=e(this,a+"");if(a!==-1){this.splice(a,1);this._updateClassName()}};f.toggle=function(a){a=a+"";e(this,a)===-1?this.add(a):this.remove(a)};f.toString=function(){return this.join(" ")};if(b.defineProperty){f={get:g,enumerable:true,configurable:true};try{b.defineProperty(a,"classList",f)}catch(i){if(i.number===-2146823252){f.enumerable=false;
b.defineProperty(a,"classList",f)}}}else b.prototype.__defineGetter__&&a.__defineGetter__("classList",g)}(self);e.ext("dom",{addClass:function(a){e.each(function(b){b.classList.add(a)})},removeClass:function(a){e.each(function(b){b.classList.remove(a)})},hide:function(){this.css("display","none")},show:function(a){typeof a==="undefined"&&(a="block");this.css("display",a)},attr:function(a,b){var c=this.el;if(c.length>1&&typeof b==="undefined"){console.log(c);console.log("Must be a singular element")}else if(c.length>
1&&typeof b!=="undefined")e.each(function(c){return n(c,a,b)});else return n(c,a,b)},text:function(a){var b,c,d;d=this.el;c=typeof d.textContent!=="undefined"?"textContent":typeof d.innerText!=="undefined"?"innerText":"innerHTML";b=d[c];if(typeof a!=="undefined")return d[c]=a;return b},css:function(a,b){if(typeof b==="undefined")return f(this.el,a);e.each(function(c){f(c,a,b)})},append:function(a){typeof document.insertAdjacentHTML!=="undefined"?this.el.insertAdjacentHTML("beforeend",a):this.el.innerHTML=
this.el.innerHTML+a},prepend:function(a){typeof document.insertAdjacentHTML!=="undefined"?this.el.insertAdjacentHTML("afterbegin",a):this.el.innerHTML=a+this.el.innerHTML},html:function(a){if(typeof a!=="undefined")this.el.innerHTML=a;return this.el.innerHTML}});if(typeof window.XMLHttpRequest!=="undefined"){var g={_do:function(a,b,c,d){var h=new XMLHttpRequest;typeof c==="undefined"&&(c=function(){});d=d?"POST":"GET";a=a+(d==="GET"?"?"+this._serialize(b):"");h.open(d,a);h.onreadystatechange=function(){h.readyState===
4&&c(h.responseText)};if(d==="POST"){h.setRequestHeader("Content-Type","application/x-www-form-urlencoded");h.send(this._serialize(b))}else h.send(null)},_serialize:function(a){var b,c,d=[];for(b in a)if(a.hasOwnProperty(b)&&typeof a[b]!=="function"){c=a[b].toString();b=encodeURIComponent(b);c=encodeURIComponent(c);d.push(b+"="+c)}return d.join("&")}};e.ext("get",function(a,b,c){g._do(a,b,c,false)});e.ext("post",function(a,b,c){g._do(a,b,c,true)});e.ext("sse",function(a,b,c){if(typeof EventSource!==
"undefined"){a=new EventSource(a);a.onmessage=function(a){b(a.data)}}else setInterval(e.get,c||3E4,a,{},function(a){a.trim().replace(/data:/gim,"");a.replace(/^event|id|retry?:(.*)$/gim,"");b(a)})});var i,k,j,r;if(typeof document.addEventListener!=="undefined"){i=function(a,b,c){typeof a.addEventListener!=="undefined"&&a.addEventListener(b,c,false)};k=function(a,b,c){typeof a.removeEventListener!=="undefined"&&a.removeEventListener(b,c,false)}}else if(typeof document.attachEvent!=="undefined"){i=
function(a,b,c){function d(a){c.apply(a)}if(typeof a.attachEvent!=="undefined"){k(b,c);a.attachEvent("on"+b,d);a=a.KIS_0_6_0=a.KIS_0_6_0||{};a.listeners=a.listeners||{};a.listeners[b]=a.listeners[b]||[];a.listeners[b].push({callback:c,_listener:d})}else console.log("Failed to _attach event:"+b+" on "+a)};k=function(a,b,c){if(typeof a.detachEvent!=="undefined"){var d=a.KIS_0_6_0;if(d&&d.listeners&&d.listeners[b])for(var h=d.listeners[b],e=h.length,f=0;f<e;f++)if(h[f].callback===c){a.detachEvent("on"+
b,h[f]._listener);h.splice(f,1);h.length===0&&delete d.listeners[b];break}}}}j=function(a,b,c,d){var h,e;if(typeof a==="undefined"){console.log(arguments);console.log(b);return false}if(b.match(/^([\w\-]+)$/))d===true?i(a,b,c):k(a,b,c);else{b=b.split(" ");e=b.length;for(h=0;h<e;h++)j(a,b[h],c,d)}};r=function(a,b,c,d){j(a,c,function(c){var f,o,g,c=c||window.event;o=e.$(b,a);for(f in o){g=c.target||c.srcElement;if(g==o[f]){d.call(o[f],c);c.stopPropagation()}}},true)};e.ext("event",{add:function(a,b){e.each(function(c){j(c,
a,b,true)})},remove:function(a,b){e.each(function(c){j(c,a,b,false)})},live:function(a,b,c){r(document.documentElement,a,b,c)},delegate:function(a,b,c){e.each(function(d){r(d,a,b,c)})}});var l=window.indexedDB||window.webkitIndexedDB||window.mozIndexedDB||window.msIndexedDB,s={};if(typeof l!=="undefined"){s={current_db:null,connect:function(a,b,c){var d={},d=l.open(a,b||1);if(typeof c!=="undefined")d.onupgradeneeded=c;d.onerror=function(){console.log("IndexedDB disallowed.")};d.onsuccess=function(){s.current_db=
d.result}},create_store:function(a,b,c){var d={};if(typeof b!=="undefined")d.keyPath=b;if(typeof c!=="undefined")d.autoIncrement=!!c;return l.createObjectStore(a,d)},delete_store:function(){l.deleteObjectStore().onerror=l.onerror}};e.ext("indexedDB",s);if(typeof localStorage==="undefined"||typeof JSON==="undefined")return null;var m=localStorage,p=sessionStorage;e.ext("store",{get:function(a,b){var c=b?p.getItem(a):m.getItem(a);return JSON.parse(c)},set:function(a,b,c){b=JSON.stringify(b);c?p.setItem(a,
b):m.setItem(a,b)},remove:function(a,b){b?p.removeItem(a):m.removeItem(a)},getAll:function(a){var b,c={},d,e;e=a?m:p;b=e.length;for(a=0;a<b;a++){d=e.key(a);c[d]=e.getItem(d)}return c},clear:function(a){a?p.clear():m.clear()}});var u=function(a){var b=[],c=0,d={},e,b=t.object_keys(a);b.sort(function(a,b){var c=parseFloat(b),d=parseFloat(a),e=c+""===b,h=d+""===a;return e&&h?c>d?1:c<d?-1:0:e&&!h?1:!e&&h?-1:b>a?1:b<a?-1:0});c=b.length;for(e=0;e<c;e++)d[b[e]]=a[b[e]];return d},t={object_keys:function(a){var b=
[],c;for(c in a)a.hasOwnProperty(c)&&b.push(c);return b},object_values:function(a){var b=[],c;for(c in a)b.push(a[c]);return b},array_combine:function(a,b){var c={},d,h=0;e.type(a)!=="array"&&(a=this.object_values(a));e.type(b)!=="array"&&(b=this.object_values(b));d=a.length;if(d!==b.length){console.log("Object combine requires two arrays of the same size");return false}for(h=0;h<d;h++)c[a[h]]=b[h];return c},object_merge:function(){var a=Array.prototype.slice.call(arguments),b=a.length,c={},d,h=0,
f,g,i;d=true;for(f=0;f<b;f++)if(e.type(a[f])!=="array"){d=false;break}if(d){c=[];for(f=0;f<b;f++)c=c.contact(a[f]);return c}for(i=f=0;f<b;f++){d=a[f];if(e.type(d)=="array"){g=0;for(h=d.length;g<h;g++)c[i++]=d[g]}else for(g in d)d.hasOwnProperty(g)&&(parseInt(g,10)+""===g?c[i++]=d[g]:c[g]=d[g])}return c},str_trans:function(a,b,c){var d=[],e=[],f=false,g=0,i=0,j="",k="",n="",l="",m;if(typeof b==="object"){b=u(b);for(m in b)if(b.hasOwnProperty(m)){d.push(m);e.push(b[m])}b=d;c=e}i=a.length;g=b.length;
j=typeof c==="string";k=typeof b==="string";for(d=0;d<i;d++){f=false;if(k){a.charAt(d-1);n=a.charAt(d);a.charAt(d+1);for(e=0;e<g;e++)if(n==b.charAt(e)){f=true;break}}else for(e=0;e<g;e++)if(a.substr(d,b[e].length)==b[e]){f=true;d=d+b[e].length-1;break}l=f?l+(j?c.charAt(e):c[e]):l+a.charAt(d)}return l}};e.ext("util",t)}}})($_);
