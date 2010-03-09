<?php
header('Content-Type: application/json');

/* yadl_spaceid - Skip Stamping */
include('exampleslib.inc');


// Use Services_JSON
require_once('JSON.php');
$json = new Services_JSON();

//Aggressive filtering...
$allow_tags = array(
    'b',
    'strong',
    'i',
    'em',
    'u',
    'a',
    'p',
    'sup',
    'sub',
    'div',
    'img',
    'span',
    'font',
    'br',
    'ul',
    'ol',
    'li'
);

$filter = $_POST['filter'];
$r_data = getRawEditorData('editor_data');
$e_data = strip_tags($r_data, '<'.implode('><', $allow_tags).'>'); //Example

if ($filter == 'yes') {
	// Replace the words:
    $EditorData = fudd($e_data);
    $EditorData .= '<br><br>--<br>Footer added on server side after filter'; 
} else {
    $EditorData = $e_data;
}

//Create the payload JSON object to deliver back to the browser..
$data = new stdclass();
$data->Results = new stdclass();
$data->Results->raw_data = $r_data;
$data->Results->filter = $filter;
$data->Results->status = 'OK';
$data->Results->data = $EditorData;

echo($json->encode($data));



/*
 * Elmer Fudd filter code.
 * Plugin URI: http://dougal.gunters.org/blog/2004/08/30/text-filter-suite 
 * Author: Dougal Campbell
 * Author URI: http://dougal.gunters.org/
 */
function filter_cdata_content($content, $filter='none') {
	if (function_exists($filter)) {
		$content = preg_replace_callback('/(?(?<=>)|\A)([^<>]+)(?(?=<)|\Z)/s', $filter, $content);
	}

	return $content;
}

function fudd($content) {
	return filter_cdata_content($content,'fudd_filter');
}

function array_apply_regexp($patterns,$content) {
	// Extract the values:
	$keys = array_keys($patterns);
	$values = array_values($patterns);
	
	// Replace the words:
	$content = preg_replace($keys,$values,$content);

	return $content;
}

function fudd_filter($content) {
	$content = $content[1];

	$patterns = array(
			'%(r|l)%' => 'w',
			'%qu%' => 'qw',
			'%th(\s)%' => 'f$1',
			'%th%' => 'd',
			'%n\.%' => 'n, uh-hah-ha-ha.',
			'%(R|L)%' => 'W',
			'%(Qu|QW)%' => 'QW',
			'%TH(\s)%' => 'F$1',
			'%Th%' => 'D',
			'%N\.%' => 'N, uh-hah-hah-hah.'
			);

	$content = array_apply_regexp($patterns,$content);

	return $content;
}

?>
