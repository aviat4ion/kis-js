/**
 * Store
 *
 * Wrapper for local / sessionstorage
 */
(function (){

	"use strict";

	//No support for localstorage? Bail out early
	if(typeof localStorage === "undefined" || typeof JSON === "undefined")
	{
		return null;
	}

	//Shortcuts for wrapper
	var l = localStorage,
		s = sessionStorage;

	/**
	 * Wrapper for localstorage / sessionstorage data serialization.
	 * Each method has a boolean parameter, that when set as true switches the method
	 * to use sessionStorage rather than the default localStorage.
	 *
	 * @name store
	 * @namespace
	 * @memberOf $_
	 */
	var store = {
		/**
		 * Retrieves and deserializes a value from localstorage,
		 * based on the specified key
		 *
		 * @param string key
		 * @param bool session
		 * @name get
		 * @memberOf $_.store
		 * @function
		 * @return object
		 * @type object
		 */
		get: function (key, sess)
		{
			var val = (sess) ? s.getItem(key) : l.getItem(key);

			return JSON.parse(val);
		},
		/**
		 * Puts a value into localstorage at the specified key,
		 * and JSON-encodes the value if not a string
		 *
		 * @param string key
		 * @param mixed value
		 * @param bool session
		 * @name set
		 * @memberOf $_.store
		 * @function
		 */
		set: function (key, value, sess)
		{
			// Localstorage generally only accepts strings
			value = JSON.stringify(value);

			(sess) ? s.setItem(key, value) : l.setItem(key, value);
		},
		/**
		 * Removes the specified item from storage
		 *
		 * @param string key
		 * @param bool session
		 * @name remove
		 * @memberOf $_.store
		 * @function
		 */
		remove: function (key, sess)
		{
			(sess) ? s.removeItem(key) : l.removeItem(key);
		},
		/**
		 * Returns an object of all the raw values in storage
		 *
		 * @param bool session
		 * @name getAll
		 * @memberOf $_.store
		 * @function
		 * @return object
		 * @type object
		 */
		getAll: function (sess)
		{
			var i,
				len,
				data = {},
				k,
				o;

			//Reference to session/localstorage
			o = (sess) ? l : s;

			len = o.length;

			for (i = 0; i < len; i++)
			{
				k = o.key(i);
				data[k] = o.getItem(k);
			}

			return data;
		},
		/**
		 * Removes all values from the same domain storage
		 *
		 * @param bool session
		 * @name clear
		 * @memberOf $_.store
		 * @function
		 */
		clear: function(sess)
		{
			(sess) ? s.clear() : l.clear();
		}
	};

	$_.ext('store', store);
}());