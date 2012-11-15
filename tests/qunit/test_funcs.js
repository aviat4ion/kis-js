// Query selector function
var $ = function(a)
{

	var x = document.querySelectorAll(a);

	//Return the single object if applicable
	return (x.length === 1) ? x[0] : x;
}

//Object equivalence function
var is_clone = function(o1, o2)
{
	var n,
		flag=true;

	for(n in o1)
	{
		//Do a shallow compare -- first level only
		if($_.type(o1[n]) === "object")
		{
			if($_.type(o2[n]) !== "object")
			{
				flag = false;
				break;
			}
		}
		else
		{
			if(o1[n] !== o2[n])
			{
				flag = false;
				break;
			}
		}
	}

	for(n in o2)
	{
		//Do a shallow compare -- first level only
		if($_.type(o1[n]) === "object")
		{
			if($_.type(o2[n]) !== "object")
			{
				flag = false;
				break;
			}
		}
		else
		{
			if(o2[n] !== o1[n])
			{
				flag = false;
				break;
			}
		}
	}

	return flag;
}