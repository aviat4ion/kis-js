/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (undefined){

	"use strict";

	var ajax = {
		_do: function (url, data, success_callback, error_callback, isPost)
		{
			var type,
				request = new XMLHttpRequest();

			if (success_callback === undefined)
			{
				/**
				 * @private
				 */
				success_callback = function (){};
			}

			type = (isPost) ? "POST" : "GET";

			if (type === "GET")
			{
				url += (url.match(/\?/))
					? this._serialize(data)
					: "?" + this._serialize(data);
			}

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
						if (error_callback !== undefined)
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
				if ( ! data.hasOwnProperty(name) || $_.type(data[name]) === "function")
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
}());
