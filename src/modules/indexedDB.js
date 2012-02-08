/**
 * Module for simplifying Indexed DB access
 */
(function() {
	"use strict";
	
	var db = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB,
		request = null;
		indexedDB = {};
	
	/**
	 * @private
	 */	
	request.onerror = function(event)
	{
		console.log("IndexedDB disallowed.");
	};
	
	/**
	 * @private
	 */
	request.onsuccess = function(event)
	{
		// Connect to the specified db
		indexedDB.current_db = request.result;
	};

	/**
	 * Module for simplifying Indexed DB access
	 *
	 * @namespace
	 * @name indexedDB
	 * @memberOf $_
	 */
	indexedDB = {
		current_db: null,
		/**
		 * Connects to an indexedDB database
		 *
		 * @memberOf $_.indexedDB
		 * @name connect
		 * @function
		 * @param string dbname
		 * @param [int] version
		 * @param [function] onupgradeneeded
		 */
		connect: function(dbname, version, onupgradeneeded)
		{
			version = version || 0;
			
			if(typeof onupgradeneeded !== "undefined")
			{
				request.onupgradeneeded = onupgradeneeded;
			}
		
			// Ask for permission to use db
			this.current_db = db.open(dbname, version);
		}
	};
	
	$_.ext('indexedDB', indexedDB);
	
}());