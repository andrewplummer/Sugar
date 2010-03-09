<?php
header('Content-Type: application/json');
/* yadl_spaceid - Skip Stamping */
include('exampleslib.inc');

// Use Services_JSON
require_once('JSON.php');
$json = new Services_JSON();

$h = getRawData('height');
$w = getRawData('width');
$t = getRawData('top');
$l = getRawData('left');

$data = 'Height: '.$h;
$data .= ', Width: '.$w;
$data .= ', Top: '.$t;
$data .= ', Left: '.$l;

$response = new stdclass();
$response->data = '<p>This example does not really resize, but here is the data we received: '.$data.'</p><p>If we used ImageMagick &amp; PHP we could issue this command: convert yui.jpg -crop ['.$w.' x '.$h.' + '.$l.' + '.$t.'] yui-new.jpg</p>';

echo($json->encode($response));
?>
