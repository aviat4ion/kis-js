//This is used so IE can use the classList api
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if(typeof document!=="undefined"&&!("classList" in document.createElement("a"))){(function(j){if(!("HTMLElement" in j)&&!("Element" in j)){return}var a="classList",f="prototype",m=(j.HTMLElement||j.Element)[f],b=Object,k=String[f].trim||function(){return this.replace(/^\s+|\s+$/g,"")},c=Array[f].indexOf||function(q){var p=0,o=this.length;for(;p<o;p++){if(p in this&&this[p]===q){return p}}return -1},n=function(o,p){this.name=o;this.code=DOMException[o];this.message=p},g=function(p,o){if(o===""){throw new n("SYNTAX_ERR","An invalid or illegal string was specified")}if(/\s/.test(o)){throw new n("INVALID_CHARACTER_ERR","String contains an invalid character")}return c.call(p,o)},d=function(s){var r=k.call(s.className),q=r?r.split(/\s+/):[],p=0,o=q.length;for(;p<o;p++){this.push(q[p])}this._updateClassName=function(){s.className=this.toString()}},e=d[f]=[],i=function(){return new d(this)};n[f]=Error[f];e.item=function(o){return this[o]||null};e.contains=function(o){o+="";return g(this,o)!==-1};e.add=function(){var s=arguments,r=0,p=s.length,q,o=false;do{q=s[r]+"";if(g(this,q)===-1){this.push(q);o=true}}while(++r<p);if(o){this._updateClassName()}};e.remove=function(){var t=arguments,s=0,p=t.length,r,o=false;do{r=t[s]+"";var q=g(this,r);if(q!==-1){this.splice(q,1);o=true}}while(++s<p);if(o){this._updateClassName()}};e.toggle=function(p,q){p+="";var o=this.contains(p),r=o?q!==true&&"remove":q!==false&&"add";if(r){this[r](p)}return !o};e.toString=function(){return this.join(" ")};if(b.defineProperty){var l={get:i,enumerable:true,configurable:true};try{b.defineProperty(m,a,l)}catch(h){if(h.number===-2146823252){l.enumerable=false;b.defineProperty(m,a,l)}}}else{if(b[f].__defineGetter__){m.__defineGetter__(a,i)}}}(self))};

/**
 * DOM
 *
 * Dom manipulation module
 */
