<?php 

	require_once( "connection.php" );

	$dbName = "scuk_test2";

	$conn = mysql_connect( $dbhost, $dbuser, $dbpass);
	if( !$conn ) {
		die('Could not connect: ' . mysql_error());
	}

	$string = file_get_contents( "../data/zdenek.json" );
	$json = json_decode( $string );

	//echo $json->item( 0 );

	$sql = 'INSERT INTO Places VALUES';
	$i = 0;
	$len = count( $json );

	foreach( $json as $value ) {
		$sql .=  '(' .$i .', GeomFromText("POINT(' .$value->point[1]. ' ' . $value->point[0] . ')"),"' . $value->web . '",' .$value->level. ' , ' .$value->score. ',"' .$value->description. '","' .$value->title. '","' .$value->url .'","' .$value->address. '","' .$value->type. '",' .$value->satisfaction .',' .$i .')';
		if( $i < $len - 1) $sql .= ',';
		$i++;
	}

	mysql_select_db( $dbName );
	$retval = mysql_query( $sql, $conn );
	if(! $retval )
	{
	  die('Could not enter data: ' . mysql_error());
	}

	echo "Entered data successfully\n";
	mysql_close( $conn );

	//echo $sql;

	/*$sql = 'INSERT INTO Places VALUES';
	$len = 10000;
	for( $i = 0; $i< $len; $i++ ) {

		$lat = float_rand( 49, 51 );
		$lng = float_rand( 12, 18 );

		$sql .=  '(' .$i .',"name' .$i. '", GeomFromText("POINT(' .$lat. ' ' .$lng. ')"))';
		if( $i < $len - 1) $sql .= ',';
	}

	echo $sql;

	mysql_select_db('scuk_test');
	$retval = mysql_query( $sql, $conn );
	if(! $retval )
	{
	  die('Could not enter data: ' . mysql_error());
	}
	
	echo "Entered data successfully\n";
	mysql_close( $conn );*/

?>