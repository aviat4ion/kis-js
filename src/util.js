/**
 * Util Object
 * 
 * Various object and string manipulation functions
 */
(function(){
	var u = {
		object_keys: function(o)
		{
			var keys = [],
				key;
				
			for(key in o)
			{
				if(o.hasOwnProperty(key))
				{
					keys.push(key);
				}
			}
			
			return keys;
		},
		object_values: function(o)
		{
			var vals = [],
				prop;
			
			for(prop in o)
			{
				vals.push(o[prop]);
			}
			
			return vals;
		}
		
	};

	//Add it to the $_ object
	$_.ext('util', u);
}());