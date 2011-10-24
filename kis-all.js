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
 * Note: these are based on similar phpjs functions: http://phpjs.org
 */
(function(){

	"use strict";

	var u = {
		reverse_key_sort: function(o)
		{
			//Define some variables
			var keys = [],
				num_keys = 0,
				new_o = {},
				i;
		
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
				new_o[keys[i]] = o[keys[i]];
			}
			
			return new_o;
		},
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
		array_combine: function(keys, vals)
		{
			var new_object = {},
				num_keys,
				i = 0;
				
			//Extract the keys or values if needed
			if($_.type(keys) !== "array")
			{
				keys = this.object_values(keys);
			}
			if($_.type(vals) !== "array")
			{
				vals = this.object_values(vals);
			}
			
			//cache the number of keys
			num_keys = keys.length;
			
			if(num_keys !== vals.length)
			{
				console.log("Object combine requires two arrays of the same size");
				return false;
			}
			
			//Create and return the new object
			for(i = 0; i < num_keys; i++)
			{
				new_object[keys[i]] = vals[i];
			}
			
			return new_object;
		},
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
				
			//Check for an array in the arguments
			for(i=0; i < arg_len; i++)
			{
				if($_.type(args[i]) !== "array")
				{
					is_array = false;
					break;
				}
			}
			
			//If all the arguments are javascript arrays
			if(is_array)
			{
				new_obj = [];
				//Let javascript do all the work!
				for(i=0; i< arg_len; i++)
				{
					new_obj = new_obj.contact(args[i]);
				}
				
				//Return early
				return new_obj;
			}
			
			//No, there's at least one object
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
				from = this.reverse_key_sort(from);
				
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
						/*if(from_len !== to_len)
						{
							//Double check matches when the strings are different lengths
							
						}
						else
						{*/
							if(strx == from.charAt(j))
							{
								match = true;
								break;
							}
						//}
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

function strtr (str, from, to) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +      input by: uestla
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alan C
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Taras Bogach
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: jpfle
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -   depends on: krsort
    // -   depends on: ini_set
    // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
    // *     example 1: strtr('hi all, I said hello', $trans)
    // *     returns 1: 'hello all, I said hi'
    // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
    // *     returns 2: 'aaabaaccasdeooo'
    // *     example 3: strtr('ääääääää', 'ä', 'a');
    // *     returns 3: 'aaaaaaaa'
    // *     example 4: strtr('http', 'pthxyz','xyzpth');
    // *     returns 4: 'zyyx'
    // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
    // *     returns 5: 'http'
    // *     example 6: strtr('aa', {'a':1,'aa':2});
    // *     returns 6: '2'
    var fr = '',
        i = 0,
        j = 0,
        lenStr = 0,
        lenFrom = 0,
        tmpStrictForIn = false,
        fromTypeStr = '',
        toTypeStr = '',
        istr = '';
    var tmpFrom = [];
    var tmpTo = [];
    var ret = '';
    var match = false;

    // Received replace_pairs?
    // Convert to normal from->to chars
    if (typeof from === 'object') {
        //tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
        from = this.krsort(from);
        //this.ini_set('phpjs.strictForIn', tmpStrictForIn);

        for (fr in from) {
            if (from.hasOwnProperty(fr)) {
                tmpFrom.push(fr);
                tmpTo.push(from[fr]);
            }
        }

        from = tmpFrom;
        to = tmpTo;
    }

    // Walk through subject and replace chars when needed
    lenStr = str.length;
    lenFrom = from.length;
    fromTypeStr = typeof from === 'string';
    toTypeStr = typeof to === 'string';

    for (i = 0; i < lenStr; i++) {
        match = false;
        if (fromTypeStr) {
            istr = str.charAt(i);
            for (j = 0; j < lenFrom; j++) {
                if (istr == from.charAt(j)) {
                    match = true;
                    break;
                }
            }
        } else {
            for (j = 0; j < lenFrom; j++) {
                if (str.substr(i, from[j].length) == from[j]) {
                    match = true;
                    // Fast forward
                    i = (i + from[j].length) - 1;
                    break;
                }
            }
        }
        if (match) {
            ret += toTypeStr ? to.charAt(j) : to[j];
        } else {
            ret += str.charAt(i);
        }
    }

    return ret;
}

function krsort (inputArr) {
    // http://kevin.vanzonneveld.net
    // +   original by: GeekFG (http://geekfg.blogspot.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: The examples are correct, this is a new way
    // %        note 2: This function deviates from PHP in returning a copy of the array instead
    // %        note 2: of acting by reference and returning true; this was necessary because
    // %        note 2: IE does not allow deleting and re-adding of properties without caching
    // %        note 2: of property position; you can set the ini of "phpjs.strictForIn" to true to
    // %        note 2: get the PHP behavior, but use this only if you are in an environment
    // %        note 2: such as Firefox extensions where for-in iteration order is fixed and true
    // %        note 2: property deletion is supported. Note that we intend to implement the PHP
    // %        note 2: behavior by default if IE ever does allow it; only gives shallow copy since
    // %        note 2: is by reference in PHP anyways
    // %        note 3: Since JS objects' keys are always strings, and (the
    // %        note 3: default) SORT_REGULAR flag distinguishes by key type,
    // %        note 3: if the content is a numeric string, we treat the
    // %        note 3: "original type" as numeric.
    // -    depends on: i18n_loc_get_default
    // *     example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
    // *     example 1: data = krsort(data);
    // *     results 1: {d: 'lemon', c: 'apple', b: 'banana', a: 'orange'}
    // *     example 2: ini_set('phpjs.strictForIn', true);
    // *     example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};
    // *     example 2: krsort(data);
    // *     results 2: data == {3: 'Kevin', 2: 'van', 1: 'Zonneveld'}
    // *     returns 2: true
    var tmp_arr = {},
        keys = [],
        sorter, i, k, that = this,
        strictForIn = false,
        populateArr = {};

        //sorter = ;

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    
    keys.sort(function (b, a) {
	    var aFloat = parseFloat(a),
	        bFloat = parseFloat(b),
	        aNumeric = aFloat + '' === a,
	        bNumeric = bFloat + '' === b;
	    if (aNumeric && bNumeric) {
	        return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
	    } else if (aNumeric && !bNumeric) {
	        return 1;
	    } else if (!aNumeric && bNumeric) {
	        return -1;
	    }
	    return a > b ? 1 : a < b ? -1 : 0;
    });


    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
    }
    for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
        }
    }

    return populateArr;
}


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
