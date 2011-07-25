(function(){
	"use strict";
	
	//Selector test function
	function $(a)
	{
		var x = document.querySelectorAll(a);
		
		//Return the single object if applicable
		return (x.length === 1) ? x[0] : x;
	}

	module("core");
	
	test("Basic requirements", function(){
		expect(6);
		ok(document.querySelectorAll, "querySelectorAll");
		ok(document.getElementById, "getElementById");
		ok(document.getElementsByTagName, "getElementsByTagName");
		ok(String.prototype.trim, "String.trim()");
		strictEqual(typeof $_, "function", "Global var");
		strictEqual(typeof $_(), "object");
	});
	
	test("Unique Selectors", function(){
		var x = $_("ol");
		var y = $_("aside");
		
		expect(1);
		notStrictEqual(x.el, y.el, "Unique Query Objects - see Issue #5");
	});
	
	test("Extend function", function(){
		var o = $_("ol");
	
		expect(4);
		ok(o.ext, "Extend function exists");
		
		$_.ext('test', {});
		strictEqual(typeof o.test, "object", "Extend function adds to $_");
		strictEqual(o.test.el, $_("ol").el, "Extend function adds selector to passed object");
		strictEqual(o.test.el, o.el, "Selector is the same on parent and child object");
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
		var $test = $_("#testSpan");
		var ele = $test.el;
		
		$test.dom.addClass("coolClass");
		equal(ele.className, "coolClass");
		
		$test.dom.addClass("anotherClass");
		equal(ele.className, "coolClass anotherClass");
		
		$test.dom.removeClass("coolClass");
		equal(ele.className, "anotherClass");
		
		$test.dom.removeClass("anotherClass");
		ok(ele.className === undefined || ele.className === "", "testSpan.className is empty");
	});
	
	test("Show/Hide", function(){
		expect(3);
	
		var $test = $_("#classChild .child");
		var ele = $test.el;
		
		$test.dom.hide();
		equal(ele.style.display, "none", "Element hidden with display:none");
		
		$test.dom.show();
		equal(ele.style.display, "block", "Element shown with display:block");
		
		$test.dom.hide();
		$test.dom.show('inline-block');
		
		equal(ele.style.display, "inline-block", "Element shown with custom display type");
	});
	
	test("Text", function(){
		expect(2);
	
		var $test = $_("article#r14");
		var ele = $test.el;
		var text = (typeof ele.innerText !== "undefined") ? ele.innerText : ele.textContent;
		
		equal($test.el, $("article#r14"), "Selector property is correct");
		equal($test.dom.text(), text, "Getting test");
	});
	
	test("Attr", function(){
		expect(2);
	
		var $test = $_("section");
		var ele = $test.el;
		
		$test.dom.attr("id", "testing");
		
		equal($test.dom.attr('id'), "testing", "Getting attribute");
		equal(ele.id, "testing", "Setting attribute");
		
	});
	
	test("CSS", function(){
		expect(2);
		
		var $test = $_("section[hidden='hidden']");
		var ele = $test.el;
		
		$test.dom.css("display", "block");
		equal(ele.style.display, "block", "Setting CSS");
		equal($test.dom.css("display"), "block", "Getting CSS");
	});
	
}());