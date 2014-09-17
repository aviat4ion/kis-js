(function(){
	"use strict";

	module("events", {
		setup: function() {
			this.foo = $_.event.create('foo');
			ok(this.foo, "Event foo created");

			this.bar = $_.event.create('bar');
			ok(this.bar, "Event bar created");
		},
		teardown: function() {

		}
	});

	test("Events defined", function(){
		expect(8);
		ok($_.event.create, "Create Method Exists");
		ok($_.event.add, "Add Method Exists");
		ok($_.event.remove, "Remove Method Exists");
		ok($_.event.live, "Live Method Exists");
		ok($_.event.delegate, "Delegate Method Exists");
		ok($_.event.trigger, "Trigger Method Exists");
	});

	asyncTest("Adding/Triggering Event Listener", function() {
		expect(5);

		var callback = function(e) {
			ok(e, "Event was added");
			ok(e, "Event was triggered");

			start();
		};

		$_.event.add('foo', callback);
		var x = $_.event.trigger(this.foo);
		ok(x, "Event was not canceled");
	});

	asyncTest("Delegated Event", function() {
		expect(4);

		var callback = function(e) {
			ok(e, "Delegated event was triggered");
			start();
		};

		$_("section[hidden]").event.delegate('#classChild', 'foo', callback);
		var x = $_('.nephew').event.trigger(this.foo);
		ok(x, "Event was not canceled");
	});

	asyncTest("Live Event", function() {
		expect(4);

		var callback = function(e) {
			ok(e, "Live event was triggered");
			start();
		};

		$_.event.live('.child', 'foo', callback);
		$_('#classChild').event.trigger(this.foo);
	});

	asyncTest("Multiple Events", function() {
		expect(3);

		var callback = function(e) {
			ok(e, "An event was triggered");
			start();
		};

		$_("#qunit").event.add('foo bar', callback);
		$_('#qunit').event.trigger(this.bar);

		// Remove the events
		$_("#qunit").event.remove('foo bar', callback);
	});
}());