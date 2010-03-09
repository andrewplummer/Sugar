<html>
<head>
<script type="text/javascript" src="../../../build/yahoo/yahoo-min.js" ></script>
<script type="text/javascript" src="../../../build/event/event-min.js" ></script>
<script type="text/javascript" src="../../../build/datasource/datasource.js" ></script>
<script type="text/javascript">
YAHOO.util.DateLocale['fr'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {
	a: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
	A: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
	b: ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jui', 'aoû', 'sep', 'oct', 'nov', 'déc'],
	B: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
	p: ['', ''],
	P: ['', ''],
	x: '%d.%m.%Y'
});

YAHOO.util.DateLocale['fr-CA'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], { x: '%Y-%m-%d' });

YAHOO.util.DateLocale['fr-CH'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], { x: '%d. %m. %y' });

YAHOO.util.DateLocale['de'] = YAHOO.lang.merge(YAHOO.util.DateLocale['fr'], {
        a: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        A: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
        b: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
        B: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
});

YAHOO.util.DateLocale['de-CH'] = YAHOO.lang.merge(YAHOO.util.DateLocale['de'], {
	a: ['Son', 'Mon', 'Die', 'Mit', 'Don', 'Fre', 'Sam'],
	x: '%Y-%m-%d'
});

YAHOO.util.DateLocale['hi'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {
	"a": ["\u0930\u0935\u093f ","\u0938\u094b\u092e ","\u092e\u0902\u0917\u0932 ","\u092c\u0941\u0927 ","\u0917\u0941\u0930\u0941 ","\u0936\u0941\u0915\u094d\u0930 ","\u0936\u0928\u093f "],
	"A": ["\u0930\u0935\u093f\u0935\u093e\u0930 ","\u0938\u094b\u092e\u0935\u093e\u0930 ","\u092e\u0902\u0917\u0932\u0935\u093e\u0930 ","\u092c\u0941\u0927\u0935\u093e\u0930 ","\u0917\u0941\u0930\u0941\u0935\u093e\u0930 ","\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930 ","\u0936\u0928\u093f\u0935\u093e\u0930 "],
	"b": ["\u091c\u0928\u0935\u0930\u0940","\u092b\u093c\u0930\u0935\u0930\u0940","\u092e\u093e\u0930\u094d\u091a","\u0905\u092a\u094d\u0930\u0947\u0932","\u092e\u0908","\u091c\u0942\u0928","\u091c\u0941\u0932\u093e\u0908","\u0905\u0917\u0938\u094d\u0924","\u0938\u093f\u0924\u092e\u094d\u092c\u0930","\u0905\u0915\u094d\u091f\u0942\u092c\u0930","\u0928\u0935\u092e\u094d\u092c\u0930","\u0926\u093f\u0938\u092e\u094d\u092c\u0930"],
	"B":["\u091c\u0928\u0935\u0930\u0940","\u092b\u093c\u0930\u0935\u0930\u0940","\u092e\u093e\u0930\u094d\u091a","\u0905\u092a\u094d\u0930\u0947\u0932","\u092e\u0908","\u091c\u0942\u0928","\u091c\u0941\u0932\u093e\u0908","\u0905\u0917\u0938\u094d\u0924","\u0938\u093f\u0924\u092e\u094d\u092c\u0930","\u0905\u0915\u094d\u091f\u0942\u092c\u0930","\u0928\u0935\u092e\u094d\u092c\u0930","\u0926\u093f\u0938\u092e\u094d\u092c\u0930"],
	"c": "%A %d %B %Y %r",
	"p": ["\u092a\u0942\u0930\u094d\u0935\u093e\u0939\u094d\u0928","\u0905\u092a\u0930\u093e\u0939\u094d\u0928"],
	"P": ["\u092a\u0942\u0930\u094d\u0935\u093e\u0939\u094d\u0928","\u0905\u092a\u0930\u093e\u0939\u094d\u0928"],
	"r":"%I:%M:%S %p %Z",
	"x":"%A %d %B %Y",
	"X":"%I:%M:%S  %Z"
});

YAHOO.util.DateLocale['ko-KR'] = YAHOO.lang.merge(YAHOO.util.DateLocale, {
	"a": ["\uc77c","\uc6d4","\ud654","\uc218","\ubaa9","\uae08","\ud1a0"],
	"A": ["\uc77c\uc694\uc77c","\uc6d4\uc694\uc77c","\ud654\uc694\uc77c","\uc218\uc694\uc77c","\ubaa9\uc694\uc77c","\uae08\uc694\uc77c","\ud1a0\uc694\uc77c"],
	"b": [" 1\uc6d4"," 2\uc6d4"," 3\uc6d4"," 4\uc6d4"," 5\uc6d4"," 6\uc6d4"," 7\uc6d4"," 8\uc6d4"," 9\uc6d4","10\uc6d4","11\uc6d4","12\uc6d4"],
	"B": ["1\uc6d4","2\uc6d4","3\uc6d4","4\uc6d4","5\uc6d4","6\uc6d4","7\uc6d4","8\uc6d4","9\uc6d4","10\uc6d4","11\uc6d4","12\uc6d4"],
	"c": "%x (%a) %r",
	"p": ["\uc624\uc804","\uc624\ud6c4"],
	"P": ["\uc624\uc804","\uc624\ud6c4"],
	"r": "%p %I\uc2dc %M\ubd84 %S\ucd08",
	"x": "%Y\ub144 %m\uc6d4 %d\uc77c",
	"X": "%H\uc2dc %M\ubd84 %S\ucd08"
});

