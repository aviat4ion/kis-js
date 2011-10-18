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

		 $_(selector).dom.each(callback);
		 	
	Example : 
        
        $_(".foo").dom.each(function(e){
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
			
### QS: querystring parsing and serialization for hashbang strings, and pushState urls ###
	
**functions:**
	
* Parse:

	    $_.qs.parse(hb);

* Set: This function will set the hash url if browser doesn't have history.pushState

	    $_.qs.set(key, value);

* Get: Retrieves the value of the key in the url string

	    $_.qs.get(key);
			    
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
		
				
	
	
	
