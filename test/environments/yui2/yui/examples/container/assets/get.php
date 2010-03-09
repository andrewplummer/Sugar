<?php

print "data = { ";

$index = 0;

foreach($_GET as $key => $value) {
	
    print htmlspecialchars("$key:", ENT_QUOTES);
    
	if (gettype($value) == "array") {
		print "[";
		for ($i = 0;$i < count($_GET[$key]);$i++) { 
		   $v = $_GET[$key][$i]; 
		   print "\"$v\"";
		   if ($i < count($_GET[$key])-1) {
				print ",";
		   }
		} 
		print "]";
	} else {
		print "\"$value\"";
	}

	$index++;

	if ( ($index) < count($_GET) ) {
		print ", ";
	}
}

print " };";
?> 