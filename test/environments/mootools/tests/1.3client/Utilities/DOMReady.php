 <?php
// http://www.webcheatsheet.com/PHP/get_current_page_url.php
function getCurrentURL(){
	$pageURL = 'http' . (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] == "on" ? 's' : '');
	$pageURL .= "://" . $_SERVER["SERVER_NAME"];
	if ($_SERVER["SERVER_PORT"] != "80") $pageURL .= ":".$_SERVER["SERVER_PORT"];
	
	return $pageURL.$_SERVER["REQUEST_URI"];
}

// http://forum.jquery.com/topic/implementation-of-domcontentloaded-failing-when-no-assets
// by andrea.giammarchi on 13-Jul-2008 10:21 PM
function flushPause($pause = 0){
    echo ob_get_clean();
    @ob_flush();
    flush();
    usleep($pause * 1000000);
}

ob_start();
ob_implicit_flush(false);
flushPause();
?>
<!DOCTYPE html>
<html>
<head>
<script>

var testElement = document.createElement('div'),
	hasOperationAborted = (
		testElement.innerHTML = '<!--[if lt IE 8]>1<![endif]-->', !!+testElement.innerText
	);

var	MESSAGES = document.createElement('div')
,	thingsThatHappened = {}

function somethingHappened(id, result){
	if (window.ONLOAD) document.body.insertBefore(MESSAGES, document.body.firstChild)
	
	if (typeof result == 'function') result = result()
	if (result == null) result = ''
	if (result === true) result = 'PASS'
	if (result === false) result = 'FAIL'
	
	if (thingsThatHappened[id] === result) return
	thingsThatHappened[id] = result
	
	log((+new Date - START_TIME) +' '+ id + ' ' + result)
	
	MESSAGES.innerHTML
		+=	'<p id="' + id + '" class="' + result + '">'
		+	'<b>' + (+new Date - START_TIME) + 'ms </b>'
		+	id
		+	' '
		+	result
}

var	START_TIME = +new Date
function isNotLoaded(){ return !!(window.PARSED && !window.ONLOAD) }

if (false <?php if (isset($_GET['iframe'])) echo '|| true'; ?>){
	try {
		document.domain = 'localhost'
		somethingHappened("document.domain = 'localhost'", true)
	}
	catch(e) {
		somethingHappened("document.domain = 'localhost'; " + e, false)
	}
}

var Browser = {}

function log(message){
	try {
		console.log('' + message)
	}
	catch (e){}
}

var domreadyCallbacks = []
function DomReady(fn){
	domreadyCallbacks.push(fn)
}
 <?php if (!isset($_GET['plain'])):
	$core = dirname(__FILE__) . '/../../../';
	require $core . 'Packager/packager.php';

	$pkg = new Packager(array($core));
	echo $pkg->build(array('DOMReady'), array(), array(), array());
else: ?>
document.write('<scr'+'ipt src="./DOMReady.js?' + (new Date) + '"><'+'/script>');
document.write('<scr'+'ipt src="../../../Source/Utilities/DOMReady.js?' + (new Date) + '"><'+'/script>');
 <?php endif; ?>
</script>

<script>
var loadScript = function(type){
	var count = 0;
	new Element('script', {
		src: '../../Configuration.js?' + type + (new Date),
		events: {
			load: function(){
				log('>> ' + type + ': JavaSript Loaded, load called: ' + (++count));
			}
		}
	}).inject(document.body);
	log('>> ' + type + ': Loading JavaScript');
};

window.addEvent('load', function(){
	loadScript('load');
	
	window.LOADED = true
	somethingHappened('<i>MooTools load</i>', function(){
		return !!window.READY
	})
});
window.addEvent('domready', function(){
	loadScript('domready');

	window.READY = +new Date
	somethingHappened('<i>MooTools domready</i>', isNotLoaded)
});
DomReady(function(){
	window.READY = +new Date
	somethingHappened('<i>MooTools domready</i>', isNotLoaded)
});
</script>
	<meta http-equiv=Content-type content="text/html; charset=utf-8">
	<title>DomReady Test</title>
<style>

iframe {
	position: absolute;
	top: 0px;
	right: 0px;
	height: 2000px;
	width: 500px;
}

body{
	padding-right:500px;
}

html.framed body{
	padding-right:0;
}

html.framed{
	background:#eee;
}

