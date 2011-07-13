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
	
}());