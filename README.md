# Keep It Simple JS Library #

A Minimal, Modular Javascript library for Modern browsers.

Aims to be fast, small, and easily split into individual modules. 

You can create your own library by adding and removing modules from the 
src directory, and running the "combine.php" script. This will output a 
"kis-custom.js" file. (Be careful, as the script will overwrite any "kis-custom.js"
file that already exists).

Browser support: IE8+, Latest versions of Firefox, Chrome, Safari, Opera

## Basic Use: ##

* Function:	`$_(selector).module.function(params);`

## Official Modules: ##
### Global: Core functions  ###
	
**properties:**

* el: The html object returned by the selector function.

**functions:**
			
* each: For applying changes to every item matched by a selector

		 $_(selector).each(callback);
		 	
	Example : 
        
        $_(".foo").each(function(e){
			$_(e).dom.text(value);
		}):
				  
* ext: For extending the library, adds this.el to the object or function supplied
	
    
    	$_.ext("name", functionOrObject);
		
	
	Example: 
	
		$_.ext("zip", function(){ //function });
		Adds 'zip' function to $_.
		
* type: For getting the type of a variable
	
		$_.type(var);
		

### Ajax: simple, jQuery-like ajax functions ###

functions:
	
* Get: 
	
	    $_.get(url, data_object, callback);

* Post:

	    $_.post(url, data_object, callback);
			
			    
### Store: localstorage wrapper with automatic data serialization ###

**functions:**

* Get:

		$_.store.get(key);

* Set

		$_.store.set(key, value);

* Remove
		
		$_.store.remove(key);
		
* getALL: Retreives all localstorage data in raw form

		$_.store.getAll();
			
				
### Event: wrapper for applying events to DOM objects ###

**functions:** 

* Add: 

	    $_(selector).event.add(event, callback);
	    
* Remove

	    $_(selector).event.remove(event, callback);
		
* Live: (for elements that are dynamically added and removed)

		$_.event.live(selector, event, callback);
		
* Delegate:

		$_(selector).delegate(target, event, callback);
			    
### DOM: Dom manipulation module ###

**functions:** 

* addClass: 

	    $_(selector).dom.addClass(className);
	    
* RemoveClass:

	    $_(selector).dom.removeClass(className);
	 	
* show: For setting dom elements as visible. Type defaults as "block", can be set with optional second parameter.

		$_(selector).dom.show([type]);
		
* hide: Hides the elements matching the selector

		$_(selector).dom.hide();
		
* attr: Gets, sets, or removes an attribute from a selector. 

		Set: $_(selector).dom.attr(attributeName, attributeValue);
		Get: $_(selector).dom.attr(attributeName);
		Remove: $_(selector).dom.attr(attributeName, null);
		
* text: Gets or sets the text in between an element's tags

		Set: $_(selector).dom.text(text);
		Get: $_(selector).dom.text();

* css: Sets css styles on the selected element(s)

		Set: $_(selector).dom.css(property, value);
		Get: $_(selector).dom.css(property);
		
* html: Sets or gets html inside the selected element

		Set: $_(selector).dom.html(html_string);
		Get: $_(selector).dom.html();

### Util: Array and string manipulation functions ###

**functions:**

* object_keys: Gets the name of the properties of an object

		$_.util.object_keys(object);

* object_values: Gets the values of the top-level members of an object

		$_.util.object_values(object);
		
* object_merge: Merges two objects' keys and values

		$_.util.object_merge(object1, object2);
		
* array_combine: Creates an object with the keys of the first array, and the values of the second

		$_.util.array_combine(keys, values);
		
* str_trans: Similar to the PHP function strtr, replaces string pairs in a GREEDY fashion

		$_.util.str_trans(string, from, to); OR $_.util.str_trans(string, replace_pairs_object);
		
				
	
	
	
