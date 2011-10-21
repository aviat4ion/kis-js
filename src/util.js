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
				k;
				
			for(k in o)
			{
				if(o.hasOwnProperty(k))
				{
					keys.push(k);
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
		},
		object_merge: function()
		{
		
		},
		reverse_key_sort: function(o)
		{
			//Define some variables
			var keys = [],
				num_keys = 0,
				new_o = {},
				i, 
				k,
				x;
		
			//Extract the keys
			keys = this.object_keys(o);
			
			//Sort the keys
			keys.sort(function (b, a) {
			
	            var aFloat = parseFloat(a),
	                bFloat = parseFloat(b),
	                aNumeric = aFloat + '' === a,
	                bNumeric = bFloat + '' === b;
	            
	            if (aNumeric && bNumeric) 
	            {
	                return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
	            } 
	            else if (aNumeric && !bNumeric) 
	            {
	                return 1;
	            } 
	            else if (!aNumeric && bNumeric) 
	            {
	                return -1;
	            }
	           
	            return a > b ? 1 : a < b ? -1 : 0;
			});
			
			//cache object/array size
			num_keys = keys.length;
			
			//Recreate the object/array
			for(i=0; i < num_keys; i++)
			{
				k = keys[i];
				new_o[k] = o[k];
			}
			
			return new_o;
		},
		str_trans: function(string, from, to)
		{
		
		}
	};

	//Add it to the $_ object
	$_.ext('util', u);
}());