</script>
<style type="text/css">
TH, TD { font-size: 0.8em; }
.nomatch { background-color: #f88; #color: #fff; }
.match { background-color: #8f8; #color: #000; }
TH { text-align: left; }
</style>
</head>
<body>
<?php
$testdates = array(time(), strtotime('1900/01/01'), strtotime('2008/01/01'), strtotime('2008/01/01 08:00:00'), strtotime('2007/12/31 23:59:59'), strtotime('2008/02/29'), strtotime('2000/12/31'));
/*$testdates = array();
for($i=1; $i<366; $i++)
{
	$testdates[] = strtotime("2008/01/$i");
	$testdates[] = strtotime("2008/01/$i 11:59:59");
	$testdates[] = strtotime("2008/01/$i 12:00:00");
}*/
$formats = array('a','A','b','B','c','C','d','D','e','F','g','G','h','H','I','j','k','l','m','M','n','p','P','r','R','s','S','t','T','u','U','V','w','W','x','X','y','Y','z','Z','%');
//$formats = array('j');
foreach($testdates as $date)
{
?>
<script type="text/javascript">
var date = new Date('<?php echo strftime('%Y/%m/%d %H:%M:%S', $date); ?>');
</script>
<h2>Testing: <?php echo strftime('%Y/%m/%d %H:%M:%S', $date) ?> (
<script type="text/javascript">
document.write(YAHOO.util.Date.format(date, {format: '%Y/%m/%d %H:%M:%S'}));
</script>
)</h2>
<table cellspacing=0 cellpadding=4 border=1>
<tr> <th rowspan="2">format</th> <th colspan="2">US English</th> <th colspan="2">UK English</th> <th colspan="2">French</th> <th colspan="2">Canadian French</th> <th colspan="2">Swiss French</th> <th colspan="2">German</th> <th colspan="2">Swiss German</th> <th colspan="2">Hindi</th> <th colspan="2">Hangul</th> </tr>
<tr> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> <th>PHP</th> <th>Javascript</th> </tr>
<?php
foreach($formats as $format)
{
	$format = "%$format";

	setlocale(LC_TIME, 'en_US.UTF-8', 'en_US');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
<tr>
  <td>
    <?php echo $format; ?>
  </td>

  <!-- en-US -->
  <td>
    <?php echo $sDate ?>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "en-US");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- en-GB -->
<?php
	setlocale(LC_TIME, 'en_GB.UTF-8', 'en_GB');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "en-GB");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- fr -->
<?php
	setlocale(LC_TIME, 'fr_FR.UTF-8', 'fr_FR', 'fr');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "fr");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- fr-CA -->
<?php
	setlocale(LC_TIME, 'fr_CA.UTF-8', 'fr_CA');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "fr-CA");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- fr-CH -->
<?php
	setlocale(LC_TIME, 'fr_CH.UTF-8', 'fr_CH');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "fr-CH");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- de -->
<?php
	setlocale(LC_TIME, 'de_DE.UTF-8', 'de_DE', 'de');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "de-DE");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- de-CH -->
<?php
	setlocale(LC_TIME, 'de_CH.UTF-8', 'de_CH');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "de-CH");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- hi -->
<?php
	setlocale(LC_TIME, 'hi_IN.UTF-8', 'hi_IN');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "hi-IN");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

  <!-- ko_KR -->
<?php
	setlocale(LC_TIME, 'ko_KR.UTF-8', 'ko_KR');
	$sDate = strftime($format, $date);
	$jsDate = preg_replace('/\n/', '\n', $sDate);
?>
  <td>
    <?php echo $sDate ?>
  </td>
  </td>
  <script type="text/javascript">
  var sDate=YAHOO.util.Date.format(date, {format: "<?php echo $format ?>"}, "ko-KR");
  document.write("<td class='" + (sDate == "<?php echo $jsDate ?>"?"match":"nomatch") + "'>");
  document.write(sDate);
  document.write("</td>\n");
  </script>

</tr>
<?php
}

?>
</table>
<?php
}
?>
</body>
</html>
<?php

setlocale(LC_TIME, 'ko_KR.UTF-8', 'ko_KR');
$lc = array (
	"a" => array(),
	"A" => array(),
	"b" => array(),
	"B" => array(),
	"c" => "%Y %m %d (%a) %r",
	"p" => array(),
	"P" => array(),
	"r" => "%p %I %M %S %p %Z",
	"x" => "%Y %m %d",
	"X" => "%H %M %S"
);
$lc['c'] = strftime("%c");
$lc['r'] = strftime("%r");
$lc['x'] = strftime("%X");
$lc['X'] = strftime("%X");
for($i=6; $i<13; $i++)
{
	$d = strtotime("2008/01/$i");
	$lc['a'][] = strftime("%a", $d);
	$lc['A'][] = strftime("%A", $d);
}
for($i=1; $i<13; $i++)
{
	$d = strtotime("2008/$i/1");
	$lc['b'][] = strftime("%b", $d);
	$lc['B'][] = strftime("%B", $d);
}

$d = strtotime("2008/01/01 10:00:00");
$lc['p'][] = strftime("%p", $d);
$lc['P'][] = strftime("%p", $d);
$d = strtotime("2008/01/01 22:00:00");
$lc['p'][] = strftime("%p", $d);
$lc['P'][] = strftime("%p", $d);

echo "<!-- " . json_encode($lc) . " -->";
?>


