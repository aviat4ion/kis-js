(function(){
	"use strict";

	module("util");
	
	test("Object keys", function(){
		expect(1);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6
		};
		
		var test_keys = ["x", "a", "q", "r"];
		
		deepEqual($_.util.object_keys(test_o), test_keys, "Retrieves object keys correctly");
	
	});
	
	test("Object values", function(){
		expect(1);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6,
			"p": "q"
		};
		
		var test_values = [2,4,3,6,"q"];
		
		deepEqual($_.util.object_values(test_o), test_values, "Retrieves object values correctly");
	
	});
	
	test("Array combine", function(){
	
		expect(3);
	
		var keys_5 = ["a", "u", "i", "e", "o"];
		var keys_obj = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 1,
			"p": "q"
		};
		
		var vals_5 = [1, 5, 3, 2, 4];
		var vals_4 = [3, 6, 2, 7];
		
		var obj_combined = {
			2:1,
			4:5,
			3:3,
			1:2,
			"q":4
		};
		
		var combined = {
			"a":1,
			"u":5,
			"i":3,
			"e":2,
			"o":4
		};
		
		
		equal($_.util.array_combine(keys_5, vals_4), false, "Can't combine arrays of different sizes");
		deepEqual($_.util.array_combine(keys_obj, vals_5), obj_combined, "Combine with keys as object");
		deepEqual($_.util.array_combine(keys_5, vals_5), combined, "Properly combines arrays");
		
	});
	
	/*test("Reverse Key Sort", function(){
		expect(2);
	
		var test_o = {
			"x": 2,
			"a": 4,
			"q": 3,
			"r": 6
		};
		
		var test_sorted = {
			"x": 2,
			"r": 6,
			"q": 3,
			"a": 4
		};
		
		var test_array = [7, 2, 6, 3];
		var test_array_sorted = [3, 6, 2, 7];
		
		deepEqual($_.util.reverse_key_sort(test_o), test_sorted, "Object sort");
		deepEqual($_.util.object_values($_.util.reverse_key_sort(test_array)), test_array_sorted, "Array Sort");
	});*/
	
	test("Object Merge", function(){
		expect(2);
	
		var arr1 = {
				"color": "red", 
				0: 2, 
				1: 4
			},
			arr2 = {
				0: "a", 
				1: "b", 
				"color": "green", 
				"shape": "trapezoid", 
				2: 4
			},
			res1 = {
				"color": "green", 
				0: 2, 
				1: 4, 
				2: "a", 
				3: "b", 
				"shape": "trapezoid", 
				4: 4
			},
			arr3 = [],
			arr4 = {
				1:'value',
			},
			res2 = {0:'value'};
			
		deepEqual($_.util.object_merge(arr1, arr2), res1, "Merge objects with numeric and test keys");
		deepEqual($_.util.object_merge(arr3, arr4), res2, "Merged object has reordered keys");
	
	});

	test("String translate", function(){
		var test_str = "chotto",
			test_replace = {
				cho: 'ちょ',
				to: 'と'
			},
			test_res = "ちょtと",
			$trans = {'hello' : 'hi', 'hi' : 'hello'};
			
		equal($_.util.str_trans(test_str, test_replace), test_res, "Correctly replaces substrings from replace pairs");
		equal($_.util.str_trans("hi all, I said hello", $trans), 'hello all, I said hi', "Correctly replaces substrings from scalar pair");
	});
	
}());