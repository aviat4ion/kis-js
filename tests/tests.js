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
		notEqual(x.el, y.el, "Unique Query Objects - see Issue #5");
	});
	
	test("Sub-modules", function(){
		expect(5);
		ok($_.get, "AJAX get method");
		ok($_.post, "AJAX post method");
		ok($_.qs, "Query String module");
		ok($_.store, "Local Storage module");
		ok($_.dom, "Dom manipulation module");
	});
	
	// --------------------------------------------------------------------------
	
	module("ajax");
	
	
	// --------------------------------------------------------------------------
	
	module("events");
	
	test("Browser expando support", function() {
		expect(3);
		// kis-js events uses expando properties to store event listeners
		// If this test fails, the event module will likely fail as well
		var ele = document.createElement("div");
		ele.expando = {a:5, b:"c", c: function cool(){return ele}};
		equals(ele.expando.a, 5);
		equals(ele.expando.b, "c");
		equals(ele.expando.c(), ele, 
			"Closure isn't broken by being assigned to an expando property");
	});
	
	// --------------------------------------------------------------------------
	
	module("dom");
	
	test("Add/Remove Class", function() {
		expect(4);
		var $test = $_("#testSpan");
		var ele = $test.el;
		
		$test.dom.addClass("coolClass");
		equals(ele.className, "coolClass");
		
		$test.dom.addClass("anotherClass");
		equals(ele.className, "coolClass anotherClass");
		
		$test.dom.removeClass("coolClass");
		equals(ele.className, "anotherClass");
		
		$test.dom.removeClass("anotherClass");
		ok(ele.className === undefined || ele.className === "", "testSpan.className is empty");
	});
}());