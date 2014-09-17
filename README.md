# Keep It Simple JS Library #

A Minimal, Modular Javascript library for Modern browsers.

Aims to be fast, small, and easily split into individual modules.

You can create your own library by adding and removing modules from the
src directory, and running the "combine.php" script. This will output a
"kis-custom.js" file. (Be careful, as the script will overwrite any "kis-custom.js"
file that already exists).

Browser support: IE10+, Latest versions of Firefox, Chrome, Safari, Opera

## Basic Use: ##

* Function:	`$_(selector).module.function(params);`

### Core Methods  ###

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

		$_.ext("zip", function(){ ... }); // Adds 'zip' function to $_.

* type: For getting the type of a variable

		$_.type(var);


Have a look at the right sidebar of the docs included with the library for documentation on the included modules. The development version of the documentation is avaliable at

[http://github.timshomepage.net/kis-js/docs/](http://github.timshomepage.net/kis-js/docs/)

#### Lite Versions ####

There are two lite versions:

	1. Lite - Includes only the ajax and events modules
	2. Lite-dom - Includes ajax, events, and dom modules







