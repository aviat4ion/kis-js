/** 
 * Template module for simple javascript templating
 */
(function(){
	"use strict";
	
	//This module relies on some others for simplicity
	//so, if they aren't there, don't initialize the module
	if($_.ajax === "undefined")
	{
		return;
	}
	
	var t, _t, _p;
	
	
	//Private object to store retrieved templates
	_t = {};
	
	//Private object to store parsed templates
	_p = {};
	
	
	/**
	 * Module for html templating. Requires ajax module.
	 * 
	 * @name template
	 * @namespace
	 * @memberOf $_
	 */
	t = {
		/**
		 * Retrieves a template
		 * 
		 * @memberOf $_.template
		 * @name get
		 * @param string name
		 * @return string
		 * @function
		 * @type string
		 */
		get: function(name)
		{
			var res;

			res = this.el.innerHTML;
			
			if(res === "")
			{
				console.log("Template is empty or cannot be found");
				return;
			}
			
			_t[name] = res;
			return res;
		},
		/**
		 * Formats a template
		 * 
		 * @memberOf $_.template
		 * @name parse
		 * @param string template_name
		 * @param object replace_data
		 * @return string
		 * @function
		 * @type string
		 */
		parse: function(name, data)
		{
			var tmp = _t[name],
				pairs = [],
				pair_reg = /\{([A-Z0-9_\-]+)\}(.*)\{\/\1\}/gim,
				var_reg = /\{([A-Z0-9_\-]+)\}/gim,
				pseudos = [], 
				num_pairs = 0,
				num_pseudos = 0,
				i = 0,
				j = 0,
				var_name = '',
				rep_data = {},
				tmp_data = '',
				data_len,
				frag,
				frag_section,
				emptys,
				x;
				
			tmp = String(tmp);
		
			//Remove newlines and tabs from template because
			//those whitespace characters are extra bandwidth
			tmp = tmp.replace(/\s+/gim, " ");
			tmp = tmp.replace(/>\s+</gim, "><");
			tmp = tmp.replace(/>\s+\{/gim, ">{");
			tmp = tmp.replace(/\}\s+</gim, "}<");
			
			//Match all the looped sections of content
			pairs = tmp.match(pair_reg);
			
			if(pairs != null)
			{
				num_pairs = pairs.length;
				
				//Go through the template, and match the pairs
				for(i=0;i<num_pairs;i++)
				{
					//Put the loop in a placeholder
					tmp = tmp.replace(pairs[i], "{"+i+"}");
					
					//Create a place to store looped data
					tmp_data = "";
					
					//The replace variable is the name of the tag
					var_name = String(pairs[i]).match(/^\{([A-Z0-9_\-]+)\}/i);
					rep_data = data[var_name[1]];
					
					//Make sure there are loops
					if(rep_data.length > 0)
					{
						data_len = rep_data.length;
						
						//Get rid of the loop tags
						pairs[i] = pairs[i].replace(pair_reg, "$2");
						
						//Replace psudovariables with data
						for(j=0;j<data_len;j++)
						{
							//Is there a better way to do this, rather than an inline function?
							tmp_data += pairs[i].replace(var_reg, function(_, varName){
								return (rep_data[j][varName]) ? rep_data[j][varName] : ""; 
							});
						}
					}
					
					//Replace the looped content
					tmp = tmp.replace("{"+i+"}", tmp_data);
				}
			}
			
			//Replace all the rest of the psudeovariables
			pseudos = tmp.match(var_reg);
			
			if(pseudos != null)
			{
				num_pseudos = pseudos.length;
			
				for(i=0;i<num_pseudos;i++)
				{
					//Remove the {} from the pseudos
					var_name = pseudos[i].replace('{', '');
					var_name = var_name.replace('}', '');
					
					//Replace each pseudovariable with the value of the object
					//property of the same name
					tmp = tmp.replace(pseudos[i], data[var_name]);
				}
			}
			
			//Create an empty fragement
			frag = document.createDocumentFragment();
			
			//Insert the html
			frag.appendChild(document.createElement('section'));
			frag_section = frag.querySelectorAll('section')[0];
			frag_section.innerHTML = tmp;
			
			//Remove bad elements in the fragment, should be faster than being done live
			emptys = frag_section.querySelectorAll('[src=""], [href=""]');
			
			for(x in emptys)
			{
				if(emptys[x].parentNode)
				{
					emptys[x].parentNode.removeChild(emptys[x]);
				}
			}
			
			//Save the parsed template in an object for later retrieval
			_p[name] = tmp;
			
			return tmp;
		},
		/** 
		 * Inserts the formatted template into the page. If the url and data parameters
		 * are passed, it will retrieve a template file from the same domain, parse, 
		 * and insert the template into the page. 
		 *
		 * @memberOf $_.template
		 * @name apply
		 * @function
		 * @param string parsed_template/template_name
		 * @param [string] url
		 * @param [object] data
		 */
		apply: function(name, url, data)
		{
			//If the parsed template is supplied, just apply it to the passed selector
			if(typeof url === "undefined" && typeof data === "undefined")
			{
				//If the "name" variable is in the _p object, set that
				if(typeof _p[name] !== "undefined")
				{
					this.el.innerHTML = _p[name];
					return;
				}
			
				//Otherwise, set the passed string to the current selector
				this.el.innerHTML = name;
				return;
			}
			
			//Otherwise, get the template, parse it, and apply it
			$_.get(url, {}, function(res){
				var parsed;
			
				if(res === "")
				{
					console.log("Template is empty or can not be found");
					return;
				}
				
				//Cache the template in an object for later use
				_t[name] = res;
				parsed = this.parse(name, data);
				_p[name] = parsed;
				
				this.el.innerHTML = parsed;
			});
		}
	};
	
	//Add the module to the library
	$_.ext('template', t);
	
})();