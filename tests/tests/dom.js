(function(){

	"use strict";
	
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
	
		var $test = $_("#classChild .nephew");
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
		expect(3);
	
		var $test = $_("article#r14");
		var ele = $test.el;
		var text = (typeof ele.innerText !== "undefined") ? ele.innerText : ele.textContent;
		
		equal($test.el, $("article#r14"), "Selector property is correct");
		equal($test.dom.text(), text, "Getting text");
		equal($test.dom.text(""), "", "Setting text");
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