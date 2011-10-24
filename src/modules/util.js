/**
 * Util Object
 * 
 * Various object and string manipulation functions
 * Note: these are based on similar phpjs functions: http://phpjs.org
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
		str_trans: function(str, from, to)
		{
			var froms = [],
				tos = [],
				ret = '',
				match = false,
				from_len = 0,
				str_len = 0,
				to_len = 0,
				to_is_str = '',
				from_is_str = '',
				strx = '',
				strw = '',
				stry = '',
				from_strx = '',
				new_str = '',
				f,
				i,
				j;
				
			//Replace pairs? add them to the internal arrays
			if(typeof from === 'object')
			{
				// Sort the keys in descending order for better
				// replacement functionality
				from = this.reverse_key_sort(from);
				
				for(f in from)
				{
					if(from.hasOwnProperty(f))
					{
						froms.push(f);
						tos.push(from[f]);
					}
				}
				
				from = froms;
				to = tos;
			}
			
			//Go through the string, and replace characters as needed
			str_len = str.length;
			from_len = from.length;
			to_len = to.length;
			to_is_str = typeof to === 'string';
			from_is_str = typeof from === 'string';
			
			for(i=0; i < str_len; i++)
			{
				match = false;
				if(from_is_str)
				{
					strw = str.charAt(i-1);
					strx = str.charAt(i);
					stry = str.charAt(i+1);
					for(j=0; j < from_len; j++)
					{
						/*if(from_len !== to_len)
						{
							//Double check matches when the strings are different lengths
							
						}
						else
						{*/
							if(strx == from.charAt(j))
							{
								match = true;
								break;
							}
						//}
					}
				}
				else
				{
					for(j=0; j < from_len; j++)
					{
						if(str.substr(i, from[j].length) == from[j])
						{
							match = true;
							
							//Go past the current match
							i = (i + from[j].length) -1;
							break;

						}
					}
				}

				if(match)
				{
					new_str += (to_is_str) ? to.charAt(j) : to[j];
				}
				else
				{
					new_str += str.charAt(i);
				}
			}

			return new_str;
				
		}
	};

	//Add it to the $_ object
	$_.ext('util', u);
}());

function strtr (str, from, to) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // +      input by: uestla
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Alan C
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Taras Bogach
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: jpfle
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -   depends on: krsort
    // -   depends on: ini_set
    // *     example 1: $trans = {'hello' : 'hi', 'hi' : 'hello'};
    // *     example 1: strtr('hi all, I said hello', $trans)
    // *     returns 1: 'hello all, I said hi'
    // *     example 2: strtr('äaabaåccasdeöoo', 'äåö','aao');
    // *     returns 2: 'aaabaaccasdeooo'
    // *     example 3: strtr('ääääääää', 'ä', 'a');
    // *     returns 3: 'aaaaaaaa'
    // *     example 4: strtr('http', 'pthxyz','xyzpth');
    // *     returns 4: 'zyyx'
    // *     example 5: strtr('zyyx', 'pthxyz','xyzpth');
    // *     returns 5: 'http'
    // *     example 6: strtr('aa', {'a':1,'aa':2});
    // *     returns 6: '2'
    var fr = '',
        i = 0,
        j = 0,
        lenStr = 0,
        lenFrom = 0,
        tmpStrictForIn = false,
        fromTypeStr = '',
        toTypeStr = '',
        istr = '';
    var tmpFrom = [];
    var tmpTo = [];
    var ret = '';
    var match = false;

    // Received replace_pairs?
    // Convert to normal from->to chars
    if (typeof from === 'object') {
        //tmpStrictForIn = this.ini_set('phpjs.strictForIn', false); // Not thread-safe; temporarily set to true
        from = this.krsort(from);
        //this.ini_set('phpjs.strictForIn', tmpStrictForIn);

        for (fr in from) {
            if (from.hasOwnProperty(fr)) {
                tmpFrom.push(fr);
                tmpTo.push(from[fr]);
            }
        }

        from = tmpFrom;
        to = tmpTo;
    }

    // Walk through subject and replace chars when needed
    lenStr = str.length;
    lenFrom = from.length;
    fromTypeStr = typeof from === 'string';
    toTypeStr = typeof to === 'string';

    for (i = 0; i < lenStr; i++) {
        match = false;
        if (fromTypeStr) {
            istr = str.charAt(i);
            for (j = 0; j < lenFrom; j++) {
                if (istr == from.charAt(j)) {
                    match = true;
                    break;
                }
            }
        } else {
            for (j = 0; j < lenFrom; j++) {
                if (str.substr(i, from[j].length) == from[j]) {
                    match = true;
                    // Fast forward
                    i = (i + from[j].length) - 1;
                    break;
                }
            }
        }
        if (match) {
            ret += toTypeStr ? to.charAt(j) : to[j];
        } else {
            ret += str.charAt(i);
        }
    }

    return ret;
}

function krsort (inputArr) {
    // http://kevin.vanzonneveld.net
    // +   original by: GeekFG (http://geekfg.blogspot.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // %          note 1: The examples are correct, this is a new way
    // %        note 2: This function deviates from PHP in returning a copy of the array instead
    // %        note 2: of acting by reference and returning true; this was necessary because
    // %        note 2: IE does not allow deleting and re-adding of properties without caching
    // %        note 2: of property position; you can set the ini of "phpjs.strictForIn" to true to
    // %        note 2: get the PHP behavior, but use this only if you are in an environment
    // %        note 2: such as Firefox extensions where for-in iteration order is fixed and true
    // %        note 2: property deletion is supported. Note that we intend to implement the PHP
    // %        note 2: behavior by default if IE ever does allow it; only gives shallow copy since
    // %        note 2: is by reference in PHP anyways
    // %        note 3: Since JS objects' keys are always strings, and (the
    // %        note 3: default) SORT_REGULAR flag distinguishes by key type,
    // %        note 3: if the content is a numeric string, we treat the
    // %        note 3: "original type" as numeric.
    // -    depends on: i18n_loc_get_default
    // *     example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
    // *     example 1: data = krsort(data);
    // *     results 1: {d: 'lemon', c: 'apple', b: 'banana', a: 'orange'}
    // *     example 2: ini_set('phpjs.strictForIn', true);
    // *     example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};
    // *     example 2: krsort(data);
    // *     results 2: data == {3: 'Kevin', 2: 'van', 1: 'Zonneveld'}
    // *     returns 2: true
    var tmp_arr = {},
        keys = [],
        sorter, i, k, that = this,
        strictForIn = false,
        populateArr = {};

        //sorter = ;

    // Make a list of key names
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    
    keys.sort(function (b, a) {
	    var aFloat = parseFloat(a),
	        bFloat = parseFloat(b),
	        aNumeric = aFloat + '' === a,
	        bNumeric = bFloat + '' === b;
	    if (aNumeric && bNumeric) {
	        return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
	    } else if (aNumeric && !bNumeric) {
	        return 1;
	    } else if (!aNumeric && bNumeric) {
	        return -1;
	    }
	    return a > b ? 1 : a < b ? -1 : 0;
    });


    // Rebuild array with sorted key names
    for (i = 0; i < keys.length; i++) {
        k = keys[i];
        tmp_arr[k] = inputArr[k];
    }
    for (i in tmp_arr) {
        if (tmp_arr.hasOwnProperty(i)) {
            populateArr[i] = tmp_arr[i];
        }
    }

    return populateArr;
}

