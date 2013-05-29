<?php

/*$dbhost = 'mysql3.ebola.cz';
$dbuser = 'zdenekhynekcz_ad';
$dbpass = 'erudaj6a';*/

require_once( "connection.php" );

$conn = mysql_connect( $dbhost, $dbuser, $dbpass);
if( !$conn ) {
  die('Could not connect: ' . mysql_error());
}

mysql_select_db( $dbName );
//mysql_select_db('zdenekhynekcz_scuk_test');
$return_arr = array();

$lat1 = $_POST["lat1"];
$lng1 = $_POST["lng1"];
$lat2 = $_POST["lat2"];
$lng2 = $_POST["lng2"];

//set bounding box
$sql =  "SET @bbox = GeomFromText('POLYGON((".$lat1." ".$lng2.", " .$lat2. " " .$lng2. ", " .$lat2. " " .$lng1. ", " .$lat1. " " .$lng1. ", ".$lat1." ".$lng2."))')";
$fetch = mysql_query( $sql ); 
//echo $sql;

$sql = "SELECT id, X(position) as lat, Y(position) as lng, web, level, score, description, title, url, address, type, satisfaction FROM Places WHERE INTERSECTS(position, @bbox)";

$fetch = mysql_query( $sql ); 

while ($row = mysql_fetch_array($fetch, MYSQL_ASSOC)) {
    $row_array['id'] = $row['id'];
    $row_array['point'] = array( $row['lat'], $row['lng'] );
    $row_array['web'] = $row['web'];
    $row_array['level'] = $row['level'];
    $row_array['score'] = $row['score'];
    $row_array['description'] = $row['description'];
    $row_array['title'] = $row['title'];
    $row_array['url'] = $row['url'];
    $row_array['address'] = $row['address'];
    $row_array['type'] = $row['type'];
    $row_array['satisfaction'] = $row['satisfaction'];

    array_push($return_arr,$row_array);
}

//echo "\n";
//echo $sql;


/*
SET @bbox = GeomFromText('POLYGON((50.175138898964384 14.721472113281266, 49.96535568274245 14.721472113281266, 49.96535568274245 14.144689886718766, 50.175138898964384 14.144689886718766, 50.175138898964384 14.721472113281266))');
SELECT id, X(position) as lat, Y(position) as lng, web, level, score, description, title, url, address, type, satisfaction FROM Places WHERE INTERSECTS(position, @bbox) ; 

SET @bbox = GeomFromText('POLYGON((50.175138898964384 14.144689886718766, 50.175138898964384 14.721472113281266, 49.96535568274245 14.721472113281266, 49.96535568274245 14.144689886718766, 50.175138898964384 14.144689886718766))');
SELECT id, X(position) as lat, Y(position) as lng, web, level, score, description, title, url, address, type, satisfaction FROM Places WHERE INTERSECTS(position, @bbox) ; 


*/

echo json_encode($return_arr);
?>

