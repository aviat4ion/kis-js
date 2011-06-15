/**
	Kis JS		Keep It Simple JS Library
  	Copyright	Timothy J. Warren
  	License		Public Domain
  	Version		0.0.1
*/

(function(){

	"use strict";
	
	var $_, $, kis;
	
	$_ = {};
	
	window.$_ = window.$_ || $_;
	
	/**
	 * $
	 *
	 * Simple DOM selector function
	 */
	$ = function(a)
	{
		var x = document.querySelectorAll(a);
		return (x.length === 1) ? x[0] : x;
	};
	
	window.$ = window.$ || $;
	
	/**
	 * Ajax 
	 *
	 * Object for making ajax requests
	 */
	(function() {
		var $_ = $_ || {};
		var ajax = {
			_req: function()
			{
				return (window.XMLHttpRequest) 
					? new XMLHttpRequest()
					: new ActiveXObject("Microsoft.XMLHTTP");
			},
			_do: function(url, data, callback, isPost)
			{
				var request = this._req();
				var type = (isPost) ? "POST" : "GET";
				
				url += (type === "GET") 
					? "?" + this._serialize(data, true)
					: '';  
					
				request.open(type, url);
				
				request.onreadystatechange = function(){
					if(request.readyState === 4)
					{
						callback(request.responseText);
					}
				};
				
				if(type === "POST")
				{
					request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					request.send(this._serialize(data));
				}
				else
				{
					request.send(null);
				}
			},
			_serialize: function(data, encode)
			{
				var pairs = [];
				
				for (var name in data)
				{
					if(!data.hasOwnProperty(name)){ continue };
					if(typeof data[name] === "function"){ continue };
					
					var value = data[name].toString();
					
					if(encode === true)
					{
						name = encodeURIComponent(name.replace(" ", "+"));
						value = encodeURIComponent(value.replace(" ","+"));
					}
					
					pairs.push(name + "=" + value);
				}
				
				return pairs.join("&");
			}
		};
		
		window.$_.get = function(url, data, callback)
		{
			ajax._do(url, data, callback, false);
		};
		
		window.$_.post = function(url, data, callback)
		{
			ajax._do(url, data, callback, true);
		};
	}());
	
	/**
	 * Qs
	 * 
	 * Object for encoding and decoding querystrings and hashbang strings
	 */
	(function(){
	
		window.$_.hb = (history.pushState) ? false : true;
	
		var qs  = {
			parse: function(hb)
			{
				hb = hb || $_.hb;
				var h, i, hString, pairs, pLen, data, y;
				
				data = {};
	
				if(hb === true)
				{
					h = location.hash.split('#!/');
					hString = (h.length > 1) ? h[1] : '';
				}
				else if(hb === false || hb === undefined)
				{
					hString = window.location.search.substring(1);
				}
				else
				{
					return false;
				}
				
				pairs = hString.split('&');
				
				pLen = pairs.length;
				
				for(i=0;i<pLen;i++)
				{
					y = pairs[i].split('=');
					
					if(y.length < 2)
					{
						return data;
					}
					
					data[y[0]] = y[1];
				}
				
				return data;
			},
			set: function(key, value, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);
				
				if(key !== undefined && value !== undefined)
				{
					pairs[key] = value;
				}
			
				var vars = [];
				
				for (var x in pairs)
				{
					if(pairs.hasOwnProperty(x))
					{
						vars.push(x+'='+pairs[x]);
					}
				}
	
				var qs = vars.join('&');
				
				if(hb === true)
				{
					qs = '!/'+ qs;
					location.hash = qs;
				}
				
				return qs;
			},
			get: function(key, hb)
			{
				hb = hb || $_.hb;
				var pairs = this.parse(hb);
				return (pairs[key]) ? pairs[key] : '';
			}
		};
		
		window.$_.qs = qs;
		
	}());
	
	/**
	 * Store object
	 * 
	 * Wrapper for localstorage data serialization
	 */
	(function(){
		var store = {
			get: function(key)
			{
				return JSON.parse(localStorage.getItem(key));
			},
			set: function(key, value)
			{
				if(typeof value === "object")
				{
					value = JSON.stringify(value);
				}
				localStorage.setItem(key, value);
			},
			getAll: function()
			{
				var i, len, data;
				len = localStorage.length;
				data = {};
				
				for(i=0;i<len;i++)
				{
					var name = localStorage.key(i);
					var value = localStorage.getTime(name);
					data[name] = value;
				}
				
				return data;
			}
		};
		
		window.$_.store = store;
	}());
	
	/**
	 * Event object
	 *
	 * Event api wrapper
	 */
	 (function(){
	 	var attach, remove;
	 	
	 	if(document.addEventListener)
	 	{
	 		attach = function(sel, event, callback)
	 		{
	 			sel.addEventListener(event, callback, false);
	 		};
	 		
	 		remove = function(sel, event, callback)
	 		{
	 			sel.removeEventListener(event, callback, true);
	 		};	
	 	}
	 	else
	 	{
	 		attach = function(sel, event, callback)
	 		{
	 			sel.attachEvent(event, callback);
	 		};
	 		
	 		remove = function(sel, event, callback)
	 		{
	 			sel.detachEvent(event, callback);
	 		};
	 	}
	 	
	 	var e = {
	 		add: function(sel, event, callback)
	 		{
	 			var i,len;
	 		
	 			if(sel.length)
	 			{
	 				len = sel.length;
	 				for(i=0;i<len;i++)
	 				{
	 					attach(sel[i], event, callback);
	 				}
	 			}
	 			else
	 			{
	 				attach(sel, event, callback);
	 			}
	 		},
	 		remove: function(sel, event, callback)
	 		{
	 			var i, len;
	 			
	 			if(sel.length)
	 			{
	 				len = sel.length;
	 				for(i=0;i<len;i++)
	 				{
	 					remove(sel[i], event, callback);
	 				}
	 			}
	 			else
	 			{
	 				remove(sel, event, callback);
	 			}
	 		}
	 	};
	 	
	 	window.$_.event = e;
	 	
	 }());
})();