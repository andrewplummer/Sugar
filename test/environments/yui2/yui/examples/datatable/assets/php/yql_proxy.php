<?php

/* yadl_spaceid - Skip Stamping */

// Yahoo! proxy

// Hard-code hostname and path:
define ('PATH', 'http://query.yahooapis.com/v1/public/yql');

// Get all query params
$query = "?format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=";
$q = str_replace('&quot;', '"', $_GET['q']);
$url = PATH . stripslashes($query) . urlencode(stripslashes(($q)));

// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

header("Content-Type: application/json");
echo $response;
curl_close($session);

?>
