<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Selector Test Suite</title>

<link type="text/css" rel="stylesheet" href="../../../../yui2/build/logger/assets/logger.css">
<link type="text/css" rel="stylesheet" href="../../../../yui2/build/yuitest/assets/testlogger.css">     

<script type="text/javascript" src="../../../build/yui/yui.js"></script>
<script type="text/javascript" src="../../../build/event-custom/event-custom.js"></script>
<script type="text/javascript" src="../../../build/event/event.js"></script>
<script type="text/javascript" src="../../../build/oop/oop.js"></script>
<script type="text/javascript" src="../../../build/dom/dom-debug.js"></script>

<script type="text/javascript" src="../../../../yui2/build/yahoo/yahoo-min.js"></script>
<script type="text/javascript" src="../../../../yui2/build/dom/dom-min.js"></script>
<script type="text/javascript" src="../../../../yui2/build/event/event.js"></script>
<script type="text/javascript" src="../../../../yui2/build/logger/logger-min.js"></script>
<script type="text/javascript" src="../../../../yui2/build/yuitest/yuitest.js"></script>

<script>
onload = function() {
    YUI().use('*', function(Y) {
        //console.log(Y.Selector.query('ol li', document, false));
<<<<<<< HEAD:src/dom/tests/selector_simple.php
        console.log(Y.Selector.query('.first', document.body, true));
=======
        console.log(Y.Selector.query('#demo-foo'));
>>>>>>> master:src/dom/tests/selector_simple.php
    });
};
</script>
<style type="text/css">

</style>
</head>
<body class="body-node">
<span lang="en-us"></span>
    <div id="demo-foo" class="foo" title="this is a demo">
        <p class="para first" id="demo-first-child"><em>lorem ipsum</em></p>
        <p class="para">lorem ipsum</p>
        <p class="para last">lorem ipsum</p>
        <div><p>div lorem</p></div>
        <div id="demo-last-child"><p>last child</p></div>
    </div>

    <div id="demo2">
        <div>child of demo2</div>
    </div>

    <div id="empty"></div>

    <div id="root-test">
        <ol id="nth-test">
            <li class="odd three-1 four-1">foo</li>
            <li class="even four-2 last-four-1">foo</li>
            <li class="odd four-3">foo</li>
            <li class="even three-1 four-4">foo</li>
            <li class="odd four-1">foo</li>
            <li class="even four-2 last-four-1">foo</li>
            <li class="odd three-1 four-3">foo</li>
            <li class="even four-4" id="test-lang-none">foo</li>
            <li class="odd four-1" lang="en-US" id="test-lang-en-us">foo</li>
            <li class="even three-1 four-2 last-four-1" lang="en" id="test-lang-en">foo</li>
        </ol>
        <?php
            $nest = 250;

            for ($i = 0; $i < $nest; $i++) 
            echo <<<END_OF_HTML
        <ol>
            <li class="odd three-1 four-1">foo</li>
            <li class="even four-2 last-four-1">foo</li>
            <li class="odd four-3">foo</li>
            <li class="even three-1 four-4">foo</li>
            <li class="odd four-1">foo</li>
            <li class="even four-2 last-four-1">foo</li>
            <li class="odd three-1 four-3">foo</li>
            <li class="even four-4" id="test-lang-none">foo</li>
            <li class="odd four-1" lang="en-US" id="test-lang-en-us">foo</li>
            <li class="even three-1 four-2 last-four-1" lang="en" id="test-lang-en">foo</li>
        </ol>
END_OF_HTML
?>
    </div>
    <a id="href-test" href="foo.html">foo</a>
    <form id="test-inputs">
        <label for="checkbox-unchecked" id="label-checkbox-unchecked">label</label>
        <input type="checkbox" id="checkbox-unchecked" class="not-button">
        <button>button</button>
        <input type="checkbox" checked id="checkbox-checked-noval" class="not-button">
        <input type="checkbox" checked="true" id="checkbox-checked" class="not-button">
        <input type="radio" id="radio-unchecked" class="not-button">
        <input type="radio" checked="true" id="radio-checked" class="not-button">
        <input type="button" value="foo">
    </form>
    <div class="Bar" id="class-bar"></div>
    <div id="contains-special">contains "' & ]</div>
</body>
</html>
