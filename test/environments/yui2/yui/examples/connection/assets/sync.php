<?php
/* yadl_spaceid - Skip Stamping */
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// always modified
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

$num = mt_rand(0,10);
sleep($num);
echo('<span>This request responded in '.$num.' seconds. </span>');

?>


