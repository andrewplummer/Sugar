<?php
function getRawEditorData($paramName) {
	if ($paramName) {
		if (isset($_POST[$paramName])) {
			return $_POST[$paramName];
		} else if (isset($_GET[$paramName])) {
			return $_GET[$paramName];
		} else {
			return null;
		}
	} else {
		return null;
	}
}

?>
