/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.5.0-pre
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
		//Have documentElement be default selector, just in case
		if(typeof s === "undefined")
		{
			//Defines a "global" selector for that instance
			sel = (typeof $_.el !== "undefined") 
				? $_.el
				: document.documentElement;
		}
		else
		{
			sel = (typeof s !== "object") ? $(s) : s;
		}
		
		// Add the selector to the prototype
		$_.prototype.el = sel;

		// Make a copy before adding properties
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
(function(){

	"use strict";
 
	// Console.log polyfill for IE 8 stupidity
	if(typeof window.console === "undefined")
	{
		window.console = {
			log:function(){}
		};
	}
	
	// --------------------------------------------------------------------------
	
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
	
	//This is used so IE 8 can use the classList api
	/*
	 * classList.js: Cross-browser full element.classList implementation.
	 * 2011-06-15
	 *
	 * By Eli Grey, http://eligrey.com
	 * Public Domain.
	 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	 */
	
	if (typeof document !== "undefined" && !("classList" in document.createElement("a")))
	{
		(function (view){
		
			var classListProp = "classList",
				protoProp = "prototype",
				elemCtrProto = (view.HTMLElement || view.Element)[protoProp],
				objCtr = Object,
				strTrim = String[protoProp].trim ||
				function ()
				{
					return this.replace(/^\s+|\s+$/g, "");
				},
				arrIndexOf = Array[protoProp].indexOf ||
				function (item)
				{
					var
					i = 0,
						len = this.length;
					for (; i < len; i++)
					{
						if (i in this && this[i] === item)
						{
							return i;
						}
					}
					return -1;
				}
				// Vendors: please allow content code to instantiate DOMExceptions
				,
				/**
				 * @private
				 */
				DOMEx = function (type, message)
				{
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
				/**
				 * @private
				 */
				checkTokenAndGetIndex = function (classList, token)
				{
					if (token === "")
					{
						throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified");
					}
					if (/\s/.test(token))
					{
						throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character");
					}
					return arrIndexOf.call(classList, token);
				},
				/**
				 * @private
				 */
				ClassList = function (elem)
				{
					var
					trimmedClasses = strTrim.call(elem.className),
						classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
						i = 0,
						len = classes.length;
					for (; i < len; i++)
					{
						this.push(classes[i]);
					}
					this._updateClassName = function ()
					{
						elem.className = this.toString();
					};
				},
				classListProto = ClassList[protoProp] = [],
				/**
				 * @private
				 */
				classListGetter = function ()
				{
					return new ClassList(this);
				};
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i)
			{
				return this[i] || null;
			};
			classListProto.contains = function (token)
			{
				token += "";
				return checkTokenAndGetIndex(this, token) !== -1;
			};
			classListProto.add = function (token)
			{
				token += "";
				if (checkTokenAndGetIndex(this, token) === -1)
				{
					this.push(token);
					this._updateClassName();
				}
			};
			classListProto.remove = function (token)
			{
				token += "";
				var index = checkTokenAndGetIndex(this, token);
				if (index !== -1)
				{
					this.splice(index, 1);
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token)
			{
				token += "";
				if (checkTokenAndGetIndex(this, token) === -1)
				{
					this.add(token);
				}
				else
				{
					this.remove(token);
				}
			};
			classListProto.toString = function ()
			{
				return this.join(" ");
			};
	
			if (objCtr.defineProperty)
			{
				var classListPropDesc = {
					get: classListGetter,
					enumerable: true,
					configurable: true
				};
				try
				{
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				}
				catch (ex)
				{ // IE 8 doesn't support enumerable:true
					if (ex.number === -0x7FF5EC54)
					{
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			}
			else if (objCtr[protoProp].__defineGetter__)
			{
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}
	
		}(self));
	}
	
	// --------------------------------------------------------------------------
	
	/**
	 * event.preventDefault/e.stopPropagation polyfill
	 * @private
	 */
	if(typeof Event.preventDefault === "undefined" && typeof window.event !== "undefined")
	{
		Event.prototype.preventDefault = function() 
		{
			window.event.stop();
		},
		Event.prototype.stopPropagation = function()
		{
			window.event.returnValue = false;
		}
	}
	
}());

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
		_do: function (url, data, callback, isPost)
		{
			var type, 
				request = new XMLHttpRequest();
		
			if (typeof callback === "undefined")
			{
				/**
				 * @private
				 */
				callback = function (){};
			}

			type = (isPost) ? "POST" : "GET";

			url += (type === "GET") ? "?"+this._serialize(data) : '';
			
			request.open(type, url);

			request.onreadystatechange = function ()
			{
				if (request.readyState === 4)
				{
					callback(request.responseText);
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
	 * @param function callback
	 */
	$_.ext('get', function (url, data, callback){
		ajax._do(url, data, callback, false);
	});
	
	/**
	 * Sends a POST type ajax request
	 * 
	 * @name post
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function callback
	 */
	$_.ext('post', function (url, data, callback){
		ajax._do(url, data, callback, true);
	});
}());

// --------------------------------------------------------------------------

/**
 * Event
 *
 * Event api wrapper
 */
(function (){

	"use strict";

	// Property name for expandos on DOM objects
	var kis_expando = "KIS_0_5_0";

	var _attach, _remove, _add_remove, e, _attach_delegate;

	// Define the proper _attach and _remove functions
	// based on browser support
	if(typeof document.addEventListener !== "undefined")
	{
		/**
		 * @private
		 */
		_attach = function (sel, event, callback)
		{
			if(typeof sel.addEventListener !== "undefined")
			{
				// Duplicated events are dropped, per the specification
				sel.addEventListener(event, callback, false);
			}
		};
		/**
		 * @private
		 */
		_remove = function (sel, event, callback)
		{
			if(typeof sel.removeEventListener !== "undefined")
			{
				sel.removeEventListener(event, callback, false);
			}
		};
	}
	// typeof function doesn't work in IE where attachEvent is available: brute force it
	else if(typeof document.attachEvent !== "undefined") 
	{
		/**
		 * @private
		 */
		_attach = function (sel, event, callback)
		{
			function _listener () {
				// Internet Explorer fails to correctly set the 'this' object
				// for event listeners, so we need to set it ourselves.
				callback.apply(arguments[0]);
			}
			
			if (typeof sel.attachEvent !== "undefined")
			{
				_remove(event, callback); // Make sure we don't have duplicate listeners
				
				sel.attachEvent("on" + event, _listener);
				// Store our _listener so we can remove it later
				var expando = sel[kis_expando] = sel[kis_expando] || {};
				expando.listeners = expando.listeners || {};
				expando.listeners[event] = expando.listeners[event] || [];
				expando.listeners[event].push({
					callback: callback,
					_listener: _listener
				});
			}
			else
			{
				console.log("Failed to _attach event:"+event+" on "+sel);
			}
		};
		/**
		 * @private
		 */
		_remove = function (sel, event, callback)
		{
			if(typeof sel.detachEvent !== "undefined")
			{
				var expando = sel[kis_expando];
				if (expando && expando.listeners
						&& expando.listeners[event])
				{
					var listeners = expando.listeners[event];
					var len = listeners.length;
					for (var i=0; i<len; i++)
					{
						if (listeners[i].callback === callback)
						{
							sel.detachEvent("on" + event, listeners[i]._listener);
							listeners.splice(i, 1);
							if(listeners.length === 0)
							{
								delete expando.listeners[event];
							}
							return;
						}
					}
				}
			}
		};
	}
	
	_add_remove = function (sel, event, callback, add)
	{
		var i, len;
		
		if(typeof sel === "undefined")
		{
			console.log(arguments);
			console.log(event);
			return false;
		}

		// Multiple events? Run recursively!
		if (!event.match(/^([\w\-]+)$/))
		{
			event = event.split(" ");
			
			len = event.length;

			for (i = 0; i < len; i++)
			{
				_add_remove(sel, event[i], callback, add);
			}

			return;
		}

		
		if(add === true)
		{
			_attach(sel, event, callback);
		}
		else
		{
			_remove(sel, event, callback);
		}
	};

	_attach_delegate = function(sel, target, event, callback)
	{
		// attach the listener to the parent object
		_add_remove(sel, event, function(e){
		
			var elem, t, tar;
			
			// IE 8 doesn't have event bound to element
			e = e || window.event;
			
			// Get the live version of the target selector
			t = $_.$(target);
			
			// Check each element to see if it matches the target
			for(elem in t)
			{
				// IE 8 doesn't have target in the event object
				tar = e.target || e.srcElement;
			
				// Fire target callback when event bubbles from target
				if(tar == t[elem])
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

// --------------------------------------------------------------------------

/**
 * DOM
 * 
 * Dom manipulation module
 */
(function (){

	"use strict";

	var d;
	
	//Private function for getting/setting attributes/properties
	function _attr(sel, name, value)
	{
		var oldVal, doAttr;

		//Get the value of the attribute, if it exists
		if (typeof sel.hasAttribute !== "undefined")
		{
			if (sel.hasAttribute(name))
			{
				oldVal = sel.getAttribute(name);
			}

			doAttr = true;
		}
		else if (typeof sel[name] !== "undefined")
		{
			oldVal = sel[name];
			doAttr = false;
		}
		else if (name === "class" && typeof sel.className !== "undefined") //className attribute
		{
			name = "className";
			oldVal = sel.className;
			doAttr = false;
		}

		//Well, I guess that attribute doesn't exist
		if (typeof oldVal === "undefined" && (typeof value === "undefined" || value === null))
		{
			console.log(value);
			console.log(sel);
			console.log("Element does not have the selected attribute");
			return;
		}

		//No value to set? Return the current value
		if (typeof value === "undefined")
		{
			return oldVal;
		}

		//Determine what to do with the attribute
		if (typeof value !== "undefined" && value !== null)
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

		return (typeof value !== "undefined") ? value : oldVal;
	}
	
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
		if(typeof val === "undefined" && sel.style[prop] !== "undefined")
		{
			return sel.style[prop];
		}
		else if(typeof val === "undefined" && sel.style[equi[prop]] !== "undefined")
		{
			return sel.style[equi[prop]];
		}

		//Let's try the easy way first
		if(typeof sel.style[prop] !== "undefined")
		{
			sel.style[prop] = val;

			//Short circuit
			return;
		}
		else if(sel.style[equi[prop]])
		{
			sel.style[equi[prop]] = val;
			return;
		}
		
		//No matches? Well, lets log it for now
		console.log("Property " + prop + " nor an equivalent seems to exist");
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
			if (typeof type === "undefined")
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
			if (sel.length > 1 && typeof value === "undefined")
			{
				console.log(sel);
				console.log("Must be a singular element");
				return;
			}
			else if (sel.length > 1 && typeof value !== "undefined") //You can set a bunch, though
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
			var oldValue, set, type, sel;
		
			sel = this.el;
			
			set = (typeof value !== "undefined") ? true : false;
			
			type = (typeof sel.innerText !== "undefined")
				? "innerText"
				: (typeof sel.textContent !== "undefined")
					? "textContent"
					: "innerHTML";

			oldValue = sel[type];
			
			if(set)
			{
				sel[type] = value;
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
			if(typeof val === "undefined")
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
			if(typeof document.insertAdjacentHTML !== "undefined")
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
		 	if(typeof document.insertAdjacentHTML !== "undefined")
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
			
			if(typeof htm !== "undefined")
			{
				this.el.innerHTML = htm;
			}
			
			//If the parameter is undefined, just return the current value
			return this.el.innerHTML;
		}
	};

	$_.ext('dom', d);
	
}());

