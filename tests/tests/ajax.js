(function(){
	"use strict";
	
	module("ajax");
	
	test("Methods defined", function(){
		expect(2);
		ok($_.get, "AJAX get method");
		ok($_.post, "AJAX post method");
	});
	
	asyncTest("Get", function() {
	
		$_.get("ajax.php", {}, function(res) {
			ok(res, "Get Response recieved");
			equal(res, 'get', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "Response failed");
		});
		
	});
	
	asyncTest("Post", function() {
	
		$_.post("ajax.php", {}, function(res) {
			ok(res, "Post Response recieved");
			equal(res, 'post', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "Post Response failed");
		});
		
	});
	
	asyncTest("Post with data", function() {
		$_.post("ajax.php?data", {foo:'data', bar:function(){}}, function(res) {
			ok(res, "Data post Response received");
			equal(res, '{"foo":"data"}', "JSON received");
			start();
		});
	});
	
	asyncTest("Bad request", function() {
		$_.get("ajax.php?bad", {}, undefined, function(res) {
			ok(res, "Bad response");
			equal(res, 401, "Passed value is error code");
			start();
		});
	});
	
}());