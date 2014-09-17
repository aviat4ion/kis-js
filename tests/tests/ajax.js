(function(){
	"use strict";

	module("ajax");

	test("Methods defined", function(){
		expect(2);
		ok($_.get, "AJAX get method");
		ok($_.post, "AJAX post method");
	});

	asyncTest("GET", function() {
		$_.get("ajax.php", {}, function(res) {
			ok(res, "Get Response recieved");
			equal(res, 'get', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "Response failed");
		});
	});

	asyncTest("POST", function() {
		$_.post("ajax.php", {}, function(res) {
			ok(res, "Post Response recieved");
			equal(res, 'post', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "Post Response failed");
		});
	});

	asyncTest("PUT", function() {
		$_.put("ajax.php", {}, function(res) {
			ok(res, "PUT Response recieved");
			equal(res, 'put', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "PUT Response failed");
		});
	});

	asyncTest("DELETE", function() {
		$_.delete("ajax.php", {}, function(res) {
			ok(res, "DELETE Response recieved");
			equal(res, 'delete', "Appropriate request type");
			start();
		}, function(res) {
			ok(false, "DELETE Response failed");
		});
	});

	asyncTest("POST with data", function() {
		$_.post("ajax.php?data", {foo:'data', bar:function(){}}, function(res) {
			ok(res, "Data post Response received");
			equal(res, '{"foo":"data"}', "JSON received");
			start();
		});
	});

	asyncTest("PUT with data", function() {
		$_.put("ajax.php?data", {bar:'data'}, function(res) {
			ok(res, "Data post Response received");
			equal(res, '{"bar":"data"}', "JSON received");
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