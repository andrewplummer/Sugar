<?php
	switch ($_GET['a']) {
		case '200':
			header('HTTP/1.1 200 OK');
			$state = 'success';
			break;
		case '204':
			header('HTTP/1.1 204 No Content');
			break;
		case '304':
			header('HTTP/1.1 304 Not Modified');
			break;
		case '404':
			header('HTTP/1.1 404 Not Found');
			$state = 'failure';
			break;
		case '500':
			header('HTTP/1.1 500 Server Error');
			$state = 'failure';
			break;
		case '999':
			header('HTTP/1.1 999 Unknown');
			$state = 'exception';
			break;
	}

echo $state;
?>