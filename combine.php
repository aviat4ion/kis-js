<?php

/**
 * Combine.php
 * 
 * This script combines modules into one continuous source file.
 */

//The name of the source folder
$folder = "src";

$files = array();

//Get all the source files
if($dir = opendir($folder))
{
	while(($file = readdir($dir)) !== FALSE)
	{
		//Don't grab . and ..
		if($file !== "." && $file !== "..")
		{
			$files[] = $file;
		}
	}
	
	closedir($dir);
}

//Define files that aren't modules
$special_files = array(
	'core.js',
	'module_vars.js',
);

//Filter out special files
$src_files = array_diff($files, $special_files);

$syntax_start = array(
	'//Function to maintain module scope',
	'(function(){',
	'',
	'	"use strict";',
);

//Start with the core
$new_file = file_get_contents($folder."/core.js") . "\n";

//Add the opening of the function for the modules
$new_file .= "\n// --------------------------------------------------------------------------\n\n".implode("\n", $syntax_start);

//Add the module-global variables
$new_file .= "\n\n".file_get_contents($folder."/module_vars.js")."\n";

//Add the modules
foreach($src_files as $f)
{
	$farray = file($folder."/".$f, FILE_IGNORE_NEW_LINES);
	
	$flen = count($farray);
	
	//Indent each module 1 tab, for neatness
	for($i=0;$i<$flen;$i++)
	{
		if($farray[$i] == ""){ continue; }
		$farray[$i] = "\t".$farray[$i];
	}
	
	$module = implode("\n", $farray);
	
	$new_file .= "\n\t// --------------------------------------------------------------------------\n\n".$module."\n";
	
}

//Add the close of the module function
$new_file .= "\n}());";

//Output the full file
file_put_contents("kis-custom.js", $new_file);

//Get a much-minified version from Google's closure compiler
$ch = curl_init('http://closure-compiler.appspot.com/compile');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS&js_code=' . urlencode($new_file));
$output = curl_exec($ch);
curl_close($ch);

file_put_contents("kis-min.js", $output);


//Display the output on-screen too
echo '<pre>'.htmlspecialchars($new_file).'</pre>';