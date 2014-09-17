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
		var oldVal;

		//Get the value of the attribute, if it exists
		if (sel.hasAttribute(name))
		{
			oldVal = sel.getAttribute(name);
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
			sel.setAttribute(name, value);
		}
		else if (value === null)
		{
			sel.removeAttribute(name);
		}

		return (value !== undefined) ? value : oldVal;
	}

	/**
	 * Change css property name to it's
	 * javascript camel case equivalent
	 */
	function _toCamel(s)
	{
		return String(s).replace(/(\-[a-z])/g, function($1){
			return $1.toUpperCase().replace('-','');
		});
	}

	function _css(sel, prop, val)
	{
		//Camel-case
		prop = _toCamel(prop);

		//If you don't define a value, try returning the existing value
		if(val === undefined && sel.style[prop] !== undefined)
		{
			return sel.style[prop];
		}

		// Let's set a value instead
		if(sel.style[prop] !== undefined)
		{
			sel.style[prop] = val;

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
		 * @param {string} class
		 */
		addClass: function (c)
		{
			$_.each(function (e){
				e.classList.add(c);
			});
		},
		/**
		 * Removes a class from the element(s) specified by the current
		 * selector
		 *
		 * @name removeClass
		 * @memberOf $_.dom
		 * @function
		 * @param {string} class
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
		 * @param {string} [type]
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
		 * @param {string} name
		 * @param {?string}[value]
		 * @return {?string}
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
		 * @param {?string} [value]
		 * @return {?string}
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
		 * on the current element.
		 *
		 * Accepts either key/value arguments, or an object with
		 * multiple key/value pairs.
		 *
		 * @example $_('#foo').dom.css('border', 0);
		 * @example $_('#foo').dom.css({background:'#000', color:'#fff'});
		 * @name css
		 * @memberOf $_.dom
		 * @function
		 * @param {(string|Object)} property
		 * @param {?string} [value]
		 * @return {?string}
		 */
		css: function (prop, val)
		{
			var prop_key = null;

			// If passed an object, recurse!
			if($_.type(prop) === 'object')
			{
				Object.keys(prop).forEach(function(prop_key) {
					$_.each(function (e){
						_css(e, prop_key, prop[prop_key]);
					});
				});
			}
			//Return the current value if a value is not set
			else if(val === undefined && $_.type(prop) !== 'object')
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
		 * @example $_("ul").dom.append("<li></li>"); // Adds an li element to the end of the selected ul element
		 * @name append
		 * @memberOf $_.dom
		 * @function
		 * @param {string} htm
		 */
		append: function(htm)
		{
			this.el.insertAdjacentHTML('beforeend', htm);
		},
		/**
		 * Adds to the innerHTML of the selected element, before the current children
		 *
		 * @example $_("ul").dom.append("<li></li>"); // Adds an li element to the beginning of the selected ul element
		 * @name prepend
		 * @memberOf $_.dom
		 * @function
		 * @param {string} htm
		 */
		 prepend: function(htm)
		 {
			this.el.insertAdjacentHTML('afterbegin', htm);
		 },
		/**
		 * Sets or gets the innerHTML propery of the element(s) passed
		 *
		 * @name html
		 * @memberOf $_.dom
		 * @function
		 * @param {?string} [htm]
		 * @return {?string}
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