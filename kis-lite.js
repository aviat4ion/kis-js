/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.7.0
 */
(function (){

	"use strict";

	// Most functions rely on a string selector
	// which returns html elements. This requires
	// document.querySelectorAll or a custom
	// selector engine. I choose to just use the
	// browser feature, since it is present in
	// IE 8+, and all other major browsers
	if (typeof document.querySelector === "undefined")
	{
		return;
	}

	var $_, $, dcopy, sel;


	/**
	 * $_
	 *
	 * Constructor function
	 *
	 * @constuctor
	 * @namespace
	 * @param string selector
	 * @return object
	 */
	$_ = function(s)
	{
		// Have documentElement be default selector, just in case
		if (typeof s === "undefined")
		{
			// Defines a "global" selector for that instance
			sel = (typeof $_.el !== "undefined")
				? $_.el
				: document.documentElement;
		}
		else
		{
			sel = $(s);
		}

		// Add the selector to the prototype
		$_.prototype.el = sel;

		// Use the $_ object as it's own prototype
		var self = dcopy($_);

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
	 * @param string selector
	 * @param object context
	 * @return object
	 * @type object
	 */
	$ = function (a, context)
	{
		var x, c;

		if (typeof a != "string" || typeof a === "undefined"){ return a;}

		//Check for a context of a specific element, otherwise, just run on the document
		c  = (context != null && context.nodeType === 1)
			? context
			: document;

		//Pick the quickest method for each kind of selector
		if (a.match(/^#([\w\-]+$)/))
		{
			return document.getElementById(a.split('#')[1]);
		}
		else
		{
			x = c.querySelectorAll(a);
		}

		//Return the single object if applicable
		return (x.length === 1) ? x[0] : x;
	};

	/**
	 * Deep copy/prototypical constructor function
	 *
	 * @param object obj
	 * @private
	 * @return object
	 * @type object
	 */
	dcopy = function(obj)
	{
		var type, F;

		if(typeof obj === "undefined")
		{
			return;
		}

		if(typeof Object.create !== "undefined")
		{
			return Object.create(obj);
		}

		type = typeof obj;

		if(type !== "object" && type !== "function")
		{
			return;
		}

		/**
		 * @private
		 */
		F = function(){};

		F.prototype = obj;

		return new F();

	};

	/**
	 * Adds the property `obj` to the $_ object, calling it `name`
	 *
	 * @param string name
	 * @param object obj
	 */
	$_.ext = function(name, obj)
	{
		obj.el = sel;
		$_[name] = obj;
	};

	/**
	 * Iterates over a $_ object, applying a callback to each item
	 *
	 * @name $_.each
	 * @function
	 * @param function callback
	 */
	$_.ext('each', function (callback)
	{
		if(typeof sel.length !== "undefined" && sel !== window)
		{
			// Use the native method, if it exists
			if(typeof Array.prototype.forEach !== 'undefined')
			{
				[].forEach.call(sel, callback);
				return;
			}

			// Otherwise, fall back to a for loop
			var len = sel.length;

			if (len === 0)
			{
				return;
			}

			var selx;
			for (var x = 0; x < len; x++)
			{
				selx = (sel.item(x)) ? sel.item(x) : sel[x];
				callback.call(selx, selx);
			}
		}
		else
		{
			callback.call(sel, sel);
		}
	});

	/**
	 * Retrieves the type of the passed variable
	 *
	 * @param mixed obj
	 * @return string
	 * @type string
	 */
	$_.type = function(obj)
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

}());

// --------------------------------------------------------------------------

/**
 * A module of various browser polyfills
 * @file polyfill.js
 */

/**
 * String trim function polyfill
 */
if(typeof String.prototype.trim === "undefined")
{
	/**
	 * @private
	 */
	String.prototype.trim = function()
	{
		return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
	};
}

// --------------------------------------------------------------------------

/**
 * Array.isArray polyfill
 */
if (typeof Array.isArray === "undefined")
{
	Array.isArray = function(v)
	{
		return Object.prototype.toString.apply(v) === '[object Array]';
	}
}

// --------------------------------------------------------------------------

/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (){

	"use strict";

	// Don't bother even defining the object if the XMLHttpRequest isn't available
	if(typeof window.XMLHttpRequest === "undefined")
	{
		return;
	}

	var ajax = {
		_do: function (url, data, success_callback, error_callback, isPost)
		{
			var type,
				request = new XMLHttpRequest();

			if (typeof success_callback === "undefined")
			{
				/**
				 * @private
				 */
				success_callback = function (){};
			}

			type = (isPost) ? "POST" : "GET";
			
			if (type === "GET")
			{
				url += ( ! url.match('?')) 
					? "?" + this._serialize(data) 
					: this._serialize(data);
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
						if (typeof error_callback !== 'undefined')
						{
							error_callback.call(request.status, request.status);
						}
					}

				}
			};

			if (type === "POST")
			{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(this._serialize(data));
			}
			else
			{
				request.send(null);
			}
		},
		_serialize: function (data)
		{
			var name,
				value,
				pairs = [];

			for (name in data)
			{
				if (!data.hasOwnProperty(name))
				{
					continue;
				}
				if (typeof data[name] === "function")
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
	 * @name get
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function success_callback
	 * @param function error_callback
	 */
	$_.ext('get', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, false);
	});

	/**
	 * Sends a POST type ajax request
	 *
	 * @name post
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function success_callback
	 * @param function error_callback
	 */
	$_.ext('post', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, true);
	});

	/**
	 * Watches for server-sent events and applies a callback on message
	 *
	 * @name sse
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param function callback
	 */
	$_.ext('sse', function(url, callback){

		var source;

		// Check for server-sent event support
		if (typeof EventSource !== 'undefined')
		{
			source = new EventSource(url);

			// Apply the callback
			source.onmessage = function(event){
				callback.call(event.data, event.data);
			};
		}
	});

}());

// --------------------------------------------------------------------------

/**
 * Event
 *
 * Event api wrapper
 * @todo Add method for triggering events
 */
(function (){

	"use strict";

	var _add_remove, e, _attach_delegate;

	// Don't bother defining the methods if event api isn't supports
	if (typeof document.addEventListener === "undefined")
	{
		return false;
	}

	_add_remove = function (sel, event, callback, add)
	{
		var i, len;

		if(typeof sel === "undefined")
		{
			return null;
		}

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
		 * Adds an event that returns a callback when triggered on the selected
		 * event and selector
		 *
		 * @memberOf $_.event
		 * @name add
		 * @function
		 * @example Eg. $_("#selector").event.add("click", do_something());
		 * @param string event
		 * @param function callback
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
		 * @example Eg. $_("#selector").event.remove("click", do_something());
		 * @param string event
		 * @param string callback
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
		 * @example Eg. $_.event.live(".button", "click", do_something());
		 * @param string target
		 * @param string event
		 * @param function callback
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
		 * @example Eg. $_("#parent").delegate(".button", "click", do_something());
		 * @param string target
		 * @param string event_type
		 * @param function callback
		 */
		delegate: function (target, event, callback)
		{
			$_.each(function(e){
				_attach_delegate(e, target, event, callback);
			});
		}
	};

	$_.ext('event', e);

}());
