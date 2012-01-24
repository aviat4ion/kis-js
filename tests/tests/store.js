(function (){
	//"use strict";

	module("store");
	
	//Test data
	var test_obj = {
		test:'value',
		t:3,
		x:[0,5,3]
	};
	var t = JSON.stringify(test_obj);
	
	test("Clear", function(){
		expect(2);
		
		//Setup
		localStorage.clear();
		localStorage.setItem("test", "value");
		
		sessionStorage.clear();
		sessionStorage.setItem("test", "value");
		
		//Clear localStorage
		$_.store.clear();
		equal(localStorage.length, 0, "No items in localStorage");
		
		//Clear sessionStorage
		$_.store.clear(true);
		equal(sessionStorage.length, 0, "No items in sessionStorage");
	
	});
	
	test("Set", function(){
		expect(2);
		
		$_.store.set('test', test_obj);
		strictEqual(localStorage.getItem('test'), t, "Set object in localStorage");
		
		$_.store.set('test', test_obj, true);
		strictEqual(sessionStorage.getItem('test'), t, "Set object in sessionStorage");
		
	});
	
	test("Get", function(){
		expect(2);
		
		//Test data
		var test_obj = {
			test:'value',
			t:3,
			x:[0,5,3]
		};
		var t = JSON.stringify(test_obj);
		var t_prime = JSON.parse(t);
		
		//This is tricky because test_obj != JSON.parse(JSON.stringify(test_obj))
		
		
		equal(JSON.stringify($_.store.get('test')), t, "Gets and parses object from localStorage");
		equal(JSON.stringify($_.store.get('test', true)), t, "Gets and parses object from localStorage");
	
	});
	
	test("Remove", function(){
		expect(2);
		
		$_.store.remove('test');
		equal(localStorage["test"], null, "Removes from localStorage");
		
		$_.store.remove('test', true);
		equal(sessionStorage["test"], null, "Removes from sessionStorage");
	});
	
	test("Get All", function(){
		expect(2);
		
		//Make sure storage is clean
		localStorage.clear();
		sessionStorage.clear();
		
		var foo = {
			a: [0,5,6]
		};
		
		var bar = {
			x: {
				b: 2
			},
			y: "baz"
		};
		
		var comb  = {
			foo: JSON.stringify(foo),
			bar: JSON.stringify(bar),
			q: "What is the question?"
		};
		
		$_.store.set('foo', foo);
		$_.store.set('bar', bar);
		localStorage.setItem('q', "What is the question?");
		
		$_.store.set('foo', foo, true);
		$_.store.set('bar', bar, true);
		sessionStorage.setItem('q', "What is the question?");
		
		var all_local = $_.store.getAll();
		var all_session = $_.store.getAll(true);
		
		
		
		//comb = comb;
		
		equal(is_clone(all_local, comb), true, "Gets all items from localStorage");
		equal(is_clone(all_session, comb), true, "Gets all items from sessionStorage");
	});

}());