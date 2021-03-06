/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.9.0
 */
(function (undefined){

	"use strict";

	/**
	 * Current selector object
	 *
	 * @memberOf $_
	 * @name el
	 */
	var sel;


	/**
	 * $_
	 *
	 * Constructor function
	 *
	 * @constructor
	 * @namespace $_
	 * @param {string} selector - The dom selector string
	 * @param {Object} [context] - Context of the dom selector string
	 * @return {Object}
	 */
	var $_ = function(s, context)
	{
		// Have documentElement be default selector, just in case
		if (s === undefined)
		{
			// Defines a "global" selector for that instance
			sel = ($_.el !== undefined)
				? $_.el
				: document.documentElement;
		}
		else
		{
			sel = $(s, context);
		}

		// Add the selector to the prototype
		$_.prototype.el = sel;

		// Use the $_ object as it's own prototype
		var self = Object.create($_);

		// Give sel to each extension.
		for(var i in self)
		{
			if(typeof self[i] === "object")
			{
				self[i].el = sel;
			}
		}

		self.el = sel;

		return self;
	};

	/**
	 * Simple DOM selector function
	 *
	 * @memberOf $_
	 * @param {string} selector
	 * @param {Object} [context]
	 * @return {Object}
	 */
	var $ = function (selector, context)
	{
		var elements;

		if (typeof selector != "string" || selector === undefined){ return selector;}

		//Check for a context of a specific element, otherwise, just run on the document
		context  = (context != null && context.nodeType === 1)
			? context
			: document;

		//Pick the quickest method for each kind of selector
		if (selector.match(/^#([\w\-]+$)/))
		{
			return document.getElementById(selector.split('#')[1]);
		}
		else
		{
			elements = context.querySelectorAll(selector);
		}

		//Return the single object if applicable
		return (elements.length === 1) ? elements[0] : elements;
	};

	/**
	 * Adds the property `obj` to the $_ object, calling it `name`
	 *
	 * @memberOf $_
	 * @function ext
	 * @example $_.ext('foo', {});
	 * @param {string} name - name of the module
	 * @param {object} obj - the object to add
	 */
	$_.ext = function(name, obj)
	{
		obj.el = sel;
		$_[name] = obj;
	};

	/**
	 * Iterates over a $_ object, applying a callback to each item
	 *
	 * @memberOf $_
	 * @function each
	 * @example $_('form input').each(function(item) { alert(item) });
	 * @param {function} callback - iteration callback
	 */
	$_.ext('each', function(callback)
	{
		if(sel.length !== undefined && sel !== window)
		{
			[].forEach.call(sel, callback);
		}
		else
		{
			callback.call(sel, sel);
		}
	});

	/**
	 * Retrieves the type of the passed variable
	 *
	 * @memberOf $_
	 * @function type
	 * @example $_.type([]); // Returns 'array'
	 * @param {*} obj
	 * @return {string}
	 */
	var type = function(obj)
	{
		if((function() {return obj && (obj !== this)}).call(obj))
		{
			//fallback on 'typeof' for truthy primitive values
			return (typeof obj).toLowerCase();
		}

		//Strip x from [object x] and return
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	};

	//Set global variables
	$_ = window.$_ = window.$_ || $_;
	$_.$ = $;
	$_.type = type;
}());

// --------------------------------------------------------------------------



// --------------------------------------------------------------------------

/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (undefined){

	"use strict";

	var ajax = {
		_do: function (url, data, success_callback, error_callback, type)
		{
			var type,
				request = new XMLHttpRequest();

			if (success_callback === undefined)
			{
				/**
				 * @private
				 */
				success_callback = function (){};
			}

			if (type === "GET")
			{
				url += (url.match(/\?/))
					? this._serialize(data)
					: "?" + this._serialize(data);
			}

			request.open(type, url);

			request.onreadystatechange = function ()
			{
				if (request.readyState === 4)
				{
					if (request.status === 200)
					{
						success_callback.call(request.responseText, request.responseText);
					}
					else
					{
						if (error_callback !== undefined)
						{
							error_callback.call(request.status, request.status);
						}
					}

				}
			};

			if (type !== "GET")
			{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(this._serialize(data));
			}
			else
			{
				request.send(null);
			}
		},
		/**
		 * Url encoding for non-get requests
		 *
		 * @param data
		 * @returns {string}
		 * @private
		 */
		_serialize: function (data)
		{
			var name,
				value,
				pairs = [];

			for (name in data)
			{
				if ( ! data.hasOwnProperty(name) || $_.type(data[name]) === "function")
				{
					continue;
				}

				value = data[name].toString();

				name = encodeURIComponent(name);
				value = encodeURIComponent(value);

				pairs.push(name + "=" + value);
			}

			return pairs.join("&");
		}
	};

	/**
	 * Sends a GET type ajax request
	 *
	 * @function get
	 * @memberOf $_
	 * @param {string} url - The url to retrieve
	 * @param {Object} data - get parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('get', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'GET');
	});

	/**
	 * Sends a POST type ajax request
	 *
	 * @function post
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - post parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('post', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'POST');
	});

	/**
	 * Sends a PUT type ajax request
	 *
	 * @function put
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - PUT parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('put', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'PUT');
	});

	/**
	 * Sends a DELETE type ajax request
	 *
	 * @function delete
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - delete parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('delete', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'DELETE');
	});
}());


// --------------------------------------------------------------------------

/**
 * Event
 *
 * Event api wrapper
 * @todo Add method for triggering events
 */
(function (undefined){

	"use strict";

	var _add_remove, e, _attach_delegate;

	_add_remove = function (sel, event, callback, add)
	{
		var i, len;

		// Multiple events? Run recursively!
		if ( ! event.match(/^([\w\-]+)$/))
		{
			event = event.split(" ");

			len = event.length;

			for (i = 0; i < len; i++)
			{
				_add_remove(sel, event[i], callback, add);
			}

			return;
		}

		// Bind the event
		(add === true)
			? sel.addEventListener(event, callback, false)
			: sel.removeEventListener(event, callback, false);
	};

	_attach_delegate = function(sel, target, event, callback)
	{
		// attach the listener to the parent object
		_add_remove(sel, event, function(e){

			var elem, t;

			// Get the live version of the target selector
			t = $_.$(target, sel);

			// Check each element to see if it matches the target
			for(elem in t)
			{
				// Fire target callback when event bubbles from target
				if(e.target == t[elem])
				{
					// Trigger the event callback
					callback.call(t[elem], e);

					// Stop event propegation
					e.stopPropagation();
				}
			}

		}, true);
	};

	// --------------------------------------------------------------------------

	/**
	 * Event Listener module
	 *
	 * @namespace
	 * @name event
	 * @memberOf $_
	 */
	e = {
		/**
		 * Create a custom event
		 *
		 * @memberOf $_.event
		 * @name create
		 * @function
		 * @example var event = $_("#selector").event.create('foo', {});
		 * @param {string} name
		 * @param {object} [data]
		 * @return {Object}
		 */
		create: function(name, data)
		{
			data = data || {};

			// Okay, I guess we have to do this the hard way... :(
			var e = document.createEvent('CustomEvent');
			e.initCustomEvent(name, true, true, data);

			return e;
		},
		/**
		 * Adds an event that returns a callback when triggered on the selected
		 * event and selector
		 *
		 * @memberOf $_.event
		 * @name add
		 * @function
		 * @example $_("#selector").event.add("click", do_something());
		 * @param {string} event
		 * @param {function} callback
		 */
		add: function (event, callback)
		{
			$_.each(function(e){
				_add_remove(e, event, callback, true);
			});
		},
		/**
		 * Removes an event bound the the specified selector, event type, and callback
		 *
		 * @memberOf $_.event
		 * @name remove
		 * @function
		 * @example $_("#selector").event.remove("click", do_something());
		 * @param {string} event
		 * @param {string} callback
		 */
		remove: function (event, callback)
		{
			$_.each(function(e){
				_add_remove(e, event, callback, false);
			});
		},
		/**
		 * Binds a persistent event to the document
		 *
		 * @memberOf $_.event
		 * @name live
		 * @function
		 * @example $_.event.live(".button", "click", do_something());
		 * @param {string} target
		 * @param {string} event
		 * @param {function} callback
		 */
		live: function (target, event, callback)
		{
			_attach_delegate(document.documentElement, target, event, callback);
		},
		/**
		 * Binds an event to a parent object
		 *
		 * @memberOf $_.event
		 * @name delegate
		 * @function
		 * @example $_("#parent").delegate(".button", "click", do_something());
		 * @param {string} target
		 * @param {string} event
		 * @param {function} callback
		 */
		delegate: function (target, event, callback)
		{
			$_.each(function(e){
				_attach_delegate(e, target, event, callback);
			});
		},
		/**
		 * Trigger an event to fire
		 *
		 * @memberOf $_.event
		 * @name trigger
		 * @function
		 * @example $_("#my_id").trigger('click');
		 * @param {object} event
		 * @return {boolean}
		 */
		trigger: function(event)
		{
			return this.el.dispatchEvent(event);
		}
	};

	$_.ext('event', e);

}());

// --------------------------------------------------------------------------

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
