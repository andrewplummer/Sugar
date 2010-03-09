<?php

print "<strong>Submitted Data</strong>";
print "<ul>";

foreach($_POST as $key => $value) {
  	print "<li>";
	print htmlspecialchars("$key: ", ENT_QUOTES);

	if (gettype($value) == "array") {
		for ($i = 0;$i < count($_POST[$key]);$i++) { 
		   $v = $_POST[$key][$i]; 
		   print "$v";
		   if ($i < count($_POST[$key])-1) {
				print ", ";
		   }
		} 
	} else {
		print "$value";
	}

	print "</li>";
}
print "</ul>";
?> 
