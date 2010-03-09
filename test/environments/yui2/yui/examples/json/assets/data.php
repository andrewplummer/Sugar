<?php

/* yadl_spaceid - Skip Stamping */

$inventory = array(
    array("SKU"=>"23-23874", "Price"=>23.99, "Item"=>"Helmet"),
    array("SKU"=>"48-38835", "Price"=>14.97, "Item"=>"Football"),
    array("SKU"=>"84-84848", "Price"=>3.49, "Item"=>"Goggles"),
    array("SKU"=>"84-84843", "Price"=>183.00, "Item"=>"Badminton Set"),
    array("SKU"=>"84-39321", "Price"=>6.79, "Item"=>"Tennis Balls"),
    array("SKU"=>"39-48949", "Price"=>618.00, "Item"=>"Snowboard"),
    array("SKU"=>"99-28128", "Price"=>78.99, "Item"=>"Cleats"),
    array("SKU"=>"83-48281", "Price"=>4.69, "Item"=>"Volleyball"),
    array("SKU"=>"89-32811", "Price"=>0.59, "Item"=>"Sweatband"),
    array("SKU"=>"28-22847", "Price"=>779.98, "Item"=>"Golf Set"),
    array("SKU"=>"38-38281", "Price"=>8.25, "Item"=>"Basketball Shorts"),
    array("SKU"=>"82-38333", "Price"=>1.39, "Item"=>"Lip balm"),
    array("SKU"=>"21-38485", "Price"=>0.07, "Item"=>"Ping Pong ball"),
    array("SKU"=>"83-38285", "Price"=>3.99, "Item"=>"Hockey Puck")
);

header("Content-Type: application/json");
//header("Content-Type: text/plain");
echo json_encode($inventory);

?>
