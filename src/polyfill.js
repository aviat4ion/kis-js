/**
 * A module of various browser polyfills
 * @file polyfill.js
 */
(function(){

	"use strict";
 
	// Console.log polyfill for IE 8 stupidity
	if(typeof window.console === "undefined")
	{
		window.console = {
			log:function(){}
		};
	}
	
	// --------------------------------------------------------------------------
	
	/**
	 * String trim function polyfill
	 */
	if(typeof String.prototype.trim === "undefined")
	{
		/**
		 * @private
		 */
		String.prototype.trim = function()
		{
			return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
		};
	}

	// --------------------------------------------------------------------------
	
	/**
	 * event.preventDefault/e.stopPropagation polyfill
	 * @private
	 */
	if(typeof Event.preventDefault === "undefined" && typeof window.event !== "undefined")
	{
		Event.prototype.preventDefault = function() 
		{
			window.event.returnValue = false;
		},
		Event.prototype.stopPropagation = function()
		{
			window.event.cancelBubble = true;
		}	
	}
	
}());