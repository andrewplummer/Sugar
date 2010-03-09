<?php
/* yadl_spaceid - Skip Stamping */
error_reporting(E_ALL);

function getResource($url){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

$url = 'http://search.yahooapis.com/NewsSearchService/V1/newsSearch?appid=YahooDemo&language=en&output=php&'.getenv('QUERY_STRING'); 
//$response = file_get_contents($url);

$response = getResource($url);

if ($response === false) {
    die('Request failed');
}

$resultSet = unserialize($response);
$resultSet = $resultSet['ResultSet'];



$list = ''; // HTML output
$headlines = array(); // track headlines to filter dupes

foreach ($resultSet['Result'] as $result) {
    if (!isset($headlines[$result['Title']])) {
        $headlines[$result['Title']] = true;
        $list.= <<< END_OF_HTML
        <li>
            <a href="{$result['ClickUrl']}"><q>{$result['Title']}</q></a>
            <cite>{$result['NewsSource']}</cite>
        </li>
END_OF_HTML;
    } // end if
} // end foreach

?>
<ul><?php echo $list; ?></ul>