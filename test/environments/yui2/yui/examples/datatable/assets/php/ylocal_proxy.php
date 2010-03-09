<?php

/* yadl_spaceid - Skip Stamping */

// Yahoo! proxy

// Hard-code hostname and path:
define ('PATH', 'http://local.yahooapis.com/LocalSearchService/V2/localSearch');

$type = "text/xml";

// Get all query params
$query = "?";
foreach ($_GET as $key => $value) {
    if(($key == "output") && ($value == "json")) {
        $type = "application/json";
    }
    $query .= urlencode($key)."=".urlencode($value)."&";
}

foreach ($_POST as $key => $value) {
    if(($key == "output") && ($value == "json")) {
        $type = "application/json";
    }
    $query .= $key."=".$value."&";
}
$query .= "appid=YahooDemo";
$url = PATH.$query;


// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$response = curl_exec($session);

header("Content-Type: ".$type);
echo $response;
curl_close($session);

?>
