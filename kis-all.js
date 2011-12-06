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

// --------------------------------------------------------------------------

/**
 * Store 
 * 
 * Wrapper for local / sessionstorage
 */
(function (){
	"use strict";
	
	//No support for localstorage? Bail out early
	if(typeof localStorage === "undefined" || typeof JSON === "undefined")
	{
		return;
	}
	
	//Shortcuts for wrapper
	var l = localStorage,
		s = sessionStorage;

	/**
	 * Wrapper for localstorage / sessionstorage data serialization.
	 * Each method has a boolean parameter, that when set as true switches the method
	 * to use sessionStorage rather than the default localStorage.
	 *
	 * @name store
	 * @namespace
	 * @memberOf $_
	 */
	var store = {		
		/**
		 * Retrieves and deserializes a value from localstorage, 
		 * based on the specified key
		 * 
		 * @param string key
		 * @param bool session
		 * @name get
		 * @memberOf $_.store
		 * @function
		 * @return object
		 * @type object
		 */
		get: function (key, sess)
		{
			var val = (sess) ? s.getItem(key) : l.getItem(key);
		
			return JSON.parse(val);
		},
		/**
		 * Puts a value into localstorage at the specified key,
		 * and JSON-encodes the value if not a string
		 *
		 * @param string key
		 * @param mixed value
		 * @param bool session
		 * @name set
		 * @memberOf $_.store
		 * @function
		 */
		set: function (key, value, sess)
		{
			// Localstorage generally only accepts strings
			value = JSON.stringify(value);			
			
			(sess) ? s.setItem(key, value) : l.setItem(key, value);
		},
		/**
		 * Removes the specified item from storage
		 * 
		 * @param string key
		 * @param bool session
		 * @name remove
		 * @memberOf $_.store
		 * @function
		 */
		remove: function (key, sess)
		{
			(sess) ? s.removeItem(key) : l.removeItem(key);
		},
		/**
		 * Returns an object of all the raw values in storage
		 * 
		 * @param bool session
		 * @name getAll
		 * @memberOf $_.store
		 * @function
		 * @return object
		 * @type object
		 */
		getAll: function (sess)
		{
			var i,
				len,
				data = {},
				k,
				o;
			
			//Reference to session/localstorage
			o = (sess) ? l : s;
				
			len = o.length;

			for (i = 0; i < len; i++)
			{
				k = o.key(i);
				data[k] = o.getItem(k);
			}

			return data;
		},
		/**
		 * Removes all values from the same domain storage
		 *
		 * @param bool session
		 * @name clear
		 * @memberOf $_.store
		 * @function
		 */
		clear: function(sess)
		{
			(sess) ? s.clear() : l.clear();
		}
	};

	$_.ext('store', store);
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
 * Util Object
 * 
 * Various object and string manipulation functions
 * Note: these are based on similar phpjs functions: http://phpjs.org
 */
(function(){

	"use strict";

	var 
	reverse_key_sort =  function(o)
	{
		//Define some variables
		var keys = [],
			num_keys = 0,
			new_o = {},
			i;
	
		//Extract the keys
		keys = u.object_keys(o);
		
		//Sort the keys
		keys.sort(function (b, a) {		
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
            
			if (aNumeric && bNumeric) 
			{
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} 
			else if (aNumeric && !bNumeric) 
			{
				return 1;
			} 
			else if (!aNumeric && bNumeric) 
			{
				return -1;
			}
			
			return a > b ? 1 : a < b ? -1 : 0;
		});
		
		// cache object/array size
		num_keys = keys.length;
		
		// Recreate the object/array
		for(i=0; i < num_keys; i++)
		{
			new_o[keys[i]] = o[keys[i]];
		}
		
		return new_o;
	},
	
	/**
	 * String and object manipulation utilities
	 *	
	 * @namespace
	 * @name util
	 * @memberOf $_
	 */
	u = {
		/**
		 * Retrieve the keys, or member names of an object
		 * 
		 * @name object_keys
		 * @memberOf $_.util
		 * @function
		 * @param object
		 * @return array
		 * @type array
		 */
		object_keys: function(o)
		{
			var keys = [],
				k;
				
			for(k in o)
			{
				if(o.hasOwnProperty(k))
				{
					keys.push(k);
				}
			}
			
			return keys;
		},
		/**
		 * Retrieves the values of an object, and returns
		 * them as an array
		 *
		 * @name object_values
		 * @memberOf $_.util
		 * @function
		 * @param object
		 * @return array
		 * @type array
		 */
		object_values: function(o)
		{
			var vals = [],
				prop;
			
			for(prop in o)
			{
				vals.push(o[prop]);
			}
			
			return vals;
		},
		/**
		 * Creates an object, with the property names of the first array, 
		 * and the values of the second. If objects are passed, the values 
		 * of the object are used. If the arrays or objects passed are 
		 * not the same size, the function will return false.
		 * 
		 * @name array_combine
		 * @memberOf $_.util
		 * @function
		 * @param array/object keys
		 * @param array/object vals
		 * @return object
		 * @type object
		 */
		array_combine: function(keys, vals)
		{
			var new_object = {},
				num_keys,
				i = 0;
				
			// Extract the keys or values if needed
			if($_.type(keys) !== "array")
			{
				keys = this.object_values(keys);
			}
			if($_.type(vals) !== "array")
			{
				vals = this.object_values(vals);
			}
			
			// cache the number of keys
			num_keys = keys.length;
			
			if(num_keys !== vals.length)
			{
				console.log("Object combine requires two arrays of the same size");
				return false;
			}
			
			// Create and return the new object
			for(i = 0; i < num_keys; i++)
			{
				new_object[keys[i]] = vals[i];
			}
			
			return new_object;
		},
		/**
		 * Combines two or more objects/arrays. If the keys are numeric, the outputted
		 * object will have re-indexed keys. If a key/value pair exists in both objects,
		 * indentical values will be droped, but if a key exists with a different value, 
		 * with the same key, the value in the second array will replace the value in the
		 * first
		 * 
		 * @name object_merge
		 * @memberOf $_.util
		 * @function
		 * @param object [as many as you wish to combine]
		 * @type object
		 * @return object
		 */
		object_merge: function()
		{
			var args = Array.prototype.slice.call(arguments),
				arg_len = args.length,
				new_obj = {},
				arg,
				iarg_len = 0,
				i,
				j,
				x,
				is_array = true;
				
			// Check for an array in the arguments
			for(i=0; i < arg_len; i++)
			{
				if($_.type(args[i]) !== "array")
				{
					is_array = false;
					break;
				}
			}
			
			// If all the arguments are javascript arrays
			if(is_array)
			{
				new_obj = [];
				// Let javascript do all the work!
				for(i=0; i< arg_len; i++)
				{
					new_obj = new_obj.contact(args[i]);
				}
				
				// Return early
				return new_obj;
			}
			
			// No, there's at least one object
			for(i=0, x=0; i < arg_len; i++)
			{
				arg = args[i];
				
				// If the argument is an array, add the array items as
				// numeric object properties
				if ($_.type(arg) == "array")
				{
					for (j=0, iarg_len= arg.length; j < iarg_len; j++)
					{
						new_obj[x++] = arg[j];
					}
				}
				else
				{
					for (j in arg)
					{
						if(arg.hasOwnProperty(j))
						{
							// If the key is numeric, add the property with
							// a numeric key
							if(parseInt(j, 10) + '' === j)
							{
								new_obj[x++] = arg[j];
							}
							else
							{
								new_obj[j] = arg[j];
							} 
						}
					}
				} 
			}
			
			return new_obj;
		},
		/**
		 * Replaces sections of strings in a greedy fashion, 
		 * starting with the longest replace pairs first. Accepts
		 * one replace pair as two parameters, or an object, with
		 * from => to replacements as key/value pairs
		 *
		 * @name str_trans
		 * @memberOf $_.util
		 * @function
		 * @param string input_string
		 * @param mixed from (string)/replace pairs (object)
		 * @param [string]
		 * @return string
		 * @type string
		 */
		str_trans: function(str, from, to)
		{
			var froms = [],
				tos = [],
				ret = '',
				match = false,
				from_len = 0,
				str_len = 0,
				to_len = 0,
				to_is_str = '',
				from_is_str = '',
				strx = '',
				strw = '',
				stry = '',
				from_strx = '',
				new_str = '',
				f,
				i,
				j;
				
			//Replace pairs? add them to the internal arrays
			if(typeof from === 'object')
			{
				// Sort the keys in descending order for better
				// replacement functionality
				from = reverse_key_sort(from);
				
				for(f in from)
				{
					if(from.hasOwnProperty(f))
					{
						froms.push(f);
						tos.push(from[f]);
					}
				}
				
				from = froms;
				to = tos;
			}
			
			//Go through the string, and replace characters as needed
			str_len = str.length;
			from_len = from.length;
			to_len = to.length;
			to_is_str = typeof to === 'string';
			from_is_str = typeof from === 'string';
			
			for(i=0; i < str_len; i++)
			{
				match = false;
				if(from_is_str)
				{
					strw = str.charAt(i-1);
					strx = str.charAt(i);
					stry = str.charAt(i+1);
					for(j=0; j < from_len; j++)
					{
						if(strx == from.charAt(j))
						{
							match = true;
							break;
						}
					}
				}
				else
				{
					for(j=0; j < from_len; j++)
					{
						if(str.substr(i, from[j].length) == from[j])
						{
							match = true;
							
							//Go past the current match
							i = (i + from[j].length) -1;
							break;

						}
					}
				}

				if(match)
				{
					new_str += (to_is_str) ? to.charAt(j) : to[j];
				}
				else
				{
					new_str += str.charAt(i);
				}
			}

			return new_str;
				
		}
		
	};

	//Add it to the $_ object
	$_.ext('util', u);
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
 * Template module for simple javascript templating
 */
(function(){
	"use strict";
	
	//This module relies on some others for simplicity
	//so, if they aren't there, don't initialize the module
	if($_.ajax === "undefined")
	{
		return;
	}
	
	var t, _t, _p;
	
	
	//Private object to store retrieved templates
	_t = {};
	
	//Private object to store parsed templates
	_p = {};
	
	
	/**
	 * Module for html templating. Requires ajax module.
	 * 
	 * @name template
	 * @namespace
	 * @memberOf $_
	 */
	t = {
		/**
		 * Retrieves a template
		 * 
		 * @memberOf $_.template
		 * @name get
		 * @param string name
		 * @return string
		 * @function
		 * @type string
		 */
		get: function(name)
		{
			var res;

			res = this.el.innerHTML;
			
			if(res === "")
			{
				console.log("Template is empty or cannot be found");
				return;
			}
			
			_t[name] = res;
			return res;
		},
		/**
		 * Formats a template
		 * 
		 * @memberOf $_.template
		 * @name parse
		 * @param string template_name
		 * @param object replace_data
		 * @return string
		 * @function
		 * @type string
		 */
		parse: function(name, data)
		{
			var tmp = _t[name],
				pairs = [],
				pair_reg = /\{([A-Z0-9_\-]+)\}(.*)\{\/\1\}/gim,
				var_reg = /\{([A-Z0-9_\-]+)\}/gim,
				pseudos = [], 
				num_pairs = 0,
				num_pseudos = 0,
				i = 0,
				j = 0,
				var_name = '',
				rep_data = {},
				tmp_data = '',
				data_len,
				frag,
				frag_section,
				emptys,
				x;
				
			tmp = String(tmp);
		
			//Remove newlines and tabs from template because
			//those whitespace characters are extra bandwidth
			tmp = tmp.replace(/\s+/gim, " ");
			tmp = tmp.replace(/>\s+</gim, "><");
			tmp = tmp.replace(/>\s+\{/gim, ">{");
			tmp = tmp.replace(/\}\s+</gim, "}<");
			
			//Match all the looped sections of content
			pairs = tmp.match(pair_reg);
			
			if(pairs != null)
			{
				num_pairs = pairs.length;
				
				//Go through the template, and match the pairs
				for(i=0;i<num_pairs;i++)
				{
					//Put the loop in a placeholder
					tmp = tmp.replace(pairs[i], "{"+i+"}");
					
					//Create a place to store looped data
					tmp_data = "";
					
					//The replace variable is the name of the tag
					var_name = String(pairs[i]).match(/^\{([A-Z0-9_\-]+)\}/i);
					rep_data = data[var_name[1]];
					
					//Make sure there are loops
					if(rep_data.length > 0)
					{
						data_len = rep_data.length;
						
						//Get rid of the loop tags
						pairs[i] = pairs[i].replace(pair_reg, "$2");
						
						//Replace psudovariables with data
						for(j=0;j<data_len;j++)
						{
							//Is there a better way to do this, rather than an inline function?
							tmp_data += pairs[i].replace(var_reg, function(_, varName){
								return (rep_data[j][varName]) ? rep_data[j][varName] : ""; 
							});
						}
					}
					
					//Replace the looped content
					tmp = tmp.replace("{"+i+"}", tmp_data);
				}
			}
			
			//Replace all the rest of the psudeovariables
			pseudos = tmp.match(var_reg);
			
			if(pseudos != null)
			{
				num_pseudos = pseudos.length;
			
				for(i=0;i<num_pseudos;i++)
				{
					//Remove the {} from the pseudos
					var_name = pseudos[i].replace('{', '');
					var_name = var_name.replace('}', '');
					
					//Replace each pseudovariable with the value of the object
					//property of the same name
					tmp = tmp.replace(pseudos[i], data[var_name]);
				}
			}
			
			//Create an empty fragement
			frag = document.createDocumentFragment();
			
			//Insert the html
			frag.appendChild(document.createElement('section'));
			frag_section = frag.querySelectorAll('section')[0];
			frag_section.innerHTML = tmp;
			
			//Remove bad elements in the fragment, should be faster than being done live
			emptys = frag_section.querySelectorAll('[src=""], [href=""]');
			
			for(x in emptys)
			{
				if(emptys[x].parentNode)
				{
					emptys[x].parentNode.removeChild(emptys[x]);
				}
			}
			
			//Save the parsed template in an object for later retrieval
			_p[name] = tmp;
			
			return tmp;
		},
		/** 
		 * Inserts the formatted template into the page. If the url and data parameters
		 * are passed, it will retrieve a template file from the same domain, parse, 
		 * and insert the template into the page. 
		 *
		 * @memberOf $_.template
		 * @name apply
		 * @function
		 * @param string parsed_template/template_name
		 * @param [string] url
		 * @param [object] data
		 */
		apply: function(name, url, data)
		{
			//If the parsed template is supplied, just apply it to the passed selector
			if(typeof url === "undefined" && typeof data === "undefined")
			{
				//If the "name" variable is in the _p object, set that
				if(typeof _p[name] !== "undefined")
				{
					this.el.innerHTML = _p[name];
					return;
				}
			
				//Otherwise, set the passed string to the current selector
				this.el.innerHTML = name;
				return;
			}
			
			//Otherwise, get the template, parse it, and apply it
			$_.get(url, {}, function(res){
				var parsed;
			
				if(res === "")
				{
					console.log("Template is empty or can not be found");
					return;
				}
				
				//Cache the template in an object for later use
				_t[name] = res;
				parsed = this.parse(name, data);
				_p[name] = parsed;
				
				this.el.innerHTML = parsed;
			});
		}
	};
	
	//Add the module to the library
	$_.ext('template', t);
	
})();
