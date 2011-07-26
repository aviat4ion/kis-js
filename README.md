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
	
properties:

	* el: The html object returned by the selector function.

functions:
			
	* each: For applying changes to every item matched by a selector
		Use:
		 	$_(selector).dom.each(callback);
		 	
		Example : $_(".foo").dom.each(function(e){
					$_(e).dom.text(value);
				  }):
				  
	* ext: For extending the library, adds this.el to the object or function supplied
		Use: $_.ext("name", functionOrObject)
		
		Example: $_.ext("zip", function(){ //function });
					Adds 'zip' function to $_.
		

### Ajax: simple, jQuery-like ajax functions ###

functions:
	
* Get: 
	Use:
	    $_.get(url, data_object, callback);

* Post:
	Use:
	    $_.post(url, data_object, callback);
			
### QS: querystring parsing and serialization for hashbang strings, and pushState urls ###
	
**functions:**
	
* Parse:
	Use:
	    $_.qs.parse(hb);

* Set: This function will set the hash url if browser doesn't have history.pushState
	Use:
	    $_.qs.set(key, value);

* Get: Retrieves the value of the key in the url string
	Use:
	    $_.qs.get(key);
			    
### Store: localstorage wrapper with automatic data serialization ###

**functions:**

* Get:
	Use:
		$_.store.get(key);

* Set
	Use:
		$_.store.set(key, value);
		
* getALL: Retreives all localstorage data in raw form
	Use:
		$_.store.getAll();
			
				
### Event: wrapper for applying events to DOM objects ###

**functions:** 

*Add: 
	Use:
	    $_(selector).event.add(event, callback);
	    
*Remove
	Use:
	    $_(selector).event.remove(event, callback);
			    
### DOM: Dom manipulation module ###

**functions:** 

*addClass: 
	Use:
	    $_(selector).dom.addClass(className);
	    
*RemoveClass:
	Use:
	    $_(selector).dom.removeClass(className);
	 	
*show: For setting dom elements as visible. Type defaults as "block", can be set with optional second parameter.
	Use:
		$_(selector).dom.show([type]);
		
*hide: Hides the elements matching the selector
	Use:
		$_(selector).dom.hide();
		
*attr: Gets, sets, or removes an attribute from a selector. 
	Use:
		Set: $_(selector).dom.attr(attributeName, attributeValue);
		Get: $_(selector).dom.attr(attributeName);
		Remove: $_(selector).dom.attr(attributeName, null);
		
*text: Gets or sets the text in between an element's tags
	Use:
		Set: $_(selector).dom.text(text);
		Get: $_(selector).dom.text();

*css: Sets css styles on the selected element(s)
	Use:
		Set: $_(selector).dom.css(property, value);
		Get: $_(selector).dom.css(property);
		
				
	
	
	
