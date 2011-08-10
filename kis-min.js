(function(){if(document.querySelectorAll){var e,c,g,f;c=function(a){if(typeof a!=="string"||typeof a==="undefined")return a;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);else a=a.match(/^([\w\-]+)$/)?document.getElementsByTagName(a):document.querySelectorAll(a);return a.length===1?a[0]:a};e=function(a){f=typeof a==="undefined"?typeof e.el!=="undefined"?e.el:document.documentElement:typeof a!=="object"?c(a):a;var a=g(e),h;for(h in a)if(typeof a[h]==="object")a[h].el=f;
a.el=f;return a};g=function(a){var c;if(typeof a!=="undefined"){if(typeof Object.create!=="undefined")return Object.create(a);c=typeof a;if(!(c!=="object"&&c!=="function"))return c=function(){},c.prototype=a,new c}};e.ext=function(a,c){c.el=f;e[a]=c};e.ext("each",function(a){if(typeof f.length!=="undefined"&&f!==window){var c=f.length;if(c!==0)for(var d,b=0;b<c;b++)d=f.item(b)?f.item(b):f[b],a(d)}else a(f)});e.type=function(a){return function(){return a&&a!==this}.call(a)?(typeof a).toLowerCase():
{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};e=window.$_=window.$_||e;e.$=c;if(typeof window.console==="undefined")window.console={log:function(){}};if(typeof String.prototype.trim==="undefined")String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}}})();
(function(){var e=e||window.$_;typeof document!=="undefined"&&!("classList"in document.createElement("a"))&&function(c){var c=(c.HTMLElement||c.Element).prototype,g=Object,f=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},a=Array.prototype.indexOf||function(d){for(var b=0,a=this.length;b<a;b++)if(b in this&&this[b]===d)return b;return-1},e=function(d,b){this.name=d;this.code=DOMException[d];this.message=b},d=function(d,b){if(b==="")throw new e("SYNTAX_ERR","An invalid or illegal string was specified");
if(/\s/.test(b))throw new e("INVALID_CHARACTER_ERR","String contains an invalid character");return a.call(d,b)},b=function(d){for(var b=f.call(d.className),b=b?b.split(/\s+/):[],a=0,i=b.length;a<i;a++)this.push(b[a]);this._updateClassName=function(){d.className=this.toString()}},i=b.prototype=[],l=function(){return new b(this)};e.prototype=Error.prototype;i.item=function(d){return this[d]||null};i.contains=function(b){b+="";return d(this,b)!==-1};i.add=function(b){b+="";d(this,b)===-1&&(this.push(b),
this._updateClassName())};i.remove=function(b){b+="";b=d(this,b);b!==-1&&(this.splice(b,1),this._updateClassName())};i.toggle=function(b){b+="";d(this,b)===-1?this.add(b):this.remove(b)};i.toString=function(){return this.join(" ")};if(g.defineProperty){i={get:l,enumerable:!0,configurable:!0};try{g.defineProperty(c,"classList",i)}catch(j){if(j.number===-2146823252)i.enumerable=!1,g.defineProperty(c,"classList",i)}}else g.prototype.__defineGetter__&&c.__defineGetter__("classList",l)}(self);(function(){function c(d,
b,a){var c,f;if(typeof d.hasAttribute!=="undefined")d.hasAttribute(b)&&(c=d.getAttribute(b)),f=!0;else if(typeof d[b]!=="undefined")c=d[b],f=!1;else if(b==="class"&&typeof d.className!=="undefined")b="className",c=d.className,f=!1;if(typeof c==="undefined"&&(typeof a==="undefined"||a===null))console.log(a),console.log(d),console.log("Element does not have the selected attribute");else{if(typeof a==="undefined")return c;typeof a!=="undefined"&&a!==null?f===!0?d.setAttribute(b,a):d[b]=a:a===null&&(f===
!0?d.removeAttribute(b):delete d[b]);return typeof a!=="undefined"?a:c}}function g(d){return d.replace(/(\-[a-z])/g,function(b){return b.toUpperCase().replace("-","")})}function f(d,b,a){var c,b=g(b);c={outerHeight:"offsetHeight",outerWidth:"offsetWidth",top:"posTop"};if(typeof a==="undefined"&&d.style[b]!=="undefined")return d.style[b];else if(typeof a==="undefined"&&d.style[c[b]]!=="undefined")return d.style[c[b]];typeof d.style[b]!=="undefined"?d.style[b]=a:d.style[c[b]]?d.style[c[b]]=a:console.log("Property "+
b+" nor an equivalent seems to exist")}var a,h;a=/^([\w\-]+)$/;h=/\.([\w\-]+)$/;e.ext("dom",{addClass:function(d){e.each(function(b){b.classList.add(d)})},removeClass:function(d){e.each(function(b){b.classList.remove(d)})},hide:function(){this.css("display","none")},show:function(d){typeof d==="undefined"&&(d="block");this.css("display",d)},attr:function(d,b){var a=this.el;if(a.length>1&&typeof b==="undefined")console.log(a),console.log("Must be a singular element");else if(a.length>1&&typeof b!==
"undefined")e.each(function(a){return c(a,d,b)});else return c(a,d,b)},text:function(d){var b,a,c;c=this.el;a=typeof c.innerText!=="undefined"?"innerText":typeof c.textContent!=="undefined"?"textContent":"innerHTML";b=c[a];return typeof d!=="undefined"?c[a]=d:b},css:function(d,b){if(typeof b==="undefined")return f(this.el,d);e.each(function(a){f(a,d,b)})},children:function(d){if(typeof d==="undefined")return e(this.el.children);var b=typeof this.el.children!=="undefined"?this.el.children:this.el;
if(e.type(d)!=="string")return e(d);else if(d.match(/#([\w\-]+$)/))return e(e.$(d));else{var c,f=b.length,g=[];if(d.match(a))for(c=0;c<f;c++)b[c].tagName.toLowerCase()==d.toLowerCase()&&g.push(b[c]);else if(d.match(h)){d=d.replace(".","");for(c=0;c<f;c++)b[c].classList.contains(d)&&g.push(b[c])}else console.log(d+" is not a valid filter");return e(g.length==1?g[0]:g)}}})})();(function(){e.ext("store",{get:function(c){return JSON.parse(localStorage.getItem(c))},set:function(c,g){typeof g!=="string"&&
(g=JSON.stringify(g));localStorage.setItem(c,g)},getAll:function(){var c,g,f;g=localStorage.length;f={};for(c=0;c<g;c++){var a=localStorage.key(c),e=localStorage.getItem(a);f[a]=e}return f}})})();(function(){e.hb=history.pushState?!1:!0;e.ext("qs",{parse:function(c){var c=c||e.hb,g,f,a,h;a={};if(c===!0)c=location.hash.split("#!/"),c=c.length>1?c[1]:"";else if(c===!1||c===void 0)c=window.location.search.substring(1);else return!1;g=c.split("&");f=g.length;for(c=0;c<f;c++){h=g[c].split("=");if(h.length<
2)break;a[h[0]]=h[1]}return a},set:function(c,g,f){var f=f||e.hb,a=this.parse(f);c!==void 0&&g!==void 0&&(a[c]=g);var c=[],h;for(h in a)a.hasOwnProperty(h)&&c.push(h+"="+a[h]);a=c.join("&");if(f===!0)a="!/"+a,location.hash=a;return a},get:function(c,g){var g=g||e.hb,f=this.parse(g);return f[c]?f[c]:""}})})();(function(){var c={_do:function(c,f,a,e){typeof a==="undefined"&&(a=function(){});var d=typeof window.XMLHttpRequest!=="undefined"?new XMLHttpRequest:!1,e=e?"POST":"GET";c+=e==="GET"?"?"+this._serialize(f):
"";d.open(e,c);d.onreadystatechange=function(){d.readyState===4&&a(d.responseText)};e==="POST"?(d.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),d.send(this._serialize(f))):d.send(null)},_serialize:function(c){var f=[],a;for(a in c)if(c.hasOwnProperty(a)&&typeof c[a]!=="function"){var e=c[a].toString();a=encodeURIComponent(a);e=encodeURIComponent(e);f.push(a+"="+e)}return f.join("&")}};e.ext("get",function(e,f,a){c._do(e,f,a,!1)});e.ext("post",function(e,f,a){c._do(e,f,a,!0)})})();
(function(){var c,g,f,a,h;typeof document.addEventListener!=="undefined"?(c=function(d,b,a){typeof d.addEventListener!=="undefined"&&d.addEventListener(b,a,!1)},g=function(d,b,a){typeof d.removeEventListener!=="undefined"&&d.removeEventListener(b,a,!1)}):typeof document.attachEvent!=="undefined"&&(c=function(d,b,a){var i;function c(){a.apply(arguments)}typeof d.attachEvent!=="undefined"?(g(b,a),d.attachEvent("on"+b,c),i=d.KIS_0_3_0=d.KIS_0_3_0||{},d=i,d.listeners=d.listeners||{},d.listeners[b]=d.listeners[b]||
[],d.listeners[b].push({callback:a,listener:c})):console.log("Failed to attach event:"+b+" on "+d)},g=function(a,b,c){if(typeof a.detachEvent!=="undefined"){var e=a.KIS_0_3_0;if(e&&e.listeners&&e.listeners[b])for(var f=e.listeners[b],g=f.length,h=0;h<g;h++)if(f[h].callback===c){a.detachEvent("on"+b,f[h].listener);f.splice(h,1);f.length===0&&delete e.listeners[b];break}}});f=function(a,b,e,h){var j,k;if(typeof a==="undefined")return console.log(arguments),console.log(b),!1;if(b.match(/^([\w\-]+)$/))h===
!0?c(a,b,e):g(a,b,e);else{b=b.split(" ");k=b.length;for(j=0;j<k;j++)f(a,b[j],e,h)}};a=function(a,b,c){f(a,c,function(){a=e.$(a)},!0)};h=function(c,b,e){a(document.documentElement,c,b,e)};e.ext("event",{add:function(a,b){e.each(function(c){f(c,a,b,!0)})},remove:function(a,b){e.each(function(c){f(c,a,b,!1)})},live:function(a,b){e.each(function(c){h(c,a,b)})},delegate:function(c,b,f){e.each(function(e){a(e,c,b,f)})}})})()})();
