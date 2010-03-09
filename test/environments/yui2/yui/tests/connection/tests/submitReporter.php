<?php
header('Content-type: application/json');
//header('Content-type: text/plain');
echo(json_encode(array(
    POST => $_POST,
    GET  => $_GET
)));
?>
