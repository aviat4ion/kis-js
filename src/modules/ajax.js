/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (undefined){

	"use strict";

	var ajax = {
		_do: function (url, data, success_callback, error_callback, type)
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

			if (type !== "GET")
			{
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send(this._serialize(data));
			}
			else
			{
				request.send(null);
			}
		},
		/**
		 * Url encoding for non-get requests
		 *
		 * @param data
		 * @returns {string}
		 * @private
		 */
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
	 * @function get
	 * @memberOf $_
	 * @param {string} url - The url to retrieve
	 * @param {Object} data - get parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('get', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'GET');
	});

	/**
	 * Sends a POST type ajax request
	 *
	 * @function post
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - post parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('post', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'POST');
	});

	/**
	 * Sends a PUT type ajax request
	 *
	 * @function put
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - PUT parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('put', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'PUT');
	});

	/**
	 * Sends a DELETE type ajax request
	 *
	 * @function delete
	 * @memberOf $_
	 * @param {string} url - The url to post to
	 * @param {Object} data - delete parameters to send
	 * @param {function} success_callback - callback called on success
	 * @param {function} [error_callback] - callback called if there is an error
	 */
	$_.ext('delete', function (url, data, success_callback, error_callback){
		ajax._do(url, data, success_callback, error_callback, 'DELETE');
	});
}());
