/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.8.0
 */
(function (undefined){

	"use strict";

	var $_, $, sel;


	/**
	 * $_
	 *
	 * Constructor function
	 *
	 * @constructor
	 * @namespace $_
	 * @param {string} selector - The dom selector string
	 * @param {Object} [context] - Context of the dom selector string
	 * @return {Object}
	 */
	$_ = function(s, context)
	{
		// Have documentElement be default selector, just in case
		if (s === undefined)
		{
			// Defines a "global" selector for that instance
			sel = ($_.el !== undefined)
				? $_.el
				: document.documentElement;
		}
		else
		{
			sel = $(s, context);
		}

		// Add the selector to the prototype
		$_.prototype.el = sel;

		// Use the $_ object as it's own prototype
		var self = Object.create($_);

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
	 * @param {string} selector
	 * @param {Object} [context]
	 * @return {Object}
	 */
	$ = function (selector, context)
	{
		var elements;

		if (typeof selector != "string" || selector === undefined){ return selector;}

		//Check for a context of a specific element, otherwise, just run on the document
		context  = (context != null && context.nodeType === 1)
			? context
			: document;

		//Pick the quickest method for each kind of selector
		if (selector.match(/^#([\w\-]+$)/))
		{
			return document.getElementById(selector.split('#')[1]);
		}
		else
		{
			elements = context.querySelectorAll(selector);
		}

		//Return the single object if applicable
		return (elements.length === 1) ? elements[0] : elements;
	};

	/**
	 * Adds the property `obj` to the $_ object, calling it `name`
	 *
	 * @param {string} name - name of the module
	 * @param {object} obj - the object to add
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
	 * @param {function} callback - iteration callback
	 */
	$_.ext('each', function (callback)
	{
		if(sel.length !== undefined && sel !== window)
		{
			[].forEach.call(sel, callback);
		}
		else
		{
			callback.call(sel, sel);
		}
	});

	/**
	 * Retrieves the type of the passed variable
	 *
	 * @param {*} obj
	 * @return {string}
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
