# Keep It Simple JS Library #

A Minimal, Modular Javascript library for Modern browsers.

Aims to be fast, small, and easily split into individual modules.

Browser support: IE9+, Latest versions of Firefox, Chrome, Safari, Opera

## Basic Use: ##

* Selector:	`var x = $(selector);`

* Function:	`$_.module.function(params);`

## Modules: ##

**Support**: Provides browser feature detection

	properties:

	* attachEvent:
		True if `attachEvent` is supported
	* addEventListener:
		True if `addEventListener` is supported
	* querySelector:
		True if `querySelectorAll` is supported

**Ajax**: simple, jQuery-like ajax functions

	functions:
		
	* Get: 
		Use:
		    $_.get(url, data_object, callback);
	
	* Post:
		Use:
		    $_.post(url, data_object, callback);
			
**QS**: querystring parsing and serialization for hashbang strings, and pushState urls
	
	functions:
		
		* Parse:
			Use:
			    $_.qs.parse(hb);
		
		* Set: This function will set the hash url if browser doesn't have history.pushState
			Use:
			    $_.qs.set(key, value);
		
		* Get: Retrieves the value of the key in the url string
			Use:
			    $_.qs.get(key);
			    
**Store**: localstorage wrapper with automatic data serialization

	functions:
	
		* Get:
			Use:
				$_.store.get(key);
		
		* Set
			Use:
				$_.store.set(key, value);
				
		* getALL: Retreives all localstorage data in raw form
			Use:
				$_.store.getAll();
				
				
**Event**: wrapper for applying events to DOM objects
*Depends on the `Support` module*

	functions: 
	
		*Add: 
			Use:
			    $_.event.add(selector, event, callback);
			    
		*Remove
			Use:
			    $_.event.remove(selector, event, callback);
			    
**DOM**: Dom manipulation module

	function: 
	
		*addClass: 
			Use:
			    $_.dom.addClass(selector, className);
			    
		*RemoveClass:
			Use:
			    $_.dom.removeClass(selector, className);
			
		*each: For applying changes to every item matched by a selector
			Use:
			 	$_.dom.each(selector, callback);
			 	
			Example : $_.dom.each(".foo", function(e){
						$_.dom.text(e, value);
					  }):
			 	
		*show: For setting dom elements as visible. Type defaults as "block", can be set with optional second parameter.
			Use:
				$_.dom.show(selector, [type]);
				
		*hide: Hides the elements matching the selector
			Use:
				$_.dom.hide(selector);
				
		*attr: Gets, sets, or removes an attribute from a selector. 
			Use:
				Set: $_.dom.attr(selector, attributeName, attributeValue);
				Get: $_.dom.attr(selector, attributeName);
				Remove: $_.dom.attr(selector, attributeName, null);
				
		*text: Gets or sets the text in between an element's tags
			Use:
				Set: $_.dom.text(selector, text);
				Get: $_.dom.text(selector);
				
	
	
	
