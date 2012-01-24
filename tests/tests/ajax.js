(function(){
	"use strict";
	
	module("ajax");
	
	test("Methods defined", function(){
		expect(2);
		ok($_.get, "AJAX get method");
		ok($_.post, "AJAX post method");
	});
	
}());