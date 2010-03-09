<?php

/* yadl_spaceid - Skip Stamping */

// This script returns an HTML table

header('Content-type: text/html');

// Define defaults
$rows = 1; // default one row
$cols = 1; // default one column

// How many rows to get?
if(strlen($_GET['rows']) > 0) {
    $rows = $_GET['rows'];
}

// How many columns
if(strlen($_GET['cols']) > 0) {
    $cols = $_GET['cols'];
}

// Return the data
returnMarkup($rows, $cols);

function returnMarkup($rows, $cols) {
    // start the table
    $markup = "<table><thead><tr>";
    
    // build the thead
    for($i=0; $i<$cols; $i++) {
        $markup = $markup."<th>header ".$i."</th>";
    }
    $markup = $markup."</tr></thead><tbody>";  

    // build the tbody
    for($j=0; $j<$rows; $j++) {
        $markup = $markup."<tr>";
        for($i=0; $i<$cols; $i++) {
            $markup = $markup."<td>data cell ".$j."-".$i."</td>";
        }
        $markup = $markup."</tr>";
    }
    // end the table
    $markup = $markup."</tbody></table>";

    echo $markup;
}
?>
