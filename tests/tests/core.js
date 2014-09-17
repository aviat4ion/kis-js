(function(){

	"use strict";

	module("core");

	test("Basic requirements", function(){
		expect(8);
		ok(document.querySelectorAll, "querySelectorAll");
		ok(document.getElementById, "getElementById");
		ok(document.getElementsByTagName, "getElementsByTagName");
		ok(String.prototype.trim, "String.trim()");
		ok(JSON.parse, "JSON.parse()");
		ok(JSON.stringify, "JSON.stringify()");
		strictEqual(typeof $_, "function", "Global var");
		strictEqual(typeof $_(), "object");
	});

	test("Type Checking", function(){
		equal($_.type(7), "number", "Number type");
		equal($_.type("abc"), "string", "String type");
		equal($_.type({}), "object", "Object type");
		equal($_.type([0,1,2]), "array", "Array type");
		equal($_.type(/x/), "regexp", "Regex type");
		equal($_.type(function(){}), "function", "Function type");
		equal($_.type(true), "boolean", "Boolean type");
		strictEqual($_.type($_), "function", "$_ returns function");
		strictEqual($_.type($_()), "object", "$_() returns object");
	});

	test("Unique Selectors", function(){
		expect(1);
		notStrictEqual($_("div").el, $_("aside").el, "Unique Query Objects - see Issue #5");
	});

	test("Extend function", function(){
		var o = $_("ol");
		expect(4);
		ok(o.ext, "Extend function exists");

		$_.ext('test', {});
		strictEqual(typeof o.test, "object", "Extend function adds to $_");
		strictEqual(is_clone(o.test.el, $_("ol").el), true, "Extend function adds selector to passed object");
		strictEqual(is_clone(o.test.el, o.el), true, "Selector is the same on parent and child object");

		o = null;
	});

	test("Selector tests", function(){
		var i=0;
		$_("div").each(function(e){
			equal(e, $_("div").el[i], ".each function has current selector");
			i++;
		});

		strictEqual($_().el, window.document.documentElement, "Empty selector is set to documentElement");
		strictEqual($_('#qunit').el, document.getElementById('qunit'), "Id selector equivalence")

		strictEqual(is_clone($_('#qunit').el, $_.$('#qunit')), true, "El attribute is same as direct selector");
		strictEqual(is_clone($_('div').el, $_.$('div')), true, "El attribute is same as direct selector");

	});

	asyncTest("Iterator tests", function() {
		$_('#qunit').each(function(el) {
			equal(el, $_.$('#qunit'));
			start();
		});

		$_('foo').each(function(el) {
			equal(el, undefined);
		});
	});

	test("Array.isArray", function(){
		expect(2);
		strictEqual(Array.isArray([1, 2, 3]), true, "Array.isArray returns true on an array");
		strictEqual(Array.isArray({arr:[1,2,3]}), false, "Array.isArray returns false on a non-array");
	});

	test("Sub-modules", function(){
		expect(4);
		ok($_().event, "Event module");
		ok($_.store, "Local Storage module");
		ok($_().dom, "Dom manipulation module");
		ok($_.get, "Ajaz module");
	});
}());