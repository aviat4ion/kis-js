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