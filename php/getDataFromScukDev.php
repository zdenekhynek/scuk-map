<?php

$username = "bobr";
$password = "kvetak776";

$context = stream_context_create(array(
    'http' => array(
        'header'  => "Authorization: Basic " . base64_encode("$username:$password")
    )
));


if( isset($_GET["dataType"]) && $_GET["dataType"] == "detail" ) {

	$id = $_GET["id"];

	//ziskat data pro detail
	$url = "http://dev1.scuk.cz/podniky/mmfk-detail-" . $id ."/";

} else {

	$z = $_GET["z"];
	$l = $_GET["l"];

	//ziskat data pro celou dlazdice
	if( isset($_GET["t"]) && $_GET["t"] > 0 ) 
	{
		$t = $_GET["t"];
		$url = "http://dev1.scuk.cz/mmfk/?z=".$z."&l=".$l."&t=".$t;
	} 
	else 
	{
		$url = "http://dev1.scuk.cz/mmfk/?z=".$z."&l=".$l;
	}

}

$jsonObject = file_get_contents( $url, false, $context);

echo $jsonObject;
?>