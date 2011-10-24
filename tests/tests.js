(function(){
	//"use strict";
	
	//Selector test function
	function $(a)
	{
		var x = document.querySelectorAll(a);
		
		//Return the single object if applicable
		return (x.length === 1) ? x[0] : x;
	}

	module("core");
	
	test("Basic requirements", function(){
		expect(6);
		ok(document.querySelectorAll, "querySelectorAll");
		ok(document.getElementById, "getElementById");
		ok(document.getElementsByTagName, "getElementsByTagName");
		ok(String.prototype.trim, "String.trim()");
		strictEqual(typeof $_, "function", "Global var");
		strictEqual(typeof $_(), "object");
	});
	
	test("Type Checking", function(){
		equal($_.type(5), "number", "Number type");
		equal($_.type("abc"), "string", "String type");
		equal($_.type({}), "object", "Object type");
		equal($_.type([0,1,2]), "array", "Array type");
		equal($_.type(/x/), "regexp", "Regex type");
		equal($_.type(function(){}), "function", "Function type");
		equal($_.type(true), "boolean", "Boolean type");
	});
	
	test("Unique Selectors", function(){
		var x = $_("ol");
		var y = $_("aside");
		
		expect(1);
		notStrictEqual(x.el, y.el, "Unique Query Objects - see Issue #5");
	});
	
	test("Extend function", function(){
		var o = $_("ol");
	
		expect(4);
		ok(o.ext, "Extend function exists");
		
		$_.ext('test', {});
		strictEqual(typeof o.test, "object", "Extend function adds to $_");
		strictEqual(o.test.el, $_("ol").el, "Extend function adds selector to passed object");
		strictEqual(o.test.el, o.el, "Selector is the same on parent and child object");
	});
	
	test("Selector tests", function(){
		var i=0;
		$_("div").each(function(e){
			equal(e, $_("div").el[i], ".each function has current selector");
			i++;
		});
		equal($_().el, window.document.documentElement, "Empty selector is set to documentElement");
	});
	
	test("Sub-modules", function(){
		expect(4);
		ok($_.qs, "Query String module");
		ok($_().event, "Event module");
		ok($_.store, "Local Storage module");
		ok($_().dom, "Dom manipulation module");
	});
	
	// --------------------------------------------------------------------------
	
	module("ajax");
	
	test("Methods defined", function(){
		expect(2);
		ok($_.get, "AJAX get method");
		ok($_.post, "AJAX post method");
	});
	
	// --------------------------------------------------------------------------
	
	module("events");
	
	test("Events defined", function(){
		expect(2);
		ok($_.event.add, "Add Method Exists");
		ok($_.event.remove, "Remove Method Exists");
	});
	
	test("Browser expando support", function() {
		expect(3);
		// kis-js events uses expando properties to store event listeners for IE
		// If this test fails, the event module will likely fail as well
		var ele = document.createElement("div");
		ele.expando = {a:5, b:"c", c: function cool(){return ele}};
		equal(ele.expando.a, 5);
		equal(ele.expando.b, "c");
		equal(ele.expando.c(), ele, 
			"Closure isn't broken by being assigned to an expando property");
	});
	
	// --------------------------------------------------------------------------
	
	module("dom");
	
	test("Add/Remove Class", function() {
		expect(4);
		var $test = $_("#testSpan");
		var ele = $test.el;
		
		$test.dom.addClass("coolClass");
		equal(ele.className, "coolClass");
		
		$test.dom.addClass("anotherClass");
		equal(ele.className, "coolClass anotherClass");
		
		$test.dom.removeClass("coolClass");
		equal(ele.className, "anotherClass");
		
		$test.dom.removeClass("anotherClass");
		ok(ele.className === undefined || ele.className === "", "testSpan.className is empty");
	});
	
	test("Show/Hide", function(){
		expect(3);
	
		var $test = $_("#classChild .nephew");
		var ele = $test.el;
		
		$test.dom.hide();
		equal(ele.style.display, "none", "Element hidden with display:none");
		
		$test.dom.show();
		equal(ele.style.display, "block", "Element shown with display:block");
		
		$test.dom.hide();
		$test.dom.show('inline-block');
		
		equal(ele.style.display, "inline-block", "Element shown with custom display type");
	});
	
	test("Text", function(){
		expect(3);
	
		var $test = $_("article#r14");
		var ele = $test.el;
		var text = (typeof ele.innerText !== "undefined") ? ele.innerText : ele.textContent;
		
		equal($test.el, $("article#r14"), "Selector property is correct");
		equal($test.dom.text(), text, "Getting text");
		equal($test.dom.text(""), "", "Setting text");
	});
	
	test("Attr", function(){
		expect(2);
	
		var $test = $_("section");
		var ele = $test.el;
		
		$test.dom.attr("id", "testing");
		
		equal($test.dom.attr('id'), "testing", "Getting attribute");
		equal(ele.id, "testing", "Setting attribute");
		
	});
	
	test("CSS", function(){
		expect(2);
		
		var $test = $_("section[hidden='hidden']");
		var ele = $test.el;
		
		$test.dom.css("display", "block");
		equal(ele.style.display, "block", "Setting CSS");
		equal($test.dom.css("display"), "block", "Getting CSS");
	});

	// --------------------------------------------------------------------------

	module("util");
	
	test("Object keys", function(){
		expect(1);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6
		};
		
		var test_keys = ["x", "a", "q", "r"];
		
		deepEqual($_.util.object_keys(test_o), test_keys, "Retrieves object keys correctly");
	
	});
	
	test("Object values", function(){
		expect(1);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6,
			"p": "q"
		};
		
		var test_values = [2,4,3,6,"q"];
		
		deepEqual($_.util.object_values(test_o), test_values, "Retrieves object values correctly");
	
	});
	
	test("Array combine", function(){
	
		expect(3);
	
		var keys_5 = ["a", "u", "i", "e", "o"];
		var keys_obj = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 1,
			"p": "q"
		};
		
		var vals_5 = [1, 5, 3, 2, 4];
		var vals_4 = [3, 6, 2, 7];
		
		var obj_combined = {
			2:1,
			4:5,
			3:3,
			1:2,
			"q":4
		};
		
		var combined = {
			"a":1,
			"u":5,
			"i":3,
			"e":2,
			"o":4
		};
		
		
		equal($_.util.array_combine(keys_5, vals_4), false, "Can't combine arrays of different sizes");
		deepEqual($_.util.array_combine(keys_obj, vals_5), obj_combined, "Combine with keys as object");
		deepEqual($_.util.array_combine(keys_5, vals_5), combined, "Properly combines arrays");
		
	});
	
	test("Reverse Key Sort", function(){
		expect(2);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6
		};
		
		var test_sorted = {
			"x": 2,
			"r": 6,
			"q": 3,
			"a": 4
		};
		
		var test_array = [7, 2, 6, 3];
		var test_array_sorted = [3, 6, 2, 7];
		
		deepEqual($_.util.reverse_key_sort(test_o), test_sorted, "Object sort");
		deepEqual($_.util.object_values($_.util.reverse_key_sort(test_array)), test_array_sorted, "Array Sort");
	});
	
	test("Object Merge", function(){
		expect(2);
	
		var arr1 = {
				"color": "red", 
				0: 2, 
				1: 4
			},
			arr2 = {
				0: "a", 
				1: "b", 
				"color": "green", 
				"shape": "trapezoid", 
				2: 4
			},
			res1 = {
				"color": "green", 
				0: 2, 
				1: 4, 
				2: "a", 
				3: "b", 
				"shape": "trapezoid", 
				4: 4
			},
			arr3 = [],
			arr4 = {
				1:'value',
			},
			res2 = {0:'value'};
			
		deepEqual($_.util.object_merge(arr1, arr2), res1, "Merge objects with numeric and test keys");
		deepEqual($_.util.object_merge(arr3, arr4), res2, "Merged object has reordered keys");
	
	});

	test("String translate", function(){
		var test_str = "chotto",
			test_replace = {
				cho: 'ちょ',
				to: 'と'
			},
			test_res = "ちょtと",
			$trans = {'hello' : 'hi', 'hi' : 'hello'};
			
		equal($_.util.str_trans(test_str, test_replace), test_res, "Correctly replaces substrings from replace pairs");
		equal($_.util.str_trans("hi all, I said hello", $trans), 'hello all, I said hi', "Correctly replaces substrings from scalar pair");
	});
	
}());