<?php

/* yadl_spaceid - Skip Stamping */

// Hard-code hostname and path:
$response = "<myroot rootatt='5'><top>topvalue</top><second nested='nestedsecond' /><allitems><livehere><item type='foo'><name type='nametype0'>Abc</name><rank>0</rank><subitem><name type='subnametype0'>subABC</name><age>10</age></subitem></item><item type='bar'><name type='nametype1'>Def</name><rank>1</rank><subitem><name type='subnametype1'>subDEF</name><age>11</age></subitem></item><item type='bat'><name type='nametype2'>Ghi</name><rank>2</rank><subitem><name type='subnametype2'>subGHI</name><age>12</age></subitem></item></livehere></allitems></myroot>";


header("Content-Type: text/xml");
echo $response;

?>
