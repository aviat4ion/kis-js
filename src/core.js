/**
	Kis JS		Keep It Simple JS Library
	Copyright	Timothy J. Warren
	License		Public Domain
	Version		0.2.0
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
	$_ = function(s)
	{
		//Have documentElement be default selector, just in case
		if(typeof s == "undefined")
		{
			sel = (typeof $_.el !== "undefined") 
				? $_.el
				: document.documentElement;
		}
		else
		{
			sel = $(s);
		}

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
		$_[name] = obj;
		obj.el = sel;
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