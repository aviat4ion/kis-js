/**
	Kis JS		Keep It Simple JS Library
 	Copyright	Timothy J. Warren
 	License		Public Domain
 	Version		0.1.0
*/

(function(){

	"use strict";
	
	var $_, $, _sel;
	
	$_ = {};
	
	window.$_ = window.$_ || $_;
	
	/**
	 * $
	 *
	 * Simple DOM selector function
	 */
	$ = function(a)
	{
		var x = document.querySelectorAll(a);
		return (x.length === 1) ? x[0] : x;
	};
	
	/**
	 * _sel
	 *
	 * Return the selector for the string
	 */
	_sel = function(s)
	{
		return (typeof s === "string") ? $(s) : s;
	};
	
	window.$ = $;
	
	//Console.log will contain error messages: if it doesn't exist, create a dummy method
	if(typeof window.console === "undefined")
	{
		window.console = {
			log: function(){}
		};
	}

	
	/**
	 * Ajax 
	 *
	 * Object for making ajax requests
	 */
	(function() {
		var $_ = $_ || {};
		var ajax = {
			_req: function()
			{
				return (window.XMLHttpRequest) 
					? new XMLHttpRequest()
					: new ActiveXObject("Microsoft.XMLHTTP");
			},
			_do: function(url, data, callback, isPost)
			{
				var request = this._req();
				var type = (isPost) ? "POST" : "GET";
				
				url += (type === "GET") 
					? "?" + this._serialize(data, true)
					: ''; 
					
				request.open(type, url);
				
				request.onreadystatechange = function(){
					if(request.readyState === 4)
					{
						callback(request.responseText);
					}
				};
				
				if(type === "POST")
				{
					request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					request.send(this._serialize(data));
				}
				else
				{
					request.send(null);
				}
			},
			_serialize: function(data, encode)
			{
				var pairs = [];
				
				for (var name in data)
				{
					if(!data.hasOwnProperty(name)){ continue; };
					if(typeof data[name] === "function"){ continue; };
					
					var value = data[name].toString();
					
					if(encode === true)
					{
						name = encodeURIComponent(name.replace(" ", "+"));
						value = encodeURIComponent(value.replace(" ","+"));
					}
					
					pairs.push(name + "=" + value);
				}
				
				return pairs.join("&");
			}
		};
		
		window.$_.get = function(url, data, callback)
		{
			ajax._do(url, data, callback, false);
		};
		
		window.$_.post = function(url, data, callback)
		{
			ajax._do(url, data, callback, true);
		};
	}());
	
	/**
	 * Qs
	 * 
	 * Object for encoding and decoding querystrings and hashbang strings
	 */
	(function(){
	
		window.$_.hb = (history.pushState) ? false : true;
	
		var qs = {
			parse: function(hb)
			{
				hb = hb || $_.hb;
				var h, i, hString, pairs, pLen, data, y;
				
				data = {};
	
				if(hb === true)
				{
					h = location.hash.split('#!/');
					hString = (h.length > 1) ? h[1] : '';
				}
				else if(hb === false || hb === undefined)
				{
					hString = window.location.search.substring(1);
				}
				else
				{
					return false;
				}
				
				pairs = hString.split('&');
				
				pLen = pairs.length;
				
				for(i=0;i<pLen;i++)
				{
					y = pairs[i].split('=');
					
					if(y.length < 2)
					{
						return data;
					}
					
					data[y[0]] = y[1];
				}
				
				return data;
			},
			set: function(key, value, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);
				
				if(key !== undefined && value !== undefined)
				{
					pairs[key] = value;
				}
			
				var vars = [];
				
				for (var x in pairs)
				{
					if(pairs.hasOwnProperty(x))
					{
						vars.push(x+'='+pairs[x]);
					}
				}
	
				var qs = vars.join('&');
				
				if(hb === true)
				{
					qs = '!/'+ qs;
					location.hash = qs;
				}
				
				return qs;
			},
			get: function(key, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);
				return (pairs[key]) ? pairs[key] : '';
			}
		};
		
		window.$_.qs = qs;
		
	}());
	
	/**
	 * Store object
	 * 
	 * Wrapper for localstorage data serialization
	 */
	(function(){
		var store = {
			get: function(key)
			{
				return JSON.parse(localStorage.getItem(key));
			},
			set: function(key, value)
			{
				if(typeof value !== "string")
				{
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			},
			getAll: function()
			{
				var i, len, data;
				len = localStorage.length;
				data = {};
				
				for(i=0;i<len;i++)
				{
					var name = localStorage.key(i);
					var value = localStorage.getItem(name);
					data[name] = value;
				}
				
				return data;
			}
		};
		
		window.$_.store = store;
	}());
	
	/**
	 * Event object
	 *
	 * Event api wrapper
	 */
	 (function(){
	 	var attach, remove, add_remove, e;
	 	
	 	if(document.addEventListener)
	 	{
	 		attach = function(sel, event, callback)
	 		{
	 			if(sel.addEventListener)
	 			{
	 				sel.addEventListener(event, callback, false);
	 			}
	 		};
	 		
	 		remove = function(sel, event, callback)
	 		{
	 			if(sel.removeEventListener)
	 			{
	 				sel.removeEventListener(event, callback, false);
	 			}
	 		};	
	 	}
	 	else
	 	{
	 		attach = function(sel, event, callback)
	 		{
	 			if(sel.attachEvent)
	 			{
	 				sel.attachEvent("on"+event, callback);
	 			}
	 		};
	 		
	 		remove = function(sel, event, callback)
	 		{
	 			if(sel.detachEvent)
	 			{
	 				sel.detachEvent("on"+event, callback);
	 			}
	 		};
	 	}
	 	
	 	add_remove = function (sel, event, callback, add)
	 	{
	 		var i,len;
	 			
 			if(!sel)
 			{
 				return false;
 			}
 			
 			//Get the DOM object if you give me a selector string
 			sel = _sel(sel);
 			
 			//Multiple events? Run recursively!
 			event = event.split(" ");
 			
 			if(event.length > 1)
 			{
 				
 				len = event.length;
 				
 				for(i=0;i<len;i++)
 				{
 					add_remove(sel, event[i], callback, add);
 				}
 				
 				return;
 			}
 		
 			//Check for multiple DOM objects
 			if(sel.length > 1)
 			{
 				len = sel.length;
 				for(i=0;i<len;i++)
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
	 		add: function(sel, event, callback)
	 		{
	 			add_remove(sel, event, callback, true);
	 		},
	 		remove: function(sel, event, callback)
	 		{
	 			add_remove(sel, event, callback, false);
	 		}
	 	};
	 	
	 	window.$_.event = e;
	 	
	 }());
	 
	/**
	 * Dom manipulation object
	 *
	 */
	(function(){
	 	var d, len;
	 	
	 	// Private function for class manipulation
	 	function _class(sel, c, add)
	 	{
	 		var ec, cs, len, i, classInd;
	 		
	 		//We can do this the easy way
	 		if(sel.classList)
	 		{
	 			if(add === true)
	 			{
	 				sel.classList.add(c);
	 				return; 
	 			}
	 			else if(add === false)
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
		 		if(typeof ec === "string")
		 		{
			 		cs = (ec !== '') ? ec.split(" ") : [];
			 	
			 		len = cs.length;
			 		classInd = false;
			 		
			 		//Check for the class in the array
			 		for(var i=0;i<len;i++)
			 		{
			 			if(cs[i] === c)
			 			{
			 				classInd = i;
			 				break;
			 			}
			 		}
	 			}
	 			
	 			//Add or remove from class array
	 			if(add === true)
	 			{
					//Only add the class if isn't already there
	 				if(classInd === false)
					{
						cs.push(c);
					}
	 			}
				else if(add === false)
				{
					//Make sure the class you want to remove exists
					if(classInd !== false)
	 				{	
						cs.splice(classInd, 1);
					}
	 			}
	 			
	 			var cName = (cs.length > 1) ? cs.join(" ") : cs[0];
				
				//Check if trim method exists
				if(cName.trim)
				{
					cName = cName.trim();
				}
				
				if(typeof sel.className !== "undefined")
				{
					sel.className = cName;
				}
				else if(typeof sel.setAttribute !== "undefined")
				{
					sel.setAttribute('class', cName)
				}
				else
				{
					console.log(sel);
				}
	 			
	 			return cName;
 			}
	 		
	 	}
	 	
	 	//Private function for getting/setting attributes
	 	function _attr(sel, name, value)
	 	{
	 		var oldVal, doAttr;
	 	
	 		//Get the value of the attribute, if it exists
			if(typeof sel.hasAttribute !== "undefined")
			{
				if(sel.hasAttribute(name))
				{
					oldVal = sel.getAttribute(name);
				}
				
				doAttr = true;	
			}
			else if(typeof sel[name] !== "undefined")
			{
				oldVal = sel[name];
				doAttr = false;
			}
			else if(name === "class" && typeof sel.className !== "undefined") //className attribute
			{
				name = "className";
				oldVal = sel.className;
				doAttr = false;
			}
			
			//Well, I guess that attribute doesn't exist
			if(typeof oldVal === "undefined" && (typeof value === "undefined" || value === null))
			{
				console.log(sel);
				console.log("Element does not have the selected attribute");
				return;
			}
			
			//No value to set? Return the current value
			if(typeof value === "undefined")
			{
				return oldVal;
			}
			
 			//Determine what to do with the attribute
 			if(typeof value !== "undefined" && value !== null)
 			{
 				(doAttr === true)
 					? sel.setAttribute(name, value)
 					: sel[name] = value;
 			}
 			else if(value === null)
 			{
 				(doAttr === true)
 					? sel.removeAttribute(name)
 					: sel[name] = null;
 			}
 			
 			return (typeof value !== "undefined") ? value : oldValue; 
	 	}
	 	
	 	d = {
	 		each: function(sel, callback)
	 		{
	 			if(typeof sel === "string")
	 			{
	 				sel = $(sel);
	 			}
	 			
	 			var len = sel.length;
	 			
	 			if(len === 0){ return }
	 			
	 			if(len === 1){ return callback(sel); }
	 			
	 			for(var x=0;x<sel.length;x++)
	 			{
	 				callback(sel[x]);
	 			}
	 		},
	 		addClass: function(sel, c)
	 		{
	 			sel = _sel(sel);

	 			this.each(sel, function(e){
	 				_class(e, c, true);
	 			});
	 		},
	 		removeClass: function(sel, c)
	 		{
	 			sel = _sel(sel);
	 		
	 			this.each(sel, function(e){
	 				_class(e, c, false);
	 			});
	 		},
	 		hide: function(sel)
	 		{
	 			sel = _sel(sel);
	 			
	 			if(sel.length > 1)
	 			{
		 			this.each(sel, function(e){
		 				e.style.display = "none";
		 			});
		 		}
		 		else
		 		{
		 			if(sel.style)
		 			{
		 				sel.style.display = "none";
		 			}
		 		}
	 			
	 		},
	 		show: function(sel, type)
	 		{
	 			sel = _sel(sel);
	 		
	 			if(typeof type === "undefined")
	 			{
	 				type="block";
	 			}
	 			
	 			if(sel.length > 1)
	 			{
		 			this.each(sel, function(e){
		 				e.style.display = type;
		 			});
		 		}
		 		else
		 		{
		 			sel.style.display = type;
		 		}
	 		},
	 		attr: function(sel, name, value)
	 		{
	 			var oldVal;
	 			
	 			sel = _sel(sel);
	 			
	 			//Make sure you don't try to get a bunch of elements
	 			if(sel.length > 1 && typeof value === "undefined")
	 			{	
	 				console.log(sel);
	 				console.log("Must be a singular element");
	 				return;
	 			}
	 			else if(sel.length > 1 && typeof value !== "undefined") //You can set a bunch, though
	 			{
	 				this.each(sel, function(e){
	 					_attr(e, name, value);
	 				});
	 			}
	 			else //Normal behavior
	 			{
	 				return _attr(sel, name, value);
	 			}
	 		}
	 	};
	 	
	 	window.$_.dom= d;
	 }());
	 
})();