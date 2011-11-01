/**
 * Ajax
 *
 * Module for making ajax requests
 */
(function (){

	var ajax = {
		_do: function (url, data, callback, isPost)
		{
			if (typeof callback === "undefined")
			{
				/**
				 * @private
				 */
				callback = function (){};
			}

			var request = (typeof window.XMLHttpRequest !== "undefined") 
				? new XMLHttpRequest() 
				: false;

			var type = (isPost) ? "POST" : "GET";

			url += (type === "GET") ? "?"+this._serialize(data) : '';
			
			request.open(type, url);

			request.onreadystatechange = function ()
			{
				if (request.readyState === 4)
				{
					callback(request.responseText);
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
			var pairs = [];

			for (var name in data)
			{
				if (!data.hasOwnProperty(name))
				{
					continue;
				}
				if (typeof data[name] === "function")
				{
					continue;
				}

				var value = data[name].toString();

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
	 * @param function callback
	 * @return void
	 */
	$_.ext('get', function (url, data, callback){
		ajax._do(url, data, callback, false);
	});
	
	/**
	 * Sends a POST type ajax request
	 * 
	 * @name post
	 * @function
	 * @memberOf $_
	 * @param string url
	 * @param object data
	 * @param function callback
	 * @return void
	 */
	$_.ext('post', function (url, data, callback){
		ajax._do(url, data, callback, true);
	});
}());