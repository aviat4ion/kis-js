(function(){
	"use strict";
	
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
	
}());