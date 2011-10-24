/**
 * Util Object
 * 
 * Various object and string manipulation functions
 */
(function(){

	"use strict";

	var u = {
		reverse_key_sort: function(o)
		{
			//Define some variables
			var keys = [],
				num_keys = 0,
				new_o = {},
				i;
		
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
				new_o[keys[i]] = o[keys[i]];
			}
			
			return new_o;
		},
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
		array_combine: function(keys, vals)
		{
			var new_object = {},
				num_keys,
				i = 0;
				
			//Extract the keys or values if needed
			if($_.type(keys) !== "array")
			{
				keys = this.object_values(keys);
			}
			if($_.type(vals) !== "array")
			{
				vals = this.object_values(vals);
			}
			
			//cache the number of keys
			num_keys = keys.length;
			
			if(num_keys !== vals.length)
			{
				console.log("Object combine requires two arrays of the same size");
				return false;
			}
			
			//Create and return the new object
			for(i = 0; i < num_keys; i++)
			{
				new_object[keys[i]] = vals[i];
			}
			
			return new_object;
		},
		object_merge: function()
		{
			var args = Array.prototype.slice.call(arguments),
				arg_len = args.length,
				new_obj = {},
				arg,
				iarg_len = 0,
				i,
				j,
				x,
				is_array = true;
				
			//Check for an array in the arguments
			for(i=0; i < arg_len; i++)
			{
				if($_.type(args[i]) !== "array")
				{
					is_array = false;
					break;
				}
			}
			
			//If all the arguments are javascript arrays
			if(is_array)
			{
				new_obj = [];
				//Let javascript do all the work!
				for(i=0; i< arg_len; i++)
				{
					new_obj = new_obj.contact(args[i]);
				}
				
				//Return early
				return new_obj;
			}
			
			//No, there's at least one object
			for(i=0, x=0; i < arg_len; i++)
			{
				arg = args[i];
				
				// If the argument is an array, add the array items as
				// numeric object properties
				if ($_.type(arg) == "array")
				{
					for (j=0, iarg_len= arg.length; j < iarg_len; j++)
					{
						new_obj[x++] = arg[j];
					}
				}
				else
				{
					for (j in arg)
					{
						if(arg.hasOwnProperty(j))
						{
							// If the key is numeric, add the property with
							// a numeric key
							if(parseInt(j, 10) + '' === j)
							{
								new_obj[x++] = arg[j];
							}
							else
							{
								new_obj[j] = arg[j];
							} 
						}
					}
				} 
			}
			
			return new_obj;
		},
		str_trans: function(string, from, to)
		{
		
		},
		str_replace: function(from, to, string)
		{
		
		}
	};

	//Add it to the $_ object
	$_.ext('util', u);
}());