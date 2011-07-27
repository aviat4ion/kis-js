/**
 * Event object
 *
 * Event api wrapper
 */
(function (){

	// Property name for expandos on DOM objects
	var kis_expando = "KIS_0_3_0";

	var attach, remove, add_remove, e;

	// Define the proper attach and remove functions
	// based on browser support
	if(typeof document.addEventListener !== "undefined")
	{
		attach = function (sel, event, callback)
		{
			if (typeof sel.addEventListener !== "undefined")
			{
				sel.addEventListener(event, callback, false);
			}
		};
		remove = function (sel, event, callback)
		{
			if (typeof sel.removeEventListener !== "undefined")
			{
				sel.removeEventListener(event, callback, false);
			}
		};
	}
	//typeof function doesn't work in IE where attachEvent is available: brute force it
	else if(typeof document.attachEvent !== "undefined") 
	{
		attach = function (sel, event, callback)
		{
			function listener () {
				// Internet Explorer fails to correctly set the 'this' object
				// for event listeners, so we need to set it ourselves.
				callback.apply(arguments);
			}
			
			if (typeof sel.attachEvent !== "undefined")
			{
				remove(event, callback); // Make sure we don't have duplicate listeners
				
				sel.attachEvent("on" + event, listener);
				// Store our listener so we can remove it later
				var expando = sel[kis_expando] = sel[kis_expando] || {};
				expando.listeners = expando.listeners || {};
				expando.listeners[event] = expando.listeners[event] || [];
				expando.listeners[event].push({
					callback: callback,
					listener: listener
				});
			}
			else
			{
				console.log("Failed to attach event:"+event+" on "+sel);
			}
		};
		remove = function (sel, event, callback)
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
							sel.detachEvent("on" + event, listeners[i].listener);
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

	add_remove = function (sel, event, callback, add)
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
				add_remove(sel, event[i], callback, add);
			}

			return;
		}

		
		if(add === true)
		{
			attach(sel, event, callback);
		}
		else
		{
			remove(sel, event, callback);
		}
	};

	e = {
		add: function (event, callback)
		{
			$_.each(function(e){
				add_remove(e, event, callback, true);
			});
		},
		remove: function (event, callback)
		{
			$_.each(function(e){
				add_remove(e, event, callback, false);
			});
		}
	};

	$_.ext('event', e);

}());