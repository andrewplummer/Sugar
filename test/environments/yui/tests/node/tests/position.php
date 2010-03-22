<?php
if (!$_GET['quirks']) {
    echo('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'."\n");
}
?>
<html>
<head>
    <title>YUI: GetXY</title>
    <style type="text/css" media="screen">
        
        html {
            border: 0px solid #000;
        }
        
        body {
            background-image: url( grid.png );
            background-position: -12.5px -12.5px;
            height: 2000px;
            margin: 50px;
        }
        .node {
            height: 50px;
            width: 50px;
            border: 3px solid black;
            background-color: #ccc;
            opacity: .5;
            filter: alpha(opacity=50);
        }

        span.node {
            height:auto;
            width:auto;
        }

        .nodeOver {
            position: relative;
            background-color: yellow;
            opacity: .5;
            filter: alpha(opacity=50);
        }
        .nodeOver-table {
            background-color: red;
            opacity: .1;
            filter: alpha(opacity=10);
        }
        .nodeOver-td,
        .nodeOver-th {
            background-color: blue;
        }
        .nodeOver-tr {
            background-color: green;
        }
        #abs1, #abs2, #abs3, #abs4 {
            position: absolute;
            top: 200px;
            left: 200px;
        }
        #rel1, #rel2, #rel3, #rel4 {
            position: relative;
            top: 100px;
            left: 100px;
        }
        span.rel {
            position: relative;
            top:150px;
            left:150px;
        }
        span.abs {
            position: absolute;
            top:250px;
            left:250px;
        }
        #play1, #play2, #play3, #play4 {
            position: relative;
            height: 400px;
            width: 400px;
            border: 3px solid black;
            float: left;
            margin: 10px;
        }

        #play2, #play3, #play4 {
            overflow: auto;
        }

        #play2 .wrap, #play3 .wrap, #play4 .wrap {
            height: 700px;
        }

        #play3, #play4 {
            position: static;
        }

        #runner {
            clear: both;
        }

        #fixed {
            position: fixed;
            top: 0px;
            left: 800px;
        }

        #results {
            border: 1px solid black;
            background-color: #ccc;
            width: 200px;
        }

        #controls {
            position:absolute;
            right:20px;
            top:20px;
        }
        #demo {
            background:#ccc;
            height:10px;
            width:10px;
        }
    </style>
</head>
<body>
<h1 id="h1-1">Positioning Tests</h1>
<div id="demo"></div>
<div id="controls">
    <button id="runner">Run Test</button>
    <button id="cleartest">Clear Test</button>
    <button id="checktest" disabled>Check Test</button>
    <div id="results">No results yet...</div>
</div>
<div id="static1" class="node">S1</div>
<div id="abs1" class="node">A1</div>
<div id="rel1" class="node">R1</div>

<div id="play1">
    <div id="static2" class="node">S2</div>
    <div id="abs2" class="node">A2</div>
    <div id="rel2" class="node">R2</div>
</div>

<div id="play2">
    <div class="wrap">
        <div id="static3" class="node">S3</div>
        <div id="abs3" class="node">A3</div>
        <div id="rel3" class="node">R3</div>
        Lorem ipsum dolor sit amet, <span id="p2-is" class="node st">P2 Static Inline</span> consectetuer adipiscing elit. Morbi sed mauris in magna tincidunt sodales. Etiam dolor. Aenean non justo. Sed nec diam sed lacus pretium luctus. Vivamus felis tortor, cursus vitae, malesuada in, pharetra vel, arcu. Aliquam erat volutpat. Suspendisse potenti. Maecenas in ipsum ac nisl congue congue. Cras a nibh. Praesent non est. 
        Morbi non dolor. <span  id="p2-ir" class="node rel">P2 Rel Inline</span> Donec ut est <span id="p2-ia" class="node abs">P2 Abs Inline</span> vitae quam hendrerit tincidunt. Cras non tellus at lectus luctus ultricies. Nullam bibendum leo quis purus. Curabitur cursus tempus elit. Donec fringilla pede in leo. Morbi dapibus vestibulum enim. Phasellus non mi vel nunc luctus lacinia. Phasellus quis urna. Pellentesque dolor risus, fermentum et, molestie tempus, cursus eget, nisl. 
    </div>
</div>

<div id="play3">
    <div class="wrap">
        <div id="static4" class="node">S4</div>
    </div>
</div>

