(function(){
	"use strict";

	module("core");
	
	test("Basic requirements", function(){
		expect(5);
		ok(document.querySelectorAll, "querySelectorAll");
		ok(document.getElementById, "getElementById");
		ok(document.getElementsByTagName, "getElementsByTagName");
		ok(String.prototype.trim, "String.trim()");
		ok($_, "Global var");
	});
	
	test("Unique Selectors", function(){
		var x = $_("ol");
		var y = $_("aside");
		
		expect(1);
		notStrictEqual(x.el, y.el, "Unique Query Objects - see Issue #5");
	});
	
	test("Extend function", function(){
		var o = $_("ol");
	
		expect(3);
		ok(o.ext, "Extend function exists");
		
		$_.ext('test', {});
		strictEqual(typeof o.test, "object", "Extend function adds to $_");
		equal(o.test.el, $_("ol").el, "Extend function adds selector to passed object");
		
		
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
		//var $test = $_("#testSpan");
		//var ele = $test.el;
		var ele = document.getElementById('testSpan');
		var $test = $_(ele);
		
		$test.dom.addClass("coolClass");
		equal(ele.className, "coolClass");
		
		$test.dom.addClass("anotherClass");
		equal(ele.className, "coolClass anotherClass");
		
		$test.dom.removeClass("coolClass");
		equal(ele.className, "anotherClass");
		
		$test.dom.removeClass("anotherClass");
		ok(ele.className === undefined || ele.className === "", "testSpan.className is empty");
	});
	
}());