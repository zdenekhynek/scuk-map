<?php 

/*$dbhost = 'mysql3.ebola.cz';
$dbuser = 'zdenekhynekcz_ad';
$dbpass = 'erudaj6a';*/

require_once( "connection.php" );

if( isset($_GET["dbName"]) ) {

	$dbName = $_GET["dbName"];

}

$conn = mysql_connect( $dbhost, $dbuser, $dbpass);
if( !$conn ) {
  die('Could not connect: ' . mysql_error());
}

mysql_select_db( $dbName );

$return_arr = array();

//$zoomLevel = $_POST["zoomLevel"];
$tiles = $_GET["tiles"];
$tileX = "(";
$tileY = "(";

$tilesArr = explode( "+", $tiles );

foreach( $tilesArr as $tile ) {

	$tileArr = explode( "_", $tile );
	$tileX .= $tileArr[0] .",";
	$tileY .= $tileArr[1] .",";

}

/*foreach( $tiles as $tile ) {

	$tileX .= $tile["x"] .",";
	$tileY .= $tile["y"] .",";

}*/




//remove last comma
$tileX = substr_replace($tileX ,"",-1);
$tileY = substr_replace($tileY ,"",-1);

$tileX .= ")";
$tileY .= ")";


//set bounding box

//SELECT markersIds FROM Tiles 
//SELECT markersIds FROM Tiles WHERE zoomLevel=10 AND tileX=557 AND tileY=351 
//SELECT markersIds FROM Tiles WHERE ( zoomLevel=10 AND tileX=557 AND tileY=351 ) OR ( zoomLevel=10 AND tileX=551 AND tileY=345 )

//$sql = "SELECT markersIds, tileX, tileY FROM Tiles WHERE zoomLevel=".$zoomLevel." AND tileX in ".$tileX." AND tileY in ".$tileY;
$sql = "SELECT markersIds, tileX, tileY FROM Tiles WHERE tileX in ".$tileX." AND tileY in ".$tileY;

//echo $sql;

$fetch = mysql_query( $sql ); 

$markersIds = array();
$markersIdsString = "";

while ($row = mysql_fetch_array($fetch, MYSQL_ASSOC)) {
	$singleRowMarkersIds = $row['markersIds'];
	
	//get rid of last parantheses
	$singleRowMarkersIds = substr( $singleRowMarkersIds, 1 );

	//get rid of last parantheses
	$singleRowMarkersIds = substr_replace($singleRowMarkersIds ,"",-1);

	$markersIdsString .= $singleRowMarkersIds;

	$markersIds[ $row['tileX']."-".$row['tileY'] ] = $singleRowMarkersIds;
}

//echo "sql";
//echo $sql;

//convert arrays to string
//$markersIdsString = implode( ",", $markersIds );

//get 
//SELECT id, name, X(position) as lat, Y(position) as lng FROM Places WHERE id IN( 1,2,3 )

//get rid of last parantheses
//$markersIds = substr( $markersIds, 1 );

//get rid of last parantheses
//$markersIds = substr_replace($markersIds ,"",-1);



foreach ( $markersIds as $key=>$val ) {
    
    if( $dbName != "scuk_test2" ) $sql = "SELECT id, name, X(position) as lat, Y(position) as lng FROM Places WHERE id IN( ". $val ." )";
    else $sql = "SELECT id, name, X(position) as lat, Y(position) as lng, name, web, score,level,description,type,address,satisfaction,url FROM Places WHERE id IN( ". $val ." )";

	$fetch = mysql_query( $sql ); 
	$i = 0;

	$single_request_return_arr = array();




	while ( $row = mysql_fetch_array($fetch, MYSQL_ASSOC) ) {
	  	
	  	$row_array['id'] = $row['id'];
	    $row_array['point'] = array( (float) $row['lng'] , (float) $row['lat'] );
	    if( $dbName != "scuk_test2" ) {
		    $row_array['name'] = $row['name'];
		    $row_array['web'] = "url_" . $i;
		    $row_array['score'] = 1;
		    $row_array['level'] = 2;
		    $row_array['description'] = "description_" .$i;
		    $row_array['type'] = "1:restaurace:Restaurace";
		    $row_array['address'] = "address_" . $i;
		    $row_array['satisfaction'] = 1;
		    $row_array['url'] = $row['id'];
		} else {
			$row_array['name'] = $row['name'];
		    $row_array['web'] = $row["web"];
		    $row_array['score'] = $row["score"];
		    $row_array['level'] = $row["level"];
		    $row_array['description'] = "description has problems with characters";//mysql_real_escape_string( $row["description"] );
		    $row_array['type'] = $row["type"];
		    $row_array['address'] = "description has problems with address";//mysql_real_escape_string( $row["address"] );
		    $row_array['satisfaction'] = $row["satisfaction"];
		    $row_array['url'] = $row['url'];
		}
	    $i++;
	    array_push( $single_request_return_arr, $row_array );
	}

	$return_arr[$key] = $single_request_return_arr;

}


echo json_encode( $return_arr );

?>