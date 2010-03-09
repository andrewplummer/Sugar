<?php
include('state_data.php');
include('state_cols.php');

if (!isset($_REQUEST['startIndex']) or intval($_REQUEST['startIndex']) < 1) {
	$startIndex = 0;
} else {
	$startIndex = intval($_REQUEST['startIndex']);
}
if (!isset($_REQUEST['results']) or intval($_REQUEST['results']) < 10) {
	$results = 10;
} else {
	$results = intval($_REQUEST['results']);
	$results = $results > 35 ? 35 : $results;
}
if (!isset($_REQUEST['state']) or !is_array($_REQUEST['state'])) {
	$state = array();
} else {
	$state = $_REQUEST['state'];
}
if (!isset($_REQUEST['gender']) or !in_array($_REQUEST['gender'], array('Both', 'Female', 'Male'), true)) {
	$gender = 'Both';
} else {
	$gender = $_REQUEST['gender'];
}

$state_data = array_intersect_key($state_data, array_flip($state));

$return = array();
foreach ($state_cols as $key => $name) {
	if ($gender !== 'Both') {
		if (!strpos($name, $gender)) {
			unset($state_cols[$key]);
			continue;
		}
	}
	$return[] = array(
		'name' => $name,
		'state1' => isset($state[1]) && isset($state_data[$state[1]][$key]) ? $state_data[$state[1]][$key] : '',
		'state2' => isset($state[2]) && isset($state_data[$state[2]][$key]) ? $state_data[$state[2]][$key] : '',
		'state3' => isset($state[3]) && isset($state_data[$state[3]][$key]) ? $state_data[$state[3]][$key] : '',
	);
}

$return = array_slice($return, $startIndex, $results);

//var_export($return);
echo json_encode(array(
	"recordsReturned" => count($return),
    "totalRecords" => count($state_cols),
    "startIndex" => $startIndex,
    "records" => $return
));
