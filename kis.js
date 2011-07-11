/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.2.0
 */

(function (){

	"use strict";

	// Property name for expandos on DOM objects
	var kis_expando = "KIS_0_2_0";

	//Browser requirements check
	if (!document.querySelectorAll)
	{
		return;
	}

	var $_, $;
	
	/**
	 * String trim function polyfill
	 */
	if(typeof String.prototype.trim === "undefined")
	{
		String.prototype.trim = function(){
			return this.replace(/^\s+|\s+$/g, "");
		};
	}
	
	/**
	 * $
	 *
	 * Simple DOM selector function
	 */
	$ = function (a)
	{
		var x;
		if (typeof a !== "string"){ return a;}
		
		//Pick the quickest method for each kind of selector
		if(a.match(/^#([\w\-]+$)/))
		{
			return document.getElementById(a.split('#')[1]);
		}
		else if(a.match(/^([\w\-]+)$/))
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
	$_ = function(sel)
	{
		//Get the DOM objects from the selector
		sel = $(sel);
	
		//Have window be default selector, just in case
		if(typeof sel === "undefined")
		{
			sel = (typeof $_.el !== "undefined") 
				? $_.el 
				: window;
		}
		
		$_.el = sel;
		
		return $_;
	};

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
	
	// --------------------------------------------------------------------------
	
	$_.each = function (callback)
	{
		var sel = $_.el;
		
		//Don't try to iterate over the window object
		if(sel === window || typeof sel === "undefined")
		{
			return;
		}
		
		if(typeof sel.length !== "undefined")
		{
			var len = sel.length;

			if (len === 0)
			{
				return;
			}

			if (len === 1)
			{
				return callback(sel);
			}

			var selx;
			for (var x = 0; x < sel.length; x++)
			{
				selx = (sel.item(x)) ? sel.item(x) : sel[x];
				callback(selx);
			}
		}
		else
		{
			callback(sel);
		}
	};

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

				url += (type === "GET") ? "?"+this._serialize(data, true) : '';
				
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
			_serialize: function (data, encode)
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

					if (encode === true)
					{
						name = encodeURIComponent(name.replace(" ", "+"));
						value = encodeURIComponent(value.replace(" ", "+"));
					}

					pairs.push(name + "=" + value);
				}

				return pairs.join("&");
			}
		};

		$_.get = function (url, data, callback)
		{
			ajax._do(url, data, callback, false);
		};

		$_.post = function (url, data, callback)
		{
			ajax._do(url, data, callback, true);
		};
	}());

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

		$_.qs = qs;

	}());

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

		$_.store = store;
	}());

	/**
	 * Event object
	 *
	 * Event api wrapper
	 */
	(function (){
	
		var attach, remove, add_remove, e;

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

		add_remove = function (event, callback, add)
		{
			var i, len;
			
			//Get the DOM object
			var sel = $_.el;
			
			if(arguments.length === 4)
			{
				sel = arguments[0];
				event = arguments[1];
				callback = arguments[2];
				add = arguments[3];
			}
			
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
					add_remove(event[i], callback, add);
				}

				return;
			}

			//Go over additonal DOM objects as needed
			$_.each(function(e){
			
				(add === true) 
					? attach(e, event, callback) 
					: remove(e, event, callback);
			
			});
		};

		e = {
			add: function (event, callback)
			{
				add_remove(event, callback, true);
			},
			remove: function (event, callback)
			{
				add_remove(event, callback, false);
			}
		};

		$_.event = e;

	}());

	/**
	 * Dom manipulation object
	 *
	 */
	(function (){
		var d;

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
				(doAttr === true) 
					? sel.setAttribute(name, value) 
					: sel[name] = value;
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

		// Private function for class manipulation
		function _class(sel, c, add)
		{
			var ec, cs, len, i, classInd;

			//We can do this the easy way
			if (sel.classList)
			{
				if (add === true)
				{
					sel.classList.add(c);
					return;
				}
				else if (add === false)
				{
					sel.classList.remove(c);
					return;
				}
			}
			else //Or the hard way
			{
				//No class attribute? Set an empty string
				ec = sel.className;//_attr("class");
				ec = (typeof ec === "string") ? ec : '';

				//Convert class attribute string into array
				if (typeof ec === "string")
				{
					cs = (ec !== '') ? ec.split(" ") : [];

					len = cs.length;
					classInd = false;

					//Check for the class in the array
					for (i = 0; i < len; i++)
					{
						if (cs[i] === c)
						{
							classInd = i;
							break;
						}
					}
				}

				//Add or remove from class array
				if (add === true)
				{
					//Only add the class if isn't already there
					if (classInd === false)
					{
						cs.push(c);
					}
				}
				else if (add === false)
				{
					//Make sure the class you want to remove exists
					if (classInd !== false)
					{
						cs.splice(classInd, 1);
					}
				}

				var cName = (cs.length > 1) ? cs.join(" ") : cs[0];

				if (typeof sel.className !== "undefined")
				{
					sel.className = cName;
				}
				else if (typeof sel.setAttribute !== "undefined")
				{
					sel.setAttribute('class', cName);
				}
				else
				{
					console.log(sel);
				}

				return cName;
			}

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

			//Let's try the easy way first
			if(typeof sel.style[prop] !== "undefined")
			{
				sel.style[prop] = val;

				//Short circuit
				return;
			}

			//Let have an object with equivalent properties
			//for `special` browsers, and other quirks
			
			//Todo: get more common properties
			equi = {
				outerHeight: "offsetHeight",
				outerWidth: "offsetWidth",
				top: "posTop"
			};

			if(sel.style[equi[prop]])
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
					_class(e, c, true);
				});
			},
			removeClass: function (c)
			{
				$_.each(function (e){
					_class(e, c, false);
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
				var sel = $_.el;

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
						_attr(e, name, value);
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
			
				sel = $_.el;
				
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
				$_.each(function (e){
					_css(e, prop, val);
				});
			}
		};

		$_.dom = d;
	}());

}());