html, body, td, th{
	font: 11px "Lucida Grande", "Trebuchet MS", Verdana, sans-serif;
}
p{
	margin:0 !important;
	padding: 1ex 1em;
}
i{
	font-size: 125%;
}
.PASS{background:#0f0;}
.FAIL{background:#f00;}

.Yes{background:#cfc;}
.No{background:#fcc;}

small{
	font-size: 9px;
}

</style>
<script>
if (document.addEventListener) document.addEventListener('DOMContentLoaded', function(){ window.READY = +new Date; somethingHappened('DOMContentLoaded (addEventListener)', isNotLoaded) }, false)
if (document.attachEvent) document.attachEvent('onDOMContentLoaded', function(){ window.READY = +new Date; somethingHappened('DOMContentLoaded (attachEvent)', isNotLoaded) }, false)

if (document.addEventListener) document.addEventListener('readyStateChange', function(){ somethingHappened('readyStateChange (addEventListener)', document.readyState) }, false)
if (document.attachEvent) document.attachEvent('onReadyStateChange', function(){ somethingHappened('onReadyStateChange (attachEvent)', document.readyState) }, false)
if (document.attachEvent) document.attachEvent('onreadystatechange', function(){ somethingHappened('onreadystatechange (attachEvent)', document.readyState) }, false)


var TEST_ELEMENT = document.createElement('div')
function pollDoScroll(){
	if (!TEST_ELEMENT.doScroll) return
	var PASS
	
	try {
		TEST_ELEMENT.doScroll('left')
		PASS = true
	}
	catch (e){
		PASS = false
	}
	
	window.CANSCROLL = PASS
	somethingHappened('TEST_ELEMENT.doScroll()', PASS)
	
	if (!PASS) setTimeout(pollDoScroll, 10)
}

function pollDoScroll_body(){
	if (!document.body.doScroll) return
	var PASS
	
	try {
		document.body.doScroll('left')
		PASS = true
	}
	catch (e){
		PASS = false
	}
	
	somethingHappened('document.body.doScroll()', PASS)
	
	if (!PASS) setTimeout(pollDoScroll_body, 10)
}

var lastReadyState
function pollReadyState(){
	var readyState = document.readyState
	if (!readyState) return
	if (readyState == lastReadyState) return
	somethingHappened('poll document.readyState', readyState)
	if (readyState != 'complete' && readyState != 'loaded') setTimeout(pollReadyState, 10)
	lastReadyState = readyState
}

function pollBodyExists(){
	var	PASS
	
	try {
		document.body.lastChild
		PASS = true
	}
	catch (e){
		PASS = false
	}
	somethingHappened('body Exists?', PASS? 'YES':'NO')
	if (!window.ONLOAD) setTimeout(pollBodyExists, 10)
}

function pollAugmentBody(){
	var	PASS
	,	body = document.body
	,	root = body.parentNode
	,	sibling = body.nextSibling
	
	try {
		body.appendChild(document.createTextNode( new Date - START_TIME + 'ms:Body ') )
		PASS = true
	}
	catch (e){
		PASS = false
	}
	somethingHappened('can Augment Body?', PASS? 'YES':'NO')
	if (!window.ONLOAD) setTimeout(pollAugmentBody, 10)
}

// //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  //  // //

var readyTests = {
	"document.readyState ==": function(){return document.readyState}
	
	,'document.body exists?': function(){return document.body ?'Yes':'No'}
	
	,"All page content loaded and parsed?": function(){return window.PARSED ?'Yes':'No'}
	,"cached IMG onload fired?": function(){return window.IMG_ONLOAD ?'Yes':'No'}
	,"uncached IMG onload fired?": function(){return window.IMG_ONLOAD_UNCACHED ?'Yes':'No'}
	,"document ready?": function(){return !!window.READY ?'Yes':'No'}
	,"onload fired?": function(){return !!window.ONLOAD ?'Yes':'No'}
	
	,"el.doScroll()": function(){
		try {
			TEST_ELEMENT.doScroll()
			return 'Yes'
		}
		catch (e){
			return 'No'
		}
	}
	
	,"body.doScroll('left')": function(){
		try {
			document.body.doScroll('left')
			return 'Yes'
		}
		catch (e){
			return 'No'
		}
	}
	
	,'isFramed?': function(){
		return isFramed() ?'Yes':'No'
	}
	
	,'Is top frame?': function(){
		return window.window === window.top ?'Yes':'No'
	}
}

if (!hasOperationAborted) readyTests['Can augment body?'] = function(){
	try {
		document.body.appendChild(
			document.createTextNode('Augmented the body! ' + (+new Date - START_TIME))
		)
		document.body.removeChild(document.body.lastChild)
		return 'Yes'
	}
	catch (e){
		return 'No'
	}
}

var readyTestResults = []

function poll(){
	var	results = {}
	,	lastResults = readyTestResults[readyTestResults.length - 1] || {}
	,	hasDifferentResults = 0
	
	results.ms = new Date - START_TIME
	
	for (var id in readyTests){
		results[id] = readyTests[id]()
		if (results[id] == lastResults[id]) continue
		
		++ hasDifferentResults
		somethingHappened(id, results[id])
	}
	
	var shouldBeReady
	
	if (window.CANSCROLL && !isFramed()) shouldBeReady = true
	if ({loaded:1,complete:1}[document.readyState]) shouldBeReady = true
	if (window.LOADED) shouldBeReady = true
	if (window.IMG_ONLOAD_UNCACHED) shouldBeReady = true
	
	if (shouldBeReady)
	somethingHappened('Should be Ready!', function(){
		return !!window.READY ?true:'Not yet...'
	})
	
	if (hasDifferentResults) readyTestResults.push(results)
	if (!window.ONLOAD) setTimeout(poll, 10)
	else report()
}

function isFramed(){
	try {
		return window.frameElement != null
	} catch(e) {
		return true
	}
}


function report(){
	var	EL = document.createElement('div')
	,	HTML = '<table class=results>'
	
	for (var i = 0; i < readyTestResults.length; ++i){
		if (i == 0){
			HTML += '<thead><tr>'
			for (var key in readyTestResults[i]){
				HTML += '<th>'
				HTML += key
				HTML += '</th>'
			}
			HTML += '</tr></thead>'
			continue
		}
		HTML += '<tr>'
		for (var key in readyTestResults[i]){
			HTML += '<td>'
			HTML += readyTestResults[i][key]
			HTML += '</td>'
		}
		HTML += '</tr>'
	}
	
	EL.innerHTML = HTML
	document.body.insertBefore(EL, document.body.firstChild)
}

poll()

</script>
</head>
<body
	onload="window.ONLOAD = +new Date; somethingHappened('body[onload] ' + (window.READY ? (window.ONLOAD - window.READY) + 'ms after Ready' : ''), function(){return !!window.READY})"
	onDOMContentLoaded="window.READY = +new Date; somethingHappened('DOMContentLoaded body[onDOMContentLoaded]', isNotLoaded)"
	onReadyStateChange="somethingHappened('body[onReadyStateChange]')"
>

<div>

<div id=thingsthathappened></div>

<hr>

<script> somethingHappened('<i>Before serverSide flush/sleep</i> <hr>') </script>
 <?php flushPause(1.0); ?>
<script> somethingHappened('<i>After serverSide flush/sleep</i> <hr>') </script>

<small>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</small>

<small>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</small>

<img height=16 width=16 onload="window.IMG_ONLOAD = true; somethingHappened('img[onload][src=about:blank]')" src="about:blank">
<img height=16 width=16 onload="window.IMG_ONLOAD = true; somethingHappened('img[onload][src=' + this.src + ']')" src="http://projects.subtlegradient.com/domready/big_image.jpg">
<script>document.write("<img height=16 width=16 onload=\"window.IMG_ONLOAD = true; window.IMG_ONLOAD_UNCACHED = true; somethingHappened('img[onload][src=' + this.src + ']')\" src=\"http://projects.subtlegradient.com/domready/big_image.jpg?_=" + +new Date + "\">")</script>

<!-- <script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload][src=about:blank]')"
	onreadystatechange="somethingHappened('script[src=about:blank][onreadystatechange]', this.readyState)"
	onerror="somethingHappened('script[src=about:blank][onerror]')"
	src="about:blank"></script> -->
<script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload]')"
	onreadystatechange="somethingHappened('script[onreadystatechange]', this.readyState)"
	src="http://projects.subtlegradient.com/domready/blank.js"></script>
<script
	onload="window.SCRIPT_ONLOAD = true; somethingHappened('script[onload][defer]')"
	onreadystatechange="somethingHappened('script[defer][onreadystatechange]', this.readyState)"
	defer src="http://projects.subtlegradient.com/domready/blank.js?123"></script>

</div>

<script>if (window != top) {somethingHappened('This is a frame!'); document.getElementsByTagName('html')[0].className += ' framed'} </script>
 <?php
 if (!isset($_GET['iframe'])){
	 $url = getCurrentURL();
	 $url .= (strpos($url, '?') !== false ? '&' : '?') . 'iframe';
	 echo '<iframe src="' . $url . '"></iframe>';
 }
?>
<script>
somethingHappened('<i>All page content loaded and parsed! (Last &lt;SCRIPT&gt; on page)</i> <hr>')
window.PARSED = true
</script>

</body>
</html>
 <?php flushPause(); ?>
