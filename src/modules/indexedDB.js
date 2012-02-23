/**
 * Module for simplifying Indexed DB access
 */
(function() {
	"use strict";
	
	var db = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB,
		indexedDB = {};
		
	//Well, some browsers don't support it yet
	if(typeof db === "undefined")
	{
		return;
	}

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
			var request = {};
		
			version = version || 0;
			
			// Ask for permission to use db
			request = db.open(dbname, version);
			
			// Assign onupgradeneeded callback
			if(typeof onupgradeneeded !== "undefined")
			{
				request.onupgradeneeded = onupgradeneeded;
			}
			
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
		}
	};
	
	$_.ext('indexedDB', indexedDB);
	
}());