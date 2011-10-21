/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.3.0
 */
(function (){

	"use strict";

	//Browser requirements check
	if (!document.querySelectorAll)
	{
		return;
	}

	var $_, $, dcopy, sel;
	
	/**
	 * $
	 *
	 * Simple DOM selector function
	 */
	$ = function (a)
	{
		var x;
		if (typeof a !== "string" || typeof a === "undefined"){ return a;}
		
		//Pick the quickest method for each kind of selector
		if (a.match(/^#([\w\-]+$)/))
		{
			return document.getElementById(a.split('#')[1]);
		}
		else if (a.match(/^([\w\-]+)$/))
		{
			x = document.getElementsByTagName(a);
		}
		else
		{
			x = document.querySelectorAll(a);
		}
		
		//Return the single object if applicable
		return (x.length === 1) ? x[0] : x;
	};

	/**
	 * $_
	 *
	 * Constructor function
	 */
	$_ = function(s)
	{
		//Have documentElement be default selector, just in case
		if(typeof s === "undefined")
		{
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
	 * Deep copy/prototypical constructor function
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
		
		F = function(){};
		
		F.prototype = obj;
		
		return new F();
		
	};
	
	//Function to add to $_ object, and get sel
	$_.ext = function(name, obj)
	{
		obj.el = sel;
		$_[name] = obj;
	};
	
	//Selector iteration
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
				callback(selx);
			}
		}
		else
		{
			callback(sel);
		}
	});
	
	//Type retriever
	$_.type = function(obj) 
	{
		if((function() {return obj && (obj !== this)}).call(obj))
		{
			//fallback on 'typeof' for truthy primitive values
			return (typeof obj).toLowerCase();
		}
		
		return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
	}

	//Set global variables
	$_ = window.$_ = window.$_ || $_;
	$_.$ = $;
	
	//console.log polyfill
	if(typeof window.console === "undefined")
	{
		window.console = {
			log:function(){}
		};
	}
	
	/**
	 * String trim function polyfill
	 */
	if(typeof String.prototype.trim === "undefined")
	{
		String.prototype.trim = function(){
			return this.replace(/^\s+|\s+$/g, "");
		};
	}
	
}());

