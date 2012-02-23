(function(){if("undefined"!==typeof document.querySelector){var f,g,d,b;f=function(a){b="undefined"===typeof a?"undefined"!==typeof f.el?f.el:document.documentElement:"object"!==typeof a?g(a):a;f.prototype.el=b;var a=d(f),c;for(c in a)"object"===typeof a[c]&&(a[c].el=b);a.el=b;return a};g=function(a,c){var b;if("string"!=typeof a||"undefined"===typeof a)return a;b=null!=c&&1===c.nodeType?c:document;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);b=b.querySelectorAll(a);
return 1===b.length?b[0]:b};d=function(a){var c;if("undefined"!==typeof a){if("undefined"!==typeof Object.create)return Object.create(a);c=typeof a;if(!("object"!==c&&"function"!==c))return c=function(){},c.prototype=a,new c}};f.ext=function(a,c){c.el=b;f[a]=c};f.ext("each",function(a){if("undefined"!==typeof b.length&&b!==window){var c=b.length;if(0!==c)for(var e,d=0;d<c;d++)e=b.item(d)?b.item(d):b[d],a.call(e,e)}else a.call(b,b)});f.type=function(a){return function(){return a&&a!==this}.call(a)?
(typeof a).toLowerCase():{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};f=window.$_=window.$_||f;f.$=g}})();
(function(){"undefined"===typeof window.console&&(window.console={log:function(){}});"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")});"undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event&&(Event.prototype.preventDefault=function(){window.event.returnValue=!1},Event.prototype.stopPropagation=function(){window.event.cancelBubble=!0})})();
"undefined"!==typeof document&&!("classList"in document.createElement("a"))&&function(f){var f=(f.HTMLElement||f.Element).prototype,g=Object,d=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},b=Array.prototype.indexOf||function(a){for(var c=0,b=this.length;c<b;c++)if(c in this&&this[c]===a)return c;return-1},a=function(a,c){this.name=a;this.code=DOMException[a];this.message=c},c=function(c,e){if(""===e)throw new a("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(e))throw new a("INVALID_CHARACTER_ERR",
"String contains an invalid character");return b.call(c,e)},e=function(a){for(var c=d.call(a.className),c=c?c.split(/\s+/):[],b=0,e=c.length;b<e;b++)this.push(c[b]);this._updateClassName=function(){a.className=this.toString()}},j=e.prototype=[],i=function(){return new e(this)};a.prototype=Error.prototype;j.item=function(a){return this[a]||null};j.contains=function(a){return-1!==c(this,a+"")};j.add=function(a){a+="";-1===c(this,a)&&(this.push(a),this._updateClassName())};j.remove=function(a){a=c(this,
a+"");-1!==a&&(this.splice(a,1),this._updateClassName())};j.toggle=function(a){a+="";-1===c(this,a)?this.add(a):this.remove(a)};j.toString=function(){return this.join(" ")};if(g.defineProperty){j={get:i,enumerable:!0,configurable:!0};try{g.defineProperty(f,"classList",j)}catch(h){-2146823252===h.number&&(j.enumerable=!1,g.defineProperty(f,"classList",j))}}else g.prototype.__defineGetter__&&f.__defineGetter__("classList",i)}(self);
(function(){function f(b,a,c){var e,d;"undefined"!==typeof b.hasAttribute?(b.hasAttribute(a)&&(e=b.getAttribute(a)),d=!0):"undefined"!==typeof b[a]?(e=b[a],d=!1):"class"===a&&"undefined"!==typeof b.className&&(a="className",e=b.className,d=!1);if("undefined"===typeof e&&("undefined"===typeof c||null===c))console.log(c),console.log(b),console.log("Element does not have the selected attribute");else{if("undefined"===typeof c)return e;"undefined"!==typeof c&&null!==c?!0===d?b.setAttribute(a,c):b[a]=
c:null===c&&(!0===d?b.removeAttribute(a):delete b[a]);return"undefined"!==typeof c?c:e}}function g(b){return b.replace(/(\-[a-z])/g,function(a){return a.toUpperCase().replace("-","")})}function d(b,a,c){var e,a=g(a);e={outerHeight:"offsetHeight",outerWidth:"offsetWidth",top:"posTop"};if("undefined"===typeof c&&"undefined"!==b.style[a])return b.style[a];if("undefined"===typeof c&&"undefined"!==b.style[e[a]])return b.style[e[a]];"undefined"!==typeof b.style[a]?b.style[a]=c:b.style[e[a]]?b.style[e[a]]=
c:console.log("Property "+a+" nor an equivalent seems to exist")}$_.ext("dom",{addClass:function(b){$_.each(function(a){a.classList.add(b)})},removeClass:function(b){$_.each(function(a){a.classList.remove(b)})},hide:function(){this.css("display","none")},show:function(b){"undefined"===typeof b&&(b="block");this.css("display",b)},attr:function(b,a){var c=this.el;if(1<c.length&&"undefined"===typeof a)console.log(c),console.log("Must be a singular element");else if(1<c.length&&"undefined"!==typeof a)$_.each(function(c){return f(c,
b,a)});else return f(c,b,a)},text:function(b){var a,c,e;e=this.el;c="undefined"!==typeof e.textContent?"textContent":"undefined"!==typeof e.innerText?"innerText":"innerHTML";a=e[c];return"undefined"!==typeof b?e[c]=b:a},css:function(b,a){if("undefined"===typeof a)return d(this.el,b);$_.each(function(c){d(c,b,a)})},append:function(b){"undefined"!==typeof document.insertAdjacentHTML?this.el.insertAdjacentHTML("beforeend",b):this.el.innerHTML+=b},prepend:function(b){"undefined"!==typeof document.insertAdjacentHTML?
this.el.insertAdjacentHTML("afterbegin",b):this.el.innerHTML=b+this.el.innerHTML},html:function(b){"undefined"!==typeof b&&(this.el.innerHTML=b);return this.el.innerHTML}})})();
(function(){if("undefined"!==typeof window.XMLHttpRequest){var f={_do:function(g,d,b,a){var c=new XMLHttpRequest;"undefined"===typeof b&&(b=function(){});a=a?"POST":"GET";g+="GET"===a?"?"+this._serialize(d):"";c.open(a,g);c.onreadystatechange=function(){4===c.readyState&&b(c.responseText)};"POST"===a?(c.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),c.send(this._serialize(d))):c.send(null)},_serialize:function(g){var d,b,a=[];for(d in g)g.hasOwnProperty(d)&&"function"!==typeof g[d]&&
(b=g[d].toString(),d=encodeURIComponent(d),b=encodeURIComponent(b),a.push(d+"="+b));return a.join("&")}};$_.ext("get",function(g,d,b){f._do(g,d,b,!1)});$_.ext("post",function(g,d,b){f._do(g,d,b,!0)})}})();
(function(){var f,g,d,b;"undefined"!==typeof document.addEventListener?(f=function(a,c,b){"undefined"!==typeof a.addEventListener&&a.addEventListener(c,b,!1)},g=function(a,c,b){"undefined"!==typeof a.removeEventListener&&a.removeEventListener(c,b,!1)}):"undefined"!==typeof document.attachEvent&&(f=function(a,c,b){function d(a){b.apply(a)}"undefined"!==typeof a.attachEvent?(g(c,b),a.attachEvent("on"+c,d),a=a.KIS_0_5_0=a.KIS_0_5_0||{},a.listeners=a.listeners||{},a.listeners[c]=a.listeners[c]||[],a.listeners[c].push({callback:b,
_listener:d})):console.log("Failed to _attach event:"+c+" on "+a)},g=function(a,c,b){if("undefined"!==typeof a.detachEvent){var d=a.KIS_0_5_0;if(d&&d.listeners&&d.listeners[c])for(var i=d.listeners[c],g=i.length,f=0;f<g;f++)if(i[f].callback===b){a.detachEvent("on"+c,i[f]._listener);i.splice(f,1);0===i.length&&delete d.listeners[c];break}}});d=function(a,c,b,j){var i,h;if("undefined"===typeof a)return console.log(arguments),console.log(c),!1;if(c.match(/^([\w\-]+)$/))!0===j?f(a,c,b):g(a,c,b);else{c=
c.split(" ");h=c.length;for(i=0;i<h;i++)d(a,c[i],b,j)}};b=function(a,c,b,f){d(a,b,function(b){var d,e,g,b=b||window.event;e=$_.$(c,a);for(d in e)g=b.target||b.srcElement,g==e[d]&&(f.call(e[d],b),b.stopPropagation())},!0)};$_.ext("event",{add:function(a,b){$_.each(function(e){d(e,a,b,!0)})},remove:function(a,b){$_.each(function(e){d(e,a,b,!1)})},live:function(a,c,d){b(document.documentElement,a,c,d)},delegate:function(a,c,d){$_.each(function(f){b(f,a,c,d)})}})})();
(function(){if(!("undefined"===typeof localStorage||"undefined"===typeof JSON)){var f=localStorage,g=sessionStorage;$_.ext("store",{get:function(d,b){var a=b?g.getItem(d):f.getItem(d);return JSON.parse(a)},set:function(d,b,a){b=JSON.stringify(b);a?g.setItem(d,b):f.setItem(d,b)},remove:function(d,b){b?g.removeItem(d):f.removeItem(d)},getAll:function(d){var b,a={},c,e;e=d?f:g;b=e.length;for(d=0;d<b;d++)c=e.key(d),a[c]=e.getItem(c);return a},clear:function(d){d?g.clear():f.clear()}})}})();
(function(){if("undefined"!==$_.ajax){var f,g;f={};g={};$_.ext("template",{get:function(d){var b;b=this.el.innerHTML;if(""===b)console.log("Template is empty or cannot be found");else return f[d]=b},parse:function(d,b){var a=f[d],c=[],e=/\{([A-Z0-9_\-]+)\}(.*)\{\/\1\}/gim,j=/\{([A-Z0-9_\-]+)\}/gim,c=[],i=0,h=i=0,n=0,k="",o={},l="",m,a=(""+a).replace(/\s+/gim," "),a=a.replace(/>\s+</gim,"><"),a=a.replace(/>\s+\{/gim,">{"),a=a.replace(/\}\s+</gim,"}<"),c=a.match(e);if(null!=c){i=c.length;for(h=0;h<
i;h++){a=a.replace(c[h],"{"+h+"}");l="";k=(""+c[h]).match(/^\{([A-Z0-9_\-]+)\}/i);o=b[k[1]];if(0<o.length){k=o.length;c[h]=c[h].replace(e,"$2");for(n=0;n<k;n++)l+=c[h].replace(j,function(a,b){return o[n][b]?o[n][b]:""})}a=a.replace("{"+h+"}",l)}}c=a.match(j);if(null!=c){i=c.length;for(h=0;h<i;h++)k=c[h].replace("{",""),k=k.replace("}",""),a=a.replace(c[h],b[k])}e=document.createDocumentFragment();e.appendChild(document.createElement("section"));e=e.querySelectorAll("section")[0];e.innerHTML=a;e=e.querySelectorAll('[src=""], [href=""]');
for(m in e)e[m].parentNode&&e[m].parentNode.removeChild(e[m]);return g[d]=a},apply:function(d,b,a){"undefined"===typeof b&&"undefined"===typeof a?this.el.innerHTML="undefined"!==typeof g[d]?g[d]:d:$_.get(b,{},function(b){""===b?console.log("Template is empty or can not be found"):(f[d]=b,b=this.parse(d,a),g[d]=b,this.el.innerHTML=b)})}})}})();
(function(){var f=function(d){var b=[],a=0,c={},e,b=g.object_keys(d);b.sort(function(a,b){var c=parseFloat(b),d=parseFloat(a),e=c+""===b,f=d+""===a;return e&&f?c>d?1:c<d?-1:0:e&&!f?1:!e&&f?-1:b>a?1:b<a?-1:0});a=b.length;for(e=0;e<a;e++)c[b[e]]=d[b[e]];return c},g={object_keys:function(d){var b=[],a;for(a in d)d.hasOwnProperty(a)&&b.push(a);return b},object_values:function(d){var b=[],a;for(a in d)b.push(d[a]);return b},array_combine:function(d,b){var a={},c,e=0;"array"!==$_.type(d)&&(d=this.object_values(d));
"array"!==$_.type(b)&&(b=this.object_values(b));c=d.length;if(c!==b.length)return console.log("Object combine requires two arrays of the same size"),!1;for(e=0;e<c;e++)a[d[e]]=b[e];return a},object_merge:function(){var d=Array.prototype.slice.call(arguments),b=d.length,a={},c,e=0,f,g,h;c=!0;for(f=0;f<b;f++)if("array"!==$_.type(d[f])){c=!1;break}if(c){a=[];for(f=0;f<b;f++)a=a.contact(d[f]);return a}for(f=0,h=0;f<b;f++)if(c=d[f],"array"==$_.type(c))for(g=0,e=c.length;g<e;g++)a[h++]=c[g];else for(g in c)c.hasOwnProperty(g)&&
(parseInt(g,10)+""===g?a[h++]=c[g]:a[g]=c[g]);return a},str_trans:function(d,b,a){var c=[],e=[],g=!1,i=0,h=0,n="",k="",o="",l="",m;if("object"===typeof b){b=f(b);for(m in b)b.hasOwnProperty(m)&&(c.push(m),e.push(b[m]));b=c;a=e}h=d.length;i=b.length;n="string"===typeof a;k="string"===typeof b;for(c=0;c<h;c++){g=!1;if(k){d.charAt(c-1);o=d.charAt(c);d.charAt(c+1);for(e=0;e<i;e++)if(o==b.charAt(e)){g=!0;break}}else for(e=0;e<i;e++)if(d.substr(c,b[e].length)==b[e]){g=!0;c=c+b[e].length-1;break}l=g?l+(n?
a.charAt(e):a[e]):l+d.charAt(c)}return l}};$_.ext("util",g)})();
