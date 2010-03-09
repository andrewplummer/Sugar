<?php
	/* yadl_spaceid - Skip Stamping */ 
	
	header('Content-type: application/json');
?>
{"Results":
[
	{"Name":"A","Value":"<?php echo rand(0, 99); ?>"},
	{"Name":"B","Value":"<?php echo rand(0, 99); ?>"},
	{"Name":"C","Value":"<?php echo rand(0, 99); ?>"},
	{"Name":"D","Value":"<?php echo rand(0, 99); ?>"},
	{"Name":"E","Value":"<?php echo rand(0, 99); ?>"}
]}
