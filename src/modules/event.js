/**
 * Event
 *
 * Event api wrapper
 */
(function (){

	"use strict";

	// Property name for expandos on DOM objects
	var kis_expando = "KIS_0_5_0";

	var _attach, _remove, _add_remove, e, _attach_delegate;

	// Define the proper _attach and _remove functions
	// based on browser support
	if(typeof document.addEventListener !== "undefined")
	{
		/**
		 * @private
		 */
		_attach = function (sel, event, callback)
		{
			if(typeof sel.addEventListener !== "undefined")
			{
				//Duplicated events are dropped, per the specification
				sel.addEventListener(event, callback, false);
			}
		};
		/**
		 * @private
		 */
		_remove = function (sel, event, callback)
		{
			if(typeof sel.removeEventListener !== "undefined")
			{
				sel.removeEventListener(event, callback, false);
			}
		};
	}
	//typeof function doesn't work in IE where attachEvent is available: brute force it
	else if(typeof document.attachEvent !== "undefined") 
	{
		/**
		 * @private
		 */
		_attach = function (sel, event, callback)
		{
			function _listener () {
				// Internet Explorer fails to correctly set the 'this' object
				// for event listeners, so we need to set it ourselves.
				callback.apply(arguments[0]);
			}
			
			if (typeof sel.attachEvent !== "undefined")
			{
				_remove(event, callback); // Make sure we don't have duplicate listeners
				
				sel.attachEvent("on" + event, _listener);
				// Store our _listener so we can remove it later
				var expando = sel[kis_expando] = sel[kis_expando] || {};
				expando.listeners = expando.listeners || {};
				expando.listeners[event] = expando.listeners[event] || [];
				expando.listeners[event].push({
					callback: callback,
					_listener: _listener
				});
			}
			else
			{
				console.log("Failed to _attach event:"+event+" on "+sel);
			}
		};
		/**
		 * @private
		 */
		_remove = function (sel, event, callback)
		{
			if(typeof sel.detachEvent !== "undefined")
			{
				var expando = sel[kis_expando];
				if (expando && expando.listeners
						&& expando.listeners[event])
				{
					var listeners = expando.listeners[event];
					var len = listeners.length;
					for (var i=0; i<len; i++)
					{
						if (listeners[i].callback === callback)
						{
							sel.detachEvent("on" + event, listeners[i]._listener);
							listeners.splice(i, 1);
							if(listeners.length === 0)
							{
								delete expando.listeners[event];
							}
							return;
						}
					}
				}
			}
		};
	}
	
	_add_remove = function (sel, event, callback, add)
	{
		var i, len;
		
		if(typeof sel === "undefined")
		{
			console.log(arguments);
			console.log(event);
			return false;
		}

		//Multiple events? Run recursively!
		if (!event.match(/^([\w\-]+)$/))
		{
			event = event.split(" ");
			
			len = event.length;

			for (i = 0; i < len; i++)
			{
				_add_remove(sel, event[i], callback, add);
			}

			return;
		}

		
		if(add === true)
		{
			_attach(sel, event, callback);
		}
		else
		{
			_remove(sel, event, callback);
		}
	};

	_attach_delegate = function(sel, target, event, callback)
	{
		//_attach the _listener to the parent object
		_add_remove(sel, event, function(e){
		
			var elem, t, tar;
			
			//IE 8 doesn't have event bound to element
			e = e || window.event;
			
			//Get the live version of the target selector
			t = $_.$(target);
			
			//Check each element to see if it matches the target
			for(elem in t)
			{
				//IE 8 doesn't have target in the event object
				tar = e.target || e.srcElement;
			
				//Fire target callback when event bubbles from target
				if(tar == t[elem])
				{
					//Trigger the event callback
					callback.call(t[elem], e);
					
					//Stop event propegation
					e.stopPropagation();
				}
			}
			
		}, true);
	};
	
	
	
	// --------------------------------------------------------------------------

	/**
	 * Event Listener module
	 *
	 * @namespace
	 * @name event
	 * @memberOf $_
	 */
	e = {
		/**
		 * Adds an event that returns a callback when triggered on the selected
		 * event and selector
		 * 
		 * @memberOf $_.event
		 * @name add
		 * @function
		 * @example Eg. $_("#selector").event.add("click", do_something());
		 * @param string event
		 * @param function callback
		 */
		add: function (event, callback)
		{
			$_.each(function(e){
				_add_remove(e, event, callback, true);
			});
		},
		/**
		 * Removes an event bound the the specified selector, event type, and callback
		 *
		 * @memberOf $_.event
		 * @name remove
		 * @function
		 * @example Eg. $_("#selector").event.remove("click", do_something());
		 * @param string event
		 * @param string callback
		 */
		remove: function (event, callback)
		{
			$_.each(function(e){
				_add_remove(e, event, callback, false);
			});
		},
		/** 
		 * Binds a persistent event to the document
		 *
		 * @memberOf $_.event
		 * @name live
		 * @function
		 * @example Eg. $_.event.live(".button", "click", do_something());
		 * @param string target
		 * @param string event
		 * @param function callback
		 */
		live: function (target, event, callback)
		{
			_attach_delegate(document.documentElement, target, event, callback);
		},
		/** 
		 * Binds an event to a parent object
		 *
		 * @memberOf $_.event
		 * @name delegate
		 * @function
		 * @example Eg. $_("#parent").delegate(".button", "click", do_something());
		 * @param string target
		 * @param string event_type
		 * @param function callback
		 */
		delegate: function(target, event, callback)
		{
			$_.each(function(e){
				_attach_delegate(e, target, event, callback);
			});
		}
	};

	$_.ext('event', e);

}());