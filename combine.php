<?php

/**
 * Combine.php
 * 
 * This script combines modules into one continuous source file.
 */

//The name of the source folder
$folder = "src";
$src_folder = "{$folder}/modules";
$core_folder = "{$folder}/core";

$files = array();

//Get all the source files
if($dir = opendir($src_folder))
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

//Start with the core
$new_file = file_get_contents($core_folder."/core.js") . "\n";


//Add the modules
foreach($files as $f)
{
	$farray = file($src_folder."/".$f, FILE_IGNORE_NEW_LINES);
	
	$flen = count($farray);
	
	$module = implode("\n", $farray);
	
	$new_file .= "\n// --------------------------------------------------------------------------\n\n".$module."\n";
	
}

//Output the full file
file_put_contents("kis-custom.js", $new_file);

//Get a much-minified version from Google's closure compiler
$ch = curl_init('http://closure-compiler.appspot.com/compile');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_info=compiled_code&output_format=text&compilation_level=SIMPLE_OPTIMIZATIONS&js_code=' . urlencode($new_file));
$output = curl_exec($ch);
curl_close($ch);

file_put_contents("kis-custom-min.js", $output);


//Display the output on-screen too
echo '<pre style="-moz-tab-size:4;">'.htmlspecialchars($new_file).'</pre>';