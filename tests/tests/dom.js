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
	
		var $test = $_(".nephew");
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
		var ele = $_("article#r14").el;
		var text = (typeof ele.innerText !== "undefined") ? ele.innerText : ele.textContent;
		
		equal($test.el, $("article#r14"), "Selector property is correct");
		equal($test.dom.text().trim(), text.trim(), "Getting text");
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
	
	test("html", function(){
		expect(2);
	
		var orig_html = "This is important text!";
		var test_html = '<a href="mailto:tim@timshomepage.net">send tim an email</a>';
		
		document.getElementById('r14').innerHTML = orig_html;
		
		
		equal($_('#r14').dom.html().trim(), "This is important text!", "Gets html");
		equal($_('#r14').dom.html(test_html).toLowerCase(), test_html, "Sets html");
	});
	
	test("append", function(){
	
		expect(1);
	
		//Remove the text from this element…so we can add to it
		$_("#r14").dom.html("<ul><li>Test</li></ul>");
		
		var html = "<ul><li>Test</li><li>This is a test item</li></ul>";
		
		$_("#r14 ul").dom.append('<li>This is a test item</li>');
		
		equal($('#r14').innerHTML.toLowerCase(), html.toLowerCase(), "Append adds a child to the end of the selected element");
	});
	
	test("prepend", function(){
	
		expect(1);
		
		var html = '<ul><li>Test2</li><li>Test</li><li>This is a test item</li></ul>';
		
		$_("#r14 ul").dom.prepend('<li>Test2</li>');
		
		equal($('#r14').innerHTML.toLowerCase(), html.toLowerCase(), "Prepend adds a child to the beginning of the selected element");
		
		//Clean up the html
		$_("#r14").dom.html("");
	});
	
}());