(function (undefined){

	"use strict";

	var d;

	//Private function for getting/setting attributes/properties
	function _attr(sel, name, value)
	{
		var oldVal, doAttr;

		//Get the value of the attribute, if it exists
		if (sel.hasAttribute !== undefined)
		{
			if (sel.hasAttribute(name))
			{
				oldVal = sel.getAttribute(name);
			}

			doAttr = true;
		}
		else if (sel[name] !== undefined)
		{
			oldVal = sel[name];
			doAttr = false;
		}
		else if (name === "class" && sel.className !== undefined) //className attribute
		{
			name = "className";
			oldVal = sel.className;
			doAttr = false;
		}

		//Well, I guess that attribute doesn't exist
		if (oldVal === undefined && (value === undefined || value === null))
		{
			return null;
		}

		//No value to set? Return the current value
		if (value === undefined)
		{
			return oldVal;
		}

		//Determine what to do with the attribute
		if (value !== undefined && value !== null)
		{
			if(doAttr === true)
			{
				sel.setAttribute(name, value);
			}
			else
			{
				sel[name] = value;
			}
		}
		else if (value === null)
		{
			if(doAttr === true)
			{
				sel.removeAttribute(name);
			}
			else
			{
				delete sel[name];
			}
		}

		return (value !== undefined) ? value : oldVal;
	}

	/**
	 * Change css property name to it's
	 * javascript camel case equivalent
	 */
	function _toCamel(s)
	{
		return s.replace(/(\-[a-z])/g, function($1){
			return $1.toUpperCase().replace('-','');
		});
	}

	function _css(sel, prop, val)
	{
		var equi;

		//Camel-case
		prop = _toCamel(prop);

		//Equivalent properties for 'special' browsers
		equi = {
			outerHeight: "offsetHeight",
			outerWidth: "offsetWidth",
			top: "posTop"
		};


		//If you don't define a value, try returning the existing value
		if(val === undefined && sel.style[prop] !== undefined)
		{
			return sel.style[prop];
		}
		else if(val === undefined && sel.style[equi[prop]] !== undefined)
		{
			return sel.style[equi[prop]];
		}

		//Let's try the easy way first
		if(sel.style[prop] !== undefined)
		{
			sel.style[prop] = val;

			//Short circuit
			return null;
		}
		else if(sel.style[equi[prop]])
		{
			sel.style[equi[prop]] = val;
			return null;
		}
	}

	// --------------------------------------------------------------------------

	/**
	 * DOM
	 *
	 * Dom manipulation module
	 * @namespace
	 * @memberOf $_
	 * @name dom
	 */
	d = {
		/**
		 * Adds a class to the element(s) specified by the current
		 * selector
		 *
		 * @name addClass
		 * @memberOf $_.dom
		 * @function
		 * @param string class
		 */
		addClass: function (c)
		{
			$_.each(function (e){
				this.classList.add(c);
			});
		},
		/**
		 * Removes a class from the element(s) specified by the current
		 * selector
		 *
		 * @name removeClass
		 * @memberOf $_.dom
		 * @function
		 * @param string class
		 */
		removeClass: function (c)
		{
			$_.each(function (e){
				e.classList.remove(c);
			});
		},
		/**
		 * Hides the element(s) specified by the current selector
		 *
		 * @name hide
		 * @memberOf $_.dom
		 * @function
		 */
		hide: function ()
		{
			this.css('display', 'none');
		},
		/**
		 * Shows the element(s) specified by the current selector.
		 * if type is specified, the element will have it's style
		 * property set to "display:[your type]". If type is not
		 * specified, the element is set to "display:block".
		 *
		 * @name  show
		 * @memberOf $_.dom
		 * @function
		 * @param [string] type
		 */
		show: function (type)
		{
			if (type === undefined)
			{
				type = "block";
			}

			this.css("display", type);
		},
		/**
		 * Sets attributes on element(s) specified by the current
		 * selector, or, if name is not specified, returns the
		 * value of the attribute of the element specified by the
		 * current selector.
		 *
		 * @name attr
		 * @memberOf $_.dom
		 * @function
		 * @param string name
		 * @param [string] value
		 * @return string
		 * @type string
		 */
		attr: function (name, value)
		{
			var sel = this.el;

			//Make sure you don't try to get a bunch of elements
			if (sel.length > 1 && value === undefined)
			{
				return null;
			}
			else if (sel.length > 1 && value !== undefined) //You can set a bunch, though
			{
				$_.each(function (e){
					return _attr(e, name, value);
				});
			}
			else //Normal behavior
			{
				return _attr(sel, name, value);
			}
		},
		/**
		 * Sets or retrieves the text content of the element
		 * specified by the current selector. If a value is
		 * passed, it will set that value on the current element,
		 * otherwise it will return the value of the current element
		 *
		 * @name text
		 * @memberOf $_.dom
		 * @function
		 * @param [string] value
		 * @return string
		 * @type string
		 */
		text: function (value)
		{
			var oldValue, set, sel;

			sel = this.el;

			set = (value !== undefined) ? true : false;

			oldValue = sel.textContent;

			if(set)
			{
				sel.textContent = value;
				return value;
			}
			else
			{
				return oldValue;
			}
		},
		/**
		 * Sets or retrieves a css property of the element
		 * specified by the current selector. If a value is
		 * passed, it will set that value on the current element,
		 * otherwise it will return the value of the css property
		 * on the current element
		 *
		 * @name css
		 * @memberOf $_.dom
		 * @function
		 * @param string property
		 * @param [string] value
		 * @return string
		 * @type string
		 */
		css: function (prop, val)
		{
			//Return the current value if a value is not set
			if(val === undefined)
			{
				return _css(this.el, prop);
			}

			$_.each(function (e){
				_css(e, prop, val);
			});
		},
		/**
		 * Adds to the innerHTML of the current element, after the last child.
		 *
		 * @example $_("ul").dom.append("&lt;li&gt;&lt;/li&gt;") adds an li element to the end of the selected ul element
		 * @name append
		 * @memberOf $_.dom
		 * @function
		 * @param string htm
		 */
		append: function(htm)
		{
			if(document.insertAdjacentHTML !== undefined)
			{
				this.el.insertAdjacentHTML('beforeend', htm);
			}
			else
			{
				this.el.innerHTML += htm;
			}
		},
		/**
		 * Adds to the innerHTML of the selected element, before the current children
		 *
		 * @name prepend
		 * @memberOf $_.dom
		 * @function
		 * @param string htm
		 */
		 prepend: function(htm)
		 {
		 	if(document.insertAdjacentHTML !== undefined)
		 	{
		 		this.el.insertAdjacentHTML('afterbegin', htm);
		 	}
		 	else
		 	{
		 		this.el.innerHTML = htm + this.el.innerHTML;
		 	}
		 },
		/**
		 * Sets or gets the innerHTML propery of the element(s) passed
		 *
		 * @name html
		 * @memberOf $_.dom
		 * @function
		 * @param [string] htm
		 * @return string
		 * @type string
		 */
		html: function(htm)
		{

			if(htm !== undefined)
			{
				this.el.innerHTML = htm;
			}

			//If the parameter is undefined, just return the current value
			return this.el.innerHTML;
		}
	};

	$_.ext('dom', d);

}());