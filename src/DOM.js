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
	var d, tag_reg, id_reg, class_reg;
	
	tag_reg = /^([\w\-]+)$/;
	id_reg = /#([\w\-]+$)/;
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
		}
		
		
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
	
	function _sel_filter(filter, curr_sel)
	{
		var i,
			len = curr_sel.length,
			matches = [];
		
		if(typeof filter !== "string")
		{
			return filter;
		}
	
		//Filter by tag
		if(filter.match(tag_reg))
		{
			for(i=0;i<len;i++)
			{
				if(curr_sell[i].tagName.toLowerCase() == filter.toLowerCase())
				{
					matches.push(curr_sel[i]);
				}
			}
		}
		else if(filter.match(class_reg))
		{
			for(i=0;i<len;i++)
			{
				if(curr_sel[i].classList.contains(filter))
				{
					matches.push(curr_sel[i]);
				}
			}
		}
		else if(filter.match(id_reg))
		{
			return document.getElementById(filter);
		}
		else
		{
			console.log(filter+" is not a valid filter");
		}
		
		return (matches.length === 1) ? matches[0] : matches;
		
	}
	
	function _set_sel(sel)
	{
		for(var i in $_) 
		{
			if(typeof $_[i] === "object" || typeof $_[i] === "function")
			{
				$_[i].el = sel;
			}	
		}
		
		return $_;
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
		}, 
		children: function(filter)
		{
			var sel;
		
			if(typeof sel === "undefined")
			{
				sel =  this.el.children;
			}
			else
			{
				sel = _sel_filter(filter, this.el.children);
			}
		
			//Update the $_ object to reflect the new selector
			$_ = _set_sel(sel);

			//Return the $_ object for chaining
			return $_;
		}
	};

	$_.ext('dom', d);
	
}());
