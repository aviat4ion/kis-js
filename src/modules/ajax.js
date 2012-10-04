/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (){

	"use strict";

	// Don't bother even defining the object if the XMLHttpRequest isn't available
	if(typeof window.XMLHttpRequest === "undefined")
	{
		return;
	}

	var ajax = {
		_do: function (url, data, success_callback, error_callback, isPost)
		{
			var type,
				request = new XMLHttpRequest();

			if (typeof success_callback === "undefined")
			{
				/**
				 * @private
				 */
				success_callback = function (){};
			}

			type = (isPost) ? "POST" : "GET";

			url += (type === "GET") ? "?" + this._serialize(data) : '';

			request.open(type, url);

			request.onreadystatechange = function ()
			{
				if (request.readyState === 4)
				{
					if (request.status === 200)
					{
						success_callback.call(request.responseText, request.responseText);
					}
					else
					{
						if (typeof error_callback !== 'undefined')
						{
							error_callback.call(request.status, request.status);
						}
					}

				}
			};

			if (type === "POST")
			{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(this._serialize(data));
			}
			else
			{
				request.send(null);
			}
		},
		_serialize: function (data)
		{
			var name,
				value,
				pairs = [];

			for (name in data)
			{
				if (!data.hasOwnProperty(name))
				{
					continue;
				}
				if (typeof data[name] === "function")
				{
					continue;
				}

				value = data[name].toString();

				name = encodeURIComponent(name);
				value = encodeURIComponent(value);

				pairs.push(name + "=" + value);
			}

			return pairs.join("&");
		}
	};

	/**
	 * Sends a GET type ajax request
	 *
	 * @name get
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function success_callback
	 * @param function error_callback
	 */
	$_.ext('get', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, false);
	});

	/**
	 * Sends a POST type ajax request
	 *
	 * @name post
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function success_callback
	 * @param function error_callback
	 */
	$_.ext('post', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, true);
	});

	/**
	 * Watches for server-sent events and applies a callback on message
	 *
	 * @name sse
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param function callback
	 */
	$_.ext('sse', function(url, callback){

		var source;

		// Check for server-sent event support
		if (typeof EventSource !== 'undefined')
		{
			source = new EventSource(url);

			// Apply the callback
			source.onmessage = function(event){
				callback.call(event.data, event.data);
			};
		}
	});

}());