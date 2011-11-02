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

(function (){

	"use strict";

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
		 * @return void
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
		 * @return void
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
		 * @return void
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
		 * @return void
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
		 * @param string value
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
		 * @memberOf $_.util
		 * @function
		 * @param [string] value
		 * @returns string
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
		 * @memberOf $_.util
		 * @function
		 * @param string property
		 * @param [string] value
		 * @returns string
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
		}
	};

	$_.ext('dom', d);
	
}());
