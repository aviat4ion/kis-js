/**
 * A module of various browser polyfills
 * @file polyfill.js
 */

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
 * Array.isArray polyfill
 */
if (typeof Array.isArray === "undefined")
{
	Array.isArray = function(v)
	{
		return Object.prototype.toString.apply(v) === '[object Array]';
	}
}