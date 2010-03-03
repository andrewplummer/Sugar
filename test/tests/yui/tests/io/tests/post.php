<?php

$count = count($_POST);

if ($count > 0) {
	$data = $_POST['hello'];
	$data .= "&" . $_POST['foo'];
	echo $data;
}
else {
	echo $count;
}
?>