<div id="play4">
    <div class="wrap">
        <div id="static5" class="node">S5</div>
        <div id="abs4" class="node">A4</div>
        <div id="rel4" class="node">R4</div>
        Lorem ipsum dolor sit amet, <span id="p4-is" class="node st">P4 Static Inline</span> consectetuer adipiscing elit. Morbi sed mauris in magna tincidunt sodales. Etiam dolor. Aenean non justo. Sed nec diam sed lacus pretium luctus. Vivamus felis tortor, cursus vitae, malesuada in, pharetra vel, arcu. Aliquam erat volutpat. Suspendisse potenti. Maecenas in ipsum ac nisl congue congue. Cras a nibh. Praesent non est. 
        Morbi non dolor. <span id="p4-ir" class="node rel">P4 Rel Inline</span> Donec ut est <span id="p4-ia" class="node abs">P4 Abs Inline</span> vitae quam hendrerit tincidunt. Cras non tellus at lectus luctus ultricies. Nullam bibendum leo quis purus. Curabitur cursus tempus elit. Donec fringilla pede in leo. Morbi dapibus vestibulum enim. Phasellus non mi vel nunc luctus lacinia. Phasellus quis urna. Pellentesque dolor risus, fermentum et, molestie tempus, cursus eget, nisl. 
    </div>
</div>

<div id="fixed" class="node">Fixed</div>

<table border="1" width="300" id="table1">
    <caption>I am a table</caption>
    <thead>
        <tr id="tr1">
            <th id="th1">1</th><th id="th2">2</th><th id="th3">3</th><th id="th4">4</th>
        </tr>
    </thead>
    <tbody>
        <tr id="tr2">
            <td id="td2-1">1</td>
            <td id="td2-2">2</td>
            <td id="td2-3">3</td>
            <td id="td2-4">4</td>
        </tr>
        <tr id="tr3">
            <td id="td3-1">1</td>
            <td id="td3-2">2</td>
            <td id="td3-3">3</td>
            <td id="td3-4">4</td>
        </tr>
        <tr id="tr4">
            <td id="td4-1">1</td>
            <td id="td4-2">2</td>
            <td id="td4-3">3</td>
            <td id="td4-4">4</td>
        </tr>
    </tbody>
</table>

    <script type="text/javascript" src="../../../build/yui/yui.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/oop/oop.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/dump/dump.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/event-custom/event-custom.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/event-simulate/event-simulate.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/event/event.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/dom/dom.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/base/base.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/attribute/attribute.js?<?php echo rand(1, 999) ?>"></script>
    <script type="text/javascript" src="../../../build/node/node.js?<?php echo rand(1, 999) ?>"></script>

<script type="text/javascript">
var yConfig = {
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true
    },
    filter: 'debug'
};

YUI(yConfig).use('*', function(Y) {
    var tests = {};
    var sel = 'h1, .node, table th, table td, table tr, table';
    //var sel = '#fixed.node';
    //var sel = '#play1';
    //var sel = 'table tr, table td';

    var play2 = Y.Node.get('#play2');
    play2.set('scrollTop', 50);

    var clearTest = function() {
        var nodeTests = Y.all('.nodeOver');
        if (nodeTests) {
            nodeTests.each(function(n) {
                n.get('parentNode').removeChild(n);
            });
        }
        Y.Node.get('#checktest').set('disabled', true);
        var results = Y.Node.get('document').query('#results');
        results.set('innerHTML', 'No results yet...');
    };

    Y.Node.get('#cleartest').on('click', clearTest);
    Y.Node.get('#runner').on('click', function() {
        clearTest();
        var results = Y.Node.get('document').query('#results');
        results.set('innerHTML', 'Test Run..');

        Y.Node.get('#checktest').set('disabled', false);
        var nodes = Y.Node.get('document').queryAll(sel);
        nodes.each(function(n) {
            var el = document.createElement('div');
            var id = n.get('id') || n._yuid;
            el.id = 'test_' + id;
            el.className = 'nodeOver nodeOver-' + n.get('tagName').toLowerCase();
            document.body.appendChild(el);
            var node = Y.Node.get(el);
            node.setStyles({
                height: n.get('offsetHeight') + 'px',
                width: n.get('offsetWidth') + 'px'
            });
            node.setXY(n.getXY());
        });
    });
    Y.Node.get('#checktest').on('click', function() {
        tests = {
            total: 0,
            pass: 0,
            fail: 0,
            failed: []
        };
        var nodes = Y.Node.get('document').queryAll(sel);
        nodes.each(function(n) {
            var id = n.get('id') || n._yuid;
            var test = Y.Node.get('document').query('#test_' + id);
            var xy1 = n.getXY();

            xy1[0] = Math.round(xy1[0]);
            xy1[1] = Math.round(xy1[1]);

            var xy2 = [test.get('offsetLeft'), test.get('offsetTop')];
            if (xy1[0] !== xy2[0]) {
                tests.fail++;
                tests.failed[tests.failed.length] = 'X failed: ' + id + ' (' + xy1[0] + ', ' + xy2[0] + ')';
            } else {
                tests.pass++;
            }
            if (xy1[1] !== xy2[1]) {
                tests.fail++;
                tests.failed[tests.failed.length] = 'Y failed: ' + id + ' (' + xy1[1] + ', ' + xy2[1] + ')';
            } else {
                tests.pass++;
            }
            tests.total += 2;

        });

        var results = Y.Node.get('document').query('#results');
        results.set('innerHTML', Y.Lang.dump(tests));
        
    });

    Y.get('#demo').setXY([0, 0]);

});

</script>
</body>
</html>