// --------------------------------------------------------------------------


	// --------------------------------------------------------------------------

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
				DOMEx = function (type, message)
				{
					this.name = type;
					this.code = DOMException[type];
					this.message = message;
				},
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
	 * Dom manipulation object
	 *
	 */
	(function (){
		var d, tag_reg, class_reg;
		
		tag_reg = /^([\w\-]+)$/;
		class_reg = /\.([\w\-]+)$/;
		
		
		//Private function for getting/setting attributes
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

		d = {
			addClass: function (c)
			{
				$_.each(function (e){
					e.classList.add(c);
				});
			},
			removeClass: function (c)
			{
				$_.each(function (e){
					e.classList.remove(c);
				});
			},
			hide: function ()
			{
				this.css('display', 'none');
			},
			show: function (type)
			{
				if (typeof type === "undefined")
				{
					type = "block";
				}

				this.css("display", type);
			},
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
			}
		};

		$_.ext('dom', d);
		
	}());

	// --------------------------------------------------------------------------

	/**
	 * Store object
	 *
	 * Wrapper for localstorage data serialization
	 */
	(function (){
		var store = {
			get: function (key)
			{
				return JSON.parse(localStorage.getItem(key));
			},
			set: function (key, value)
			{
				if (typeof value !== "string")
				{
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			},
			remove: function (key)
			{
				localStorage.removeItem(key);
			},
			getAll: function ()
			{
				var i,
					len,
					data;
				len = localStorage.length;
				data = {};

				for (i = 0; i < len; i++)
				{
					var name = localStorage.key(i);
					var value = localStorage.getItem(name);
					data[name] = value;
				}

				return data;
			}
		};

		$_.ext('store', store);
	}());

	// --------------------------------------------------------------------------

	/**
	 * Qs
	 *
	 * Object for encoding and decoding querystrings and hashbang strings
	 */
	(function (){

		$_.hb = (history.pushState) ? false : true;

		var qs = {
			parse: function (hb)
			{
				hb = hb || $_.hb;
				
				var h, i, hString, pairs, pLen, data, y;

				data = {};

				if (hb === true)
				{
					h = location.hash.split('#!/');
					hString = (h.length > 1) ? h[1] : '';
				}
				else if (hb === false || hb === undefined)
				{
					hString = window.location.search.substring(1);
				}
				else
				{
					return false;
				}

				pairs = hString.split('&');

				pLen = pairs.length;

				for (i = 0; i < pLen; i++)
				{
					y = pairs[i].split('=');

					if (y.length < 2)
					{
						return data;
					}

					data[y[0]] = y[1];
				}

				return data;
			},
			set: function (key, value, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);

				if (key !== undefined && value !== undefined)
				{
					pairs[key] = value;
				}

				var vars = [];

				for (var x in pairs)
				{
					if (pairs.hasOwnProperty(x))
					{
						vars.push(x + '=' + pairs[x]);
					}
				}

				var qs = vars.join('&');

				if (hb === true)
				{
					qs = '!/' + qs;
					location.hash = qs;
				}

				return qs;
			},
			get: function (key, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);
				return (pairs[key]) ? pairs[key] : '';
			}
		};

		$_.ext('qs', qs);

	}());

	// --------------------------------------------------------------------------

		//Fix $_ is not defined errors
		var $_ = $_ || window.$_;

	// --------------------------------------------------------------------------

	/**
	 * Ajax
	 *
	 * Object for making ajax requests
	 */
	(function (){

		var ajax = {
			_do: function (url, data, callback, isPost)
			{
				if (typeof callback === "undefined")
				{
					callback = function (){};
				}

				var request = (typeof window.XMLHttpRequest !== "undefined") 
					? new XMLHttpRequest() 
					: false;

				var type = (isPost) ? "POST" : "GET";

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
				var pairs = [];

				for (var name in data)
				{
					if (!data.hasOwnProperty(name))
					{
						continue;
					}
					if (typeof data[name] === "function")
					{
						continue;
					}

					var value = data[name].toString();

					name = encodeURIComponent(name);
					value = encodeURIComponent(value);

					pairs.push(name + "=" + value);
				}

				return pairs.join("&");
			}
		};

		$_.ext('get', function (url, data, callback){
			ajax._do(url, data, callback, false);
		});

		$_.ext('post', function (url, data, callback){
			ajax._do(url, data, callback, true);
		});
	}());

	// --------------------------------------------------------------------------

	/**
	 * Util Object
	 * 
	 * Various object and string manipulation functions
	 */
	(function(){

		var u = {
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
			object_merge: function()
			{
			
			},
			reverse_key_sort: function(o)
			{
				//Define some variables
				var keys = [],
					num_keys = 0,
					new_o = {},
					i, 
					k,
					x;
			
				//Extract the keys
				keys = this.object_keys(o);
				
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
				
				//cache object/array size
				num_keys = keys.length;
				
				//Recreate the object/array
				for(i=0; i < num_keys; i++)
				{
					k = keys[i];
					new_o[k] = o[k];
				}
				
				return new_o;
			},
			str_trans: function(string, from, to)
			{
			
			}
		};

		//Add it to the $_ object
		$_.ext('util', u);
	}());

	// --------------------------------------------------------------------------

	/**
	 * Event object
	 *
	 * Event api wrapper
	 */
	(function (){

		// Property name for expandos on DOM objects
		var kis_expando = "KIS_0_3_0";

		var attach, remove, add_remove, e, attach_delegate, attach_live;

		// Define the proper attach and remove functions
		// based on browser support
		if(typeof document.addEventListener !== "undefined")
		{
			attach = function (sel, event, callback)
			{
				if (typeof sel.addEventListener !== "undefined")
				{
					sel.addEventListener(event, callback, false);
				}
			};
			remove = function (sel, event, callback)
			{
				if (typeof sel.removeEventListener !== "undefined")
				{
					sel.removeEventListener(event, callback, false);
				}
			};
		}
		//typeof function doesn't work in IE where attachEvent is available: brute force it
		else if(typeof document.attachEvent !== "undefined") 
		{
			attach = function (sel, event, callback)
			{
				function listener () {
					// Internet Explorer fails to correctly set the 'this' object
					// for event listeners, so we need to set it ourselves.
					callback.apply(arguments);
				}
				
				if (typeof sel.attachEvent !== "undefined")
				{
					remove(event, callback); // Make sure we don't have duplicate listeners
					
					sel.attachEvent("on" + event, listener);
					// Store our listener so we can remove it later
					var expando = sel[kis_expando] = sel[kis_expando] || {};
					expando.listeners = expando.listeners || {};
					expando.listeners[event] = expando.listeners[event] || [];
					expando.listeners[event].push({
						callback: callback,
						listener: listener
					});
				}
				else
				{
					console.log("Failed to attach event:"+event+" on "+sel);
				}
			};
			remove = function (sel, event, callback)
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
								sel.detachEvent("on" + event, listeners[i].listener);
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

		add_remove = function (sel, event, callback, add)
		{
			var i, len;
			
			if(typeof sel === "undefined")
			{
				console.log(arguments);
				console.log(event);
				return false;
			}

			//Multiple events? Run recursively!
			if (!event.match(/^([\w\-]+)$/))
			{
				event = event.split(" ");
				
				len = event.length;

				for (i = 0; i < len; i++)
				{
					add_remove(sel, event[i], callback, add);
				}

				return;
			}

			
			if(add === true)
			{
				attach(sel, event, callback);
			}
			else
			{
				remove(sel, event, callback);
			}
		};
		
		attach_delegate = function(sel, target, event, callback)
		{
		
			//Attach the listener to the parent object
			add_remove(sel, event, function(e){
			
				//Get the live version of the target selector
				sel = $_.$(sel);
			
			
				//todo: fire target callback when event bubbles from target
			}, true);
		};
		
		attach_live = function(target, event, callback)
		{
			attach_delegate(document.documentElement, target, event, callback);
		};
		
		// --------------------------------------------------------------------------

		e = {
			add: function (event, callback)
			{
				$_.each(function(e){
					add_remove(e, event, callback, true);
				});
			},
			remove: function (event, callback)
			{
				$_.each(function(e){
					add_remove(e, event, callback, false);
				});
			},
			live: function (event, callback)
			{
				$_.each(function(e){
					attach_live(e, event, callback);
				});
			},
			delegate: function(target, event, callback)
			{
				$_.each(function(e){
					attach_delegate(e, target, event, callback);
				});
			}
		};

		$_.ext('event', e);

	}());
