(function(){
	"use strict";
	
	module("events");
	
	test("Events defined", function(){
		expect(4);
		ok($_.event.add, "Add Method Exists");
		ok($_.event.remove, "Remove Method Exists");
		ok($_.event.live, "Live Method Exists");
		ok($_.event.delegate, "Delegate Method Exists");
	});
	
	test("Adding Events", function() {
		expect(0);	
	});
	
}());