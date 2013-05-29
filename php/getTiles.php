<?php

	/*$dbhost = 'mysql3.ebola.cz';
	$dbuser = 'zdenekhynekcz_ad';
	$dbpass = 'erudaj6a';*/

	require_once( "connection.php" );

	$dbName = "scuk_test2";

	$conn = mysql_connect( $dbhost, $dbuser, $dbpass);
	if( !$conn ) {
	  die('Could not connect: ' . mysql_error());
	}

	mysql_select_db( $dbName );

	if( !isset( $_POST[ "mode" ] ) ) {
		//mysql_select_db('zdenekhynekcz_scuk_test');
		$return_arr = array();

		//set bounding box
		//$sql =  "SET @bbox = GeomFromText('POLYGON((".$lat1." ".$lng2.", " .$lat2. " " .$lng2. ", " .$lat2. " " .$lng1. ", " .$lat1. " " .$lng1. ", ".$lat1." ".$lng2."))')";
		//$fetch = mysql_query( $sql ); 
		//echo $sql;

		$sql = "SELECT id, name, X(position) as lat, Y(position) as lng FROM Places";

		$fetch = mysql_query( $sql ); 
		
		while ($row = mysql_fetch_array($fetch, MYSQL_ASSOC)) {
		    //echo $row[ "name" ] . ", " . $row[ "lat" ] . ", " . $row[ "lng" ] . "<br />";
		    array_push( $return_arr, $row );
		}

		echo json_encode( $return_arr );
	} else if( $_POST[ "mode" ] == "insert" ) {

		//insert update
		//echo "success insert";
		//$data = $_POST;
		$data = $_POST[ "tiles" ];

		$sql = "INSERT INTO Tiles VALUES";
	
		$json = json_decode( $data );
		$i = 0;
		$len = count( $json );

		foreach( $json as $key=>$value ) {
    		
    		//echo $value[0];
    		$keyArr = explode( "-", $key );
    		
    		$sql .=  '(' .$i .', '.$keyArr[0]. ',' . $keyArr[1] . ',' . $keyArr[2] . ',"[' . implode( ",", $value ) . ']")';
			
    		$sql .= ',';
		}

		//remove last comma
		$sql = substr_replace($sql ,"",-1);
		echo $sql;

		//$sql 
		$dumpData = mysql_query( $sql, $conn );
		
		if( !$dumpData )
		{
		  die('Could not enter data: ' . mysql_error());
		}

		//echo "Entered data successfully\n";

	}
	

?>