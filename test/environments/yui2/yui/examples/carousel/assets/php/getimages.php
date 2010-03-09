<?php
error_reporting(0);

$images = array(
    'http://farm1.static.flickr.com/112/259393256_db700f455f_s.jpg',
    'http://farm1.static.flickr.com/80/259391136_6fa405c7f6_s.jpg',
    'http://farm1.static.flickr.com/87/258609416_bf0d44b445_s.jpg',
    'http://farm1.static.flickr.com/119/259395209_66c773a072_s.jpg',
    'http://farm1.static.flickr.com/92/259391837_c51c12afae_s.jpg',
    'http://farm1.static.flickr.com/83/259399727_3d170d0445_s.jpg',
    'http://farm1.static.flickr.com/121/258614620_16eb6867f7_s.jpg',
    'http://farm1.static.flickr.com/108/259397333_3e4a3960bd_s.jpg',
    'http://farm1.static.flickr.com/93/258613376_ff23d40bbf_s.jpg',
    'http://farm1.static.flickr.com/87/259398074_395d6000fe_s.jpg',
    'http://farm1.static.flickr.com/112/259383196_7af79d83ef_s.jpg',
    'http://farm1.static.flickr.com/81/258622067_7e136cb6bc_s.jpg',
    'http://farm1.static.flickr.com/95/259394895_8944fe68bc_s.jpg',
    'http://farm1.static.flickr.com/107/259394141_03f8cf975a_s.jpg',
    'http://farm1.static.flickr.com/111/259384471_7e387ad17c_s.jpg',
    'http://farm1.static.flickr.com/108/259396982_b330f60663_s.jpg',
    'http://farm1.static.flickr.com/81/259386441_c5fb7049de_s.jpg'
);

$num = 3;                       // number of items to return
$pos = (int)$_GET['pos'];

$rv = '[';
for ($i = 0; $i < $num; $i++) {
    $rv .= '"'.$images[$pos+$i].'",';
}
$rv = preg_replace('/,$/', '', $rv);
$rv .= ']';

header('Content-Type: application/json');
echo $rv;
?>
