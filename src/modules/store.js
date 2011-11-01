(function (){
	"use strict";

	/**
	 * Wrapper for localstorage data serialization
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
		 * @name get
		 * @memberOf $_.store
		 * @function
		 * @return object
		 */
		get: function (key)
		{
			return JSON.parse(localStorage.getItem(key));
		},
		/**
		 * Puts a value into localstorage at the specified key,
		 * and JSON-encodes the value if not a string
		 *
		 * @param string key
		 * @param mixed value
		 * @name set
		 * @memberOf $_.store
		 * @function
		 * @return void
		 */
		set: function (key, value)
		{
			if (typeof value !== "string")
			{
				value = JSON.stringify(value);
			}
			localStorage.setItem(key, value);
		},
		/**
		 * Removes the specified item from localstorage
		 * 
		 * @param string key
		 * @name remove
		 * @memberOf $_.store
		 * @function
		 * @return void 
		 */
		remove: function (key)
		{
			localStorage.removeItem(key);
		},
		/**
		 * Returns an array of all the values in localstorage
		 * in their raw form
		 * 
		 * @name getAll
		 * @member of $_.store
		 * @function
		 * @return object
		 */
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