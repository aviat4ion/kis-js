<?php

$verb = strtolower($_SERVER['REQUEST_METHOD']);

// Send request method if nothing else is specified
if (empty($_GET))
{
	echo $verb;
}
else if (isset($_GET['data']))
{
	switch($verb)
	{
		case "get":
			$var =& $_GET;
		break;

		case "post":
			$var =& $_POST;
		break;

		default:
			parse_str(file_get_contents('php://input'), $var);
		break;
	}

	header('Content-type: application/json');
	echo json_encode($var);
}
else if (isset($_GET['bad']))
{
	http_response_code('401');
}






