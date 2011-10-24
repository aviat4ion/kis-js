/**
 * Qs
 *
 * Object for encoding and decoding querystrings and hashbang strings
 */
(function (){

	$_.hb = (history.pushState) ? false : true;

	var qs = {
		parse: function (hb)
		{
			hb = hb || $_.hb;
			
			var h, i, hString, pairs, pLen, data, y;

			data = {};

			if (hb === true)
			{
				h = location.hash.split('#!/');
				hString = (h.length > 1) ? h[1] : '';
			}
			else if (hb === false || hb === undefined)
			{
				hString = window.location.search.substring(1);
			}
			else
			{
				return false;
			}

			pairs = hString.split('&');

			pLen = pairs.length;

			for (i = 0; i < pLen; i++)
			{
				y = pairs[i].split('=');

				if (y.length < 2)
				{
					return data;
				}

				data[y[0]] = y[1];
			}

			return data;
		},
		set: function (key, value, hb)
		{
			hb = hb || $_.hb;
			var pairs = this.parse(hb);

			if (key !== undefined && value !== undefined)
			{
				pairs[key] = value;
			}

			var vars = [];

			for (var x in pairs)
			{
				if (pairs.hasOwnProperty(x))
				{
					vars.push(x + '=' + pairs[x]);
				}
			}

			var qs = vars.join('&');

			if (hb === true)
			{
				qs = '!/' + qs;
				location.hash = qs;
			}

			return qs;
		},
		get: function (key, hb)
		{
			hb = hb || $_.hb;
			var pairs = this.parse(hb);
			return (pairs[key]) ? pairs[key] : '';
		}
	};

	$_.ext('qs', qs);

}());
