(function(){if("undefined"!==typeof document.querySelector){var c,g,e,b;c=function(a){b="undefined"===typeof a?"undefined"!==typeof c.el?c.el:document.documentElement:"object"!==typeof a?g(a):a;c.prototype.el=b;var a=e(c),d;for(d in a)"object"===typeof a[d]&&(a[d].el=b);a.el=b;return a};g=function(a,d){var b;if("string"!=typeof a||"undefined"===typeof a)return a;b=null!=d&&1===d.nodeType?d:document;if(a.match(/^#([\w\-]+$)/))return document.getElementById(a.split("#")[1]);b=b.querySelectorAll(a);
return 1===b.length?b[0]:b};e=function(a){var d;if("undefined"!==typeof a){if("undefined"!==typeof Object.create)return Object.create(a);d=typeof a;if(!("object"!==d&&"function"!==d))return d=function(){},d.prototype=a,new d}};c.ext=function(a,d){d.el=b;c[a]=d};c.ext("each",function(a){if("undefined"!==typeof b.length&&b!==window)if("undefined"!==typeof Array.prototype.forEach)[].forEach.call(b,a);else{var d=b.length;if(0!==d)for(var h,f=0;f<d;f++)h=b.item(f)?b.item(f):b[f],a.call(h,h)}else a.call(b,
b)});c.type=function(a){return function(){return a&&a!==this}.call(a)?(typeof a).toLowerCase():{}.toString.call(a).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()};c=window.$_=window.$_||c;c.$=g}})();"undefined"===typeof window.console&&(window.console={log:function(){}});"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g,"")});
"undefined"===typeof Event.preventDefault&&"undefined"!==typeof window.event&&(Event.prototype.preventDefault=function(){window.event.returnValue=false},Event.prototype.stopPropagation=function(){window.event.cancelBubble=true});"undefined"===typeof Array.isArray&&(Array.isArray=function(c){return Object.prototype.toString.apply(c)==="[object Array]"});
(function(){if(typeof window.XMLHttpRequest!=="undefined"){var c={_do:function(g,c,b,a){var d=new XMLHttpRequest;typeof b==="undefined"&&(b=function(){});a=a?"POST":"GET";g=g+(a==="GET"?"?"+this._serialize(c):"");d.open(a,g);d.onreadystatechange=function(){d.readyState===4&&b(d.responseText)};if(a==="POST"){d.setRequestHeader("Content-Type","application/x-www-form-urlencoded");d.send(this._serialize(c))}else d.send(null)},_serialize:function(c){var e,b,a=[];for(e in c)if(c.hasOwnProperty(e)&&typeof c[e]!==
"function"){b=c[e].toString();e=encodeURIComponent(e);b=encodeURIComponent(b);a.push(e+"="+b)}return a.join("&")}};$_.ext("get",function(g,e,b){c._do(g,e,b,false)});$_.ext("post",function(g,e,b){c._do(g,e,b,true)});$_.ext("sse",function(c,e,b){if(typeof EventSource!=="undefined"){c=new EventSource(c);c.onmessage=function(a){e(a.data)}}else setInterval($_.get,b||3E4,c,{},function(a){a.trim().replace(/data:/gim,"");a.replace(/^(event|id|retry)?\:(.*)$/gim,"");e.call(a,a)})})}})();
(function(){var c,g,e,b;if(typeof document.addEventListener!=="undefined"){c=function(a,d,b){typeof a.addEventListener!=="undefined"&&a.addEventListener(d,b,false)};g=function(a,d,b){typeof a.removeEventListener!=="undefined"&&a.removeEventListener(d,b,false)}}else if(typeof document.attachEvent!=="undefined"){c=function(a,b,h){function c(a){h.apply(a)}if(typeof a.attachEvent!=="undefined"){g(b,h);a.attachEvent("on"+b,c);a=a.KIS_0_6_0=a.KIS_0_6_0||{};a.listeners=a.listeners||{};a.listeners[b]=a.listeners[b]||
[];a.listeners[b].push({callback:h,_listener:c})}else console.log("Failed to _attach event:"+b+" on "+a)};g=function(a,b,c){if(typeof a.detachEvent!=="undefined"){var f=a.KIS_0_6_0;if(f&&f.listeners&&f.listeners[b])for(var e=f.listeners[b],g=e.length,i=0;i<g;i++)if(e[i].callback===c){a.detachEvent("on"+b,e[i]._listener);e.splice(i,1);e.length===0&&delete f.listeners[b];break}}}}e=function(a,b,h,f){var j,k;if(typeof a==="undefined"){console.log(arguments);console.log(b);return false}if(b.match(/^([\w\-]+)$/))f===
true?c(a,b,h):g(a,b,h);else{b=b.split(" ");k=b.length;for(j=0;j<k;j++)e(a,b[j],h,f)}};b=function(a,b,c,f){e(a,c,function(c){var h,i,e,c=c||window.event;i=$_.$(b,a);for(h in i){e=c.target||c.srcElement;if(e==i[h]){f.call(i[h],c);c.stopPropagation()}}},true)};$_.ext("event",{add:function(a,b){$_.each(function(c){e(c,a,b,true)})},remove:function(a,b){$_.each(function(c){e(c,a,b,false)})},live:function(a,d,c){b(document.documentElement,a,d,c)},delegate:function(a,d,c){$_.each(function(e){b(e,a,d,c)})}})})();
"undefined"!==typeof document&&!("classList"in document.createElement("a"))&&function(c){var c=(c.HTMLElement||c.Element).prototype,g=Object,e=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,"")},b=Array.prototype.indexOf||function(a){for(var b=0,d=this.length;b<d;b++)if(b in this&&this[b]===a)return b;return-1},a=function(a,b){this.name=a;this.code=DOMException[a];this.message=b},d=function(d,c){if(c==="")throw new a("SYNTAX_ERR","An invalid or illegal string was specified");if(/\s/.test(c))throw new a("INVALID_CHARACTER_ERR",
"String contains an invalid character");return b.call(d,c)},h=function(a){for(var b=e.call(a.className),b=b?b.split(/\s+/):[],d=0,c=b.length;d<c;d++)this.push(b[d]);this._updateClassName=function(){a.className=this.toString()}},f=h.prototype=[],j=function(){return new h(this)};a.prototype=Error.prototype;f.item=function(a){return this[a]||null};f.contains=function(a){return d(this,a+"")!==-1};f.add=function(a){a=a+"";if(d(this,a)===-1){this.push(a);this._updateClassName()}};f.remove=function(a){a=
d(this,a+"");if(a!==-1){this.splice(a,1);this._updateClassName()}};f.toggle=function(a){a=a+"";d(this,a)===-1?this.add(a):this.remove(a)};f.toString=function(){return this.join(" ")};if(g.defineProperty){f={get:j,enumerable:true,configurable:true};try{g.defineProperty(c,"classList",f)}catch(k){if(k.number===-2146823252){f.enumerable=false;g.defineProperty(c,"classList",f)}}}else g.prototype.__defineGetter__&&c.__defineGetter__("classList",j)}(self);
(function(){function c(b,a,d){var c,e;if(typeof b.hasAttribute!=="undefined"){b.hasAttribute(a)&&(c=b.getAttribute(a));e=true}else if(typeof b[a]!=="undefined"){c=b[a];e=false}else if(a==="class"&&typeof b.className!=="undefined"){a="className";c=b.className;e=false}if(typeof c==="undefined"&&(typeof d==="undefined"||d===null)){console.log(d);console.log(b);console.log("Element does not have the selected attribute");return null}if(typeof d==="undefined")return c;typeof d!=="undefined"&&d!==null?e===
true?b.setAttribute(a,d):b[a]=d:d===null&&(e===true?b.removeAttribute(a):delete b[a]);return typeof d!=="undefined"?d:c}function g(b){return b.replace(/(\-[a-z])/g,function(a){return a.toUpperCase().replace("-","")})}function e(b,a,c){var e,a=g(a);e={outerHeight:"offsetHeight",outerWidth:"offsetWidth",top:"posTop"};if(typeof c==="undefined"&&b.style[a]!=="undefined")return b.style[a];if(typeof c==="undefined"&&b.style[e[a]]!=="undefined")return b.style[e[a]];if(typeof b.style[a]!=="undefined"){b.style[a]=
c;return null}if(b.style[e[a]]){b.style[e[a]]=c;return null}console.log("Property "+a+" nor an equivalent seems to exist")}$_.ext("dom",{addClass:function(b){$_.each(function(a){a.classList.add(b)})},removeClass:function(b){$_.each(function(a){a.classList.remove(b)})},hide:function(){this.css("display","none")},show:function(b){typeof b==="undefined"&&(b="block");this.css("display",b)},attr:function(b,a){var d=this.el;if(d.length>1&&typeof a==="undefined"){console.log(d);console.log("Must be a singular element")}else if(d.length>
1&&typeof a!=="undefined")$_.each(function(d){return c(d,b,a)});else return c(d,b,a)},text:function(b){var a,c,e;e=this.el;c=typeof e.textContent!=="undefined"?"textContent":typeof e.innerText!=="undefined"?"innerText":"innerHTML";a=e[c];if(typeof b!=="undefined")return e[c]=b;return a},css:function(b,a){if(typeof a==="undefined")return e(this.el,b);$_.each(function(c){e(c,b,a)})},append:function(b){typeof document.insertAdjacentHTML!=="undefined"?this.el.insertAdjacentHTML("beforeend",b):this.el.innerHTML=
this.el.innerHTML+b},prepend:function(b){typeof document.insertAdjacentHTML!=="undefined"?this.el.insertAdjacentHTML("afterbegin",b):this.el.innerHTML=b+this.el.innerHTML},html:function(b){if(typeof b!=="undefined")this.el.innerHTML=b;return this.el.innerHTML}})})();
