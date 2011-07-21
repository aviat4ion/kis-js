/**
 * Store object
 *
 * Wrapper for localstorage data serialization
 */
(function (){
	var store = {
		get: function (key)
		{
			return JSON.parse(localStorage.getItem(key));
		},
		set: function (key, value)
		{
			if (typeof value !== "string")
			{
				value = JSON.stringify(value);
			}
			localStorage.setItem(key, value);
		},
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