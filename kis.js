/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.1.0
 */

(function (){

	"use strict";

	// Property name for expandos on DOM objects
	var kis_expando = "KIS_0_1_0";

	//Browser requirements check
	if (!document.querySelectorAll)
	{
		return;
	}

	var $_, $;

	$_ = {};

	$_ = window.$_ = window.$_ || $_;

	/**
	 * $
	 *
	 * Simple DOM selector function
	 */
	$ = function (a)
	{
		if (typeof a !== "string"){ return a;}
		var x = document.querySelectorAll(a);
		return (x.length === 1) ? x[0] : x;
	};

	window.$ = $;
	
	/**
	 * Support
	 *
	 * Module for browser feature detection
	 */
	(function (){
	
		var support = {
			attachEvent: typeof window.attachEvent === "function",
			addEventListener: typeof window.addEventListener === "function",
			querySelector: typeof document.querySelectorAll === "function",
		};
		
		$_.support = support;
		
	}());

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

				var request = (typeof window.XMLHttpRequest === "function") 
					? new XMLHttpRequest() 
					: false;

				var type = (isPost) ? "POST" : "GET";

				url += (type === "GET") ? "?" + this._serialize(data, true) : '';

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
	 * Requires Support module
	 */
	(function (){
	
		var attach, remove, add_remove, e, support;
		
		support = $_.support;

		// Define the proper attach and remove functions
		// based on browser support
		if(support.addEventListener)
		{
			attach = function (sel, event, callback)
			{
				if (typeof sel.addEventListener === "function")
				{
					sel.addEventListener(event, callback, false);
				}
			};
			remove = function (sel, event, callback)
			{
				if (typeof sel.removeEventListener === "function")
				{
					sel.removeEventListener(event, callback, false);
				}
			};
		}
		else if(support.attachEvent)
		{
			attach = function (sel, event, callback)
			{
				function listener () {
					// Internet Explorer fails to correctly set the 'this' object
					// for event listeners, so we need to set it ourselves.
					callback.apply(sel, arguments);
				}
				
				if (typeof sel.attachEvent === "function")
				{
					remove(sel, event, callback); // Make sure we don't have duplicate listeners
					
					sel.attachEvent("on" + event, listener);
					// Store our listener so we can remove it later
					// TODO: Fix memory leak in IE6/7 with event listeners
					var expando = sel[kis_expando] = sel[kis_expando] || {};
					expando.listeners = expando.listeners || {};
					expando.listeners[event] = expando.listeners[event] || [];
					expando.listeners[event].push({
						callback: callback,
						listener: listener
					});
				}
			};
			remove = function (sel, event, callback)
			{
				if(typeof typeof sel.detachEvent === "function")
				{
					var expando = sel[kis_expando];
					if (expando && expando.listeners
							&& expando.listeners[event])
					{
						var listeners = expando.listeners[event];
						for (var i=0; i<listeners.length; i++)
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

			if (!sel)
			{
				return false;
			}

			//Get the DOM object if you give me a selector string
			sel = $(sel);

			//Multiple events? Run recursively!
			event = event.split(" ");

			if (event.length > 1)
			{

				len = event.length;

				for (i = 0; i < len; i++)
				{
					add_remove(sel, event[i], callback, add);
				}

				return;
			}

			//Check for multiple DOM objects
			if (sel.length > 1)
			{
				len = sel.length;
				for (i = 0; i < len; i++)
				{
					(add === true) 
						? attach(sel[i], event, callback) 
						: remove(sel[i], event, callback);
				}
			}
			else
			{
				(add === true) 
					? attach(sel, event, callback) 
					: remove(sel, event, callback);
			}
		};

		e = {
			add: function (sel, event, callback)
			{
				add_remove(sel, event, callback, true);
			},
			remove: function (sel, event, callback)
			{
				add_remove(sel, event, callback, false);
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
				(doAttr === true) 
					? sel.removeAttribute(name) 
					: sel[name] = null;
			}

			return (typeof value !== "undefined") ? value : oldValue;
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
				ec = _attr(sel, "class");
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

		d = {
			each: function (sel, callback)
			{
				if (typeof sel === "string")
				{
					sel = $(sel);
				}
				
				if(!sel.length)
				{
					// sel is a DOM Element
					callback(sel);
				}
				else
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

					for (var x = 0; x < sel.length; x++)
					{
						callback(sel[x]);
					}
				}
			},
			addClass: function (sel, c)
			{
				sel = $(sel);

				this.each(sel, function (e){
					_class(e, c, true);
				});
			},
			removeClass: function (sel, c)
			{
				sel = $(sel);

				this.each(sel, function (e){
					_class(e, c, false);
				});
			},
			hide: function (sel)
			{
				sel = $(sel);

				if (sel.length > 1)
				{
					this.each(sel, function (e){
						e.style.display = "none";
					});
				}
				else
				{
					if (sel.style)
					{
						sel.style.display = "none";
					}
				}

			},
			show: function (sel, type)
			{
				sel = $(sel);

				if (typeof type === "undefined")
				{
					type = "block";
				}

				if (sel.length > 1)
				{
					this.each(sel, function (e){
						e.style.display = type;
					});
				}
				else
				{
					sel.style.display = type;
				}
			},
			attr: function (sel, name, value)
			{
				sel = $(sel);

				//Make sure you don't try to get a bunch of elements
				if (sel.length > 1 && typeof value === "undefined")
				{
					console.log(sel);
					console.log("Must be a singular element");
					return;
				}
				else if (sel.length > 1 && typeof value !== "undefined") //You can set a bunch, though
				{
					this.each(sel, function (e){
						_attr(e, name, value);
					});
				}
				else //Normal behavior
				{
					return _attr(sel, name, value);
				}
			},
			text: function(sel, value)
			{
				var oldValue, set, type;
			
				sel = $(sel);
				
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
			}
		};

		$_.dom = d;
	}());

}());