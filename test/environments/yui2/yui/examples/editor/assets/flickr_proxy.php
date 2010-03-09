<?php
// Yahoo! proxy

// Hard-code hostname and path:
define ('PATH', 'http://www.flickr.com/services/rest/');

// Get all query params
$query = "?";
foreach ($_GET as $key => $value) {
    $query .= urlencode($key)."=".urlencode($value)."&";
}

foreach ($_POST as $key => $value) {
    $query .= $key."=".$value."&";
}
$query .= "&api_key=30cc0cf363608a1ffa3fc1631854c8b8";
$url = PATH.$query;

// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

header("Content-Type: text/xml");
echo $response;
curl_close($session);

?>
