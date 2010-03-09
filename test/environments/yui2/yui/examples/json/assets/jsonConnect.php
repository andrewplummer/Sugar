<?php
/* yadl_spaceid - Skip Stamping */
header('Content-Type: application/json');

$messages =<<<END
[
    { "animal" : "Cat", "message" : "Meow" },
    { "animal" : "Dog", "message" : "Woof" },
    { "animal" : "Cow", "message" : "Moo" },
    { "animal" : "Duck", "message" : "Quack" },
    { "animal" : "Lion", "message" : "Roar" }
]
END;

echo($messages);
?>
