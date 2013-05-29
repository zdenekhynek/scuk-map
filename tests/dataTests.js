module( "ScukMap.model.DataLocalStorage" );

function clearLocalStorage( ) {

	localStorage.clear();

}

test( "setItem", function() {

	log( "running test: setItem" );

	expect( 3 ) ;
	clearLocalStorage();

	var dataCache = new ScukMap.model.DataLocalStorage();
	var key = "fadfasdfa";	
	var dataTo = "fadfasdfa sdfasdfa dsfa dsfasdfa";

	dataCache.setItem( key, dataTo );

	var dataFrom = dataCache.getItem( key );
	strictEqual( dataTo, dataFrom, "dataFrom, dataTo the same" );

	key = "12-15-12-15";	
	dataTo = "fadfasdfaa fasdf asdfa sdfasd asdfads sdfasdfa dsfa dsfasdfa";

	dataCache.setItem( key, dataTo );

	dataFrom = dataCache.getItem( key );
	strictEqual( dataTo, dataFrom, "dataFrom, dataTo the same" );

	key = ";'..//";	
	dataTo = "fadfasd'fadsfads\asdfasdfasdfasd";

	dataCache.setItem( key, dataTo );

	dataFrom = dataCache.getItem( key );
	strictEqual( dataTo, dataFrom, "dataFrom, dataTo the same" );

});

test( "setItem with clearing storage", function() {

	log( "running test: setItem with clearing storage" );

	expect( 1 ) ;
	clearLocalStorage();

	var dataCache = new ScukMap.model.DataLocalStorage();
	var key = "fadfasdfa";	
	var dataTo = "fadfasdfa sdfasdfa dsfa dsfasdfa";

	dataCache.setItem( key, dataTo );

	clearLocalStorage();

	var dataFrom = dataCache.getItem( key );
	notStrictEqual( dataTo, dataFrom, "dataFrom, dataTo not the same" );

});

test( "overflow local storage", function() {

	log( "running test: overflow local storage" );

	expect( 1 ) ;
	clearLocalStorage();

	var dataCache = new ScukMap.model.DataLocalStorage();

	var len = 2000;
	for( var i = 0; i < len; i++ ) {

		var dataTo = i + "ffřěžýáířěfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčřfřěžýáířěš+ýř+íěšř=ý+ěíšáéřý+šěíř+éěšříáý+šěř+šěéříá+ýěšř+ěšéíářý+ěšř+ěšěščřěčřěčšřěščřěščřěčšřěčšřěčřěčř" + i;
		var key = i;

		var msg = dataCache.setItem( key, dataTo );

		if( msg === "QuotaExceededError" ) {

			ok( true, "quota overexceeded" );
			return;

		}
	}

});


module( "ScukMap.model.DataCache" );

var dataDump = [{i:"0",address: "address_0",description: "description_0",id: "157",level: 2,name: "name157",point: [15.413972208,49.7980589284],satisfaction: 1,score: 1,type: "1:restaurace:Restaurace",url: "157",web: "url_0"},
                {i:"1",address: "address_1",description: "description_1",id: "1558",level: 2,name: "name1558",point:[15.3482793213,49.7454445142],satisfaction: 1,score: 1,type: "1:restaurace:Restaurace",url: "1558",web: "url_1"},
                {i:"2",address: "address_2",description: "description_2",id: "2641",level: 2,name: "name2641",point: [15.4140894624,49.7981963683],satisfaction: 1,score: 1,type: "1:restaurace:Restaurace",url: "2641",web: "url_2"}];

test( "basic datacache", function() {

	log( "running test: basic datacache" );

	expect( 5 );
  clearLocalStorage();

	var dc = new ScukMap.model.DataCache();
	dc.init();

	//check for runtime cache
	ok( dc.cache, "runtime cache exists" );

	//check for existince of local storage
	ok( dc.localStorage, "local storage exists" );

	var dataTo = dataDump;
	var x = 234;
	var y = 324;
	var type = 3;

  dc.startNewStorage();
	dc.store( dataTo, x, y, type );

	var dataFrom = dc.get( x, y, type );
	strictEqual( dataTo, dataFrom, "dataFrom, dataTo the same" );

	//check local storage
	var constructedKey = dc.constructKey( x, y, type );
 	var dataFromLC = dc.localStorage.getTile( constructedKey );
  
	deepEqual( dataFromLC, dataTo, "data in local storage correct" );

	//check runtime cache 
	var dataFromRuntimeCache = dc.cache[ constructedKey ];

	strictEqual( dataFromRuntimeCache, dataTo, "data in runtime storage correct" );

} );

test( "basic datacache with clearing", function() {

	log( "running test: basic datacache with clearing" );
  
	expect( 3 );
  clearLocalStorage();

	var dc = new ScukMap.model.DataCache();
	dc.init();

	var key = "fadfasdfa";	
	var dataTo = dataDump;
	var x = 234;
	var y = 324;
	var type = 3;

  dc.startNewStorage();
	dc.store( dataTo, x, y, type );
  dc.endNewStorage();

	dc.clear();

	var dataFrom = dc.get( x, y, type );
	strictEqual( undefined, dataFrom, "dataFrom is null" );

	//check local storage
  dc.startNewStorage();
	dc.store( dataTo, x, y, type );
  dc.endNewStorage();

	//clear just runtime
	dc.clear( true, false );

	var constructedKey = dc.constructKey( x, y, type );
	var dataFromLC = dc.localStorage.getTile( constructedKey );
	deepEqual( dataFromLC, dataTo, "data in local storage correct" );

	//check runtime cache 
	var dataFromRuntimeCache = dc.cache[ constructedKey ];
	strictEqual( dataFromRuntimeCache, undefined, "data runtime cache is null" );



} );

module( "ScukMap.model.DataProxy" );

asyncTest( "getDataFromServer without cache", function(){

  log( "running test: getDataFromServer without cache" );
  
  expect( 9 );

  var tiles = "138_86+139_86+138_87+139_87";
  //var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var type = 0;
  var zoomLevel = 8;

  var expectedMarkerCount = 4126;
  var tilesToLoad = encodeURIComponent( tiles );

  var dataProxyOptions = {

  	url: "../php/getDataFromScukDev.php",
    method: "GET",
      //dbName: "scuk_test2",
      //dataType: "jsonp",
    withCache: false,
    dataVersion: 0.2
    
  }

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();

  function complete( data ) {

    //log( data );

  	strictEqual( expectedMarkerCount, data.length , "all markers returned" );
  	
  	var randomIndex = Math.floor( Math.random() * data.length );
  	var randomMarker = data[ randomIndex ];
  	ok( randomMarker.hasOwnProperty("address"), "address ok" ); 
  	ok( randomMarker.hasOwnProperty("description"), "description ok" ); 
  	ok( randomMarker.hasOwnProperty("level"), "level ok" ); 
  	ok( randomMarker.hasOwnProperty("point"), "point ok" ); 
  	ok( randomMarker.hasOwnProperty("url"), "url ok" );

  	var point = randomMarker.point;
  	ok( !isNaN( parseFloat( point[0] ) ) && !isNaN( parseFloat( point[1] ) ), "point values ok" );

  	//check marker type
  	var markerType = ScukMap.utils.DataUtil.parseMarkerType( randomMarker.type );

  	ok( markerType.length > 0, "marker type found");
  	ok( !isNaN( parseFloat( markerType[0] ) ), "marker type is number" );

  	start();	

  }

  dataProxy.getDataFromServer( complete, zoomLevel, tiles, type );
  
});

asyncTest( "getData without cache", function(){

  log( "running test: getData without cache" );
  
  expect( 9 );

  //var tiles = [ "138-86", "139-86", "138-87", "139-87" ];
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var zoomLevel = null;
  var center = null;
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var expectedMarkerCount = 4126;

  var dataProxyOptions = {

  	url: url,
  	method: "GET",
  	withCache: false,
  	dataVersion: 0.1

  }

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();

  function complete( data ) {

	strictEqual( expectedMarkerCount, data.length , "all markers returned" );
	
	var randomIndex = Math.floor( Math.random() * data.length );
	var randomMarker = data[ randomIndex ];
	
	ok( randomMarker.hasOwnProperty("address"), "address ok" ); 
	ok( randomMarker.hasOwnProperty("description"), "description ok" ); 
	ok( randomMarker.hasOwnProperty("level"), "level ok" ); 
	ok( randomMarker.hasOwnProperty("point"), "point ok" ); 
	ok( randomMarker.hasOwnProperty("url"), "url ok" );

	var point = randomMarker.point;
	ok( !isNaN( parseFloat( point[0] ) ) && !isNaN( parseFloat( point[1] ) ), "point values ok" );

	//check marker type
	var markerType = ScukMap.utils.DataUtil.parseMarkerType( randomMarker.type );

	ok( markerType.length > 0, "marker type found");
	ok( !isNaN( parseFloat( markerType[0] ) ), "marker type is number" );

	start();	

  }

  dataProxy.getData( complete, 0, tiles );
  
});

asyncTest( "getData with cache", function(){

  log( "running test: getData with cache" );
  
  expect( 3 );

  //var tiles = [ "138-86", "139-86", "138-87", "139-87" ];
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var zoomLevel = null;
  var center = null;
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var dataProxyOptions = {

  	url: url,
  	method: "GET",
  	withCache: true,
  	dataVersion: 0.1

  }

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();
  dataProxy.dataCache.clear();

  //check for existence of data cache
  ok( dataProxy.dataCache, "datacache exists" );

  function complete( data ) {

  	//check everything is stored in the runtime cache
  	var len = data.length;
  	var runtimeCache = dataProxy.dataCache.cache;
  	var runtimeCacheLen = 0;

  	for( var key in runtimeCache ) {
  		
  		var tileItem = runtimeCache[ key ];
  		var tileItemLen = tileItem.length;
  		for( var i=0; i < tileItemLen;i++){
  			runtimeCacheLen++;
  		}
  	}

	strictEqual( len, runtimeCacheLen, "everything in runtime cache" );

	//check local storage
	var tilesInLS = [];
	for( key in runtimeCache ) {
  		
  		tilesInLS = tilesInLS.concat( dataProxy.dataCache.localStorage.getItem( key ) );
  	
  	}

  	//is everything in local storage
  	strictEqual( len, tilesInLS.length, "everything in local storage" );

  	//get all tiles from local storage
	start();	

  }

  dataProxy.getData( complete, 0, tiles );
  
});

asyncTest( "check uniqnuess of data", function(){

  log( "running test: check uniqnuess of data" );
  
  expect( 1 );
  clearLocalStorage();

  //var tiles = [ "138-86", "139-86", "138-87", "139-87" ];
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var dataProxyOptions = {

    url: url,
    method: "GET",
    withCache: true,
    dataVersion: 0.1

  };

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();
  dataProxy.dataCache.clear();

  function complete( data ) {

    //check everything is stored in the runtime cache
    var len = data.length;
    var runtimeCache = dataProxy.dataCache.cache;
    var runtimeCacheLen = 0;

    //store ids
    var storedIds = [];
    var unique = true;

    for( var tileIndex in tiles ) {
      var tile = tiles[tileIndex];
      var constructKey = dataProxy.dataCache.constructKey( tile.x, tile.y, type);
      var ids = dataProxy.dataCache.localStorage.getItem( constructKey);

      //log( ids );

      //loop through ideas and check for uniqueness
      var len = ids.length;
      for( var i = 0; i < len; i++ ) {

          var id = ids[i];
          if( !storedIds[id] ) {
            storedIds[ id ] = true;
          } else {  
            //something is wrong, id is already in array
            log("already presnet id", id);
            unique = false;
            break;
          }
      }

      for( var q = 0; q < data.length; q++ ) {
        var item = data[q];
        if( item.web == "url_980" ) {
          log( item );
        }
      }

     //test sql queries
     /*
     SELECT * FROM  Tiles
    SELECT * FROM Tiles WHERE markersIds LIKE %9%
    SELECT * FROM Tiles WHERE markersIds LIKE '%980%'
    SELECT * FROM Tiles WHERE markersIds LIKE '%,980,%'



    */

    }

    ok( unique, "all stored ids are present only once (in one tile)");
    start();  

  }

  dataProxy.getData( complete, 0, tiles );
  
});

asyncTest( "check same dataVersion", function(){

  log( "running test: check dataVersion" );
  
  expect( 1 );
	
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var zoomLevel = null;
  var center = null;
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var keys = [];

  var dataProxyOptions = {

  	url: url,
  	method: "GET",
  	withCache: true,
  	dataVersion: 0.1

  }

  clearLocalStorage();

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();

  function complete( data ) {

  	var runtimeCache = dataProxy.dataCache.cache;

  	for( var key in runtimeCache ) {
  		
  		keys.push( key );
  	}

  	//everything is in local storage, create new dataproxy with the same version name
  	dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  	dataProxy.init();

  	//the local storage shoud be empty
  	var dc = dataProxy.dataCache;

  	var randomKey = keys[ Math.floor( keys.length * Math.random() ) ];
  	
  	var arr = randomKey.split("-");
  	var x = parseInt( arr[0] );
  	var y = parseInt( arr[1] );
	
	var dcItem = dc.get( x, y, type );  		
	
	ok( dcItem, "there shoud be data in the local storage");

	//strictEqual( len, runtimeCacheLen, "everything in runtime cache" );

	
  	//get all tiles from local storage
	start();	

  }

  dataProxy.getData( complete, 0, tiles );
  
});

asyncTest( "check different dataVersion", function(){

  log( "running test: check dataVersion" );
  
  expect( 1 );
	
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var zoomLevel = null;
  var center = null;
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var keys = [];

  var dataProxyOptions = {

  	url: url,
  	method: "GET",
  	withCache: true,
  	dataVersion: 0.1

  }

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();
  dataProxy.dataCache.clear();

  function complete( data ) {

  	var runtimeCache = dataProxy.dataCache.cache;

  	for( var key in runtimeCache ) {
  		
  		keys.push( key );
  	}

  	//everything is in local storage, create new dataproxy with different version name
  	dataProxyOptions.dataVersion = 0.1;
	dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  	dataProxy.init();

  	//the local storage shoud be empty
  	var dc = dataProxy.dataCache;

  	var randomKey = keys[ Math.floor( keys.length * Math.random() ) ];
  	log( "randomKey", randomKey );
  	var arr = randomKey.split("-");
  	var x = parseInt( arr[0] );
  	var y = parseInt( arr[1] );
	
	var dcItem = dc.get( x, y, type );  		
	
	equal( dcItem, null, "there shoudln't be anything in the local storage");

	//strictEqual( len, runtimeCacheLen, "everything in runtime cache" );

	
  	//get all tiles from local storage
	start();	

  }

  dataProxy.getData( complete, 0, tiles );
  
});

asyncTest( "check different dataVersion", function(){

  log( "running test: check dataVersion" );
  
  expect( 1 );
  
  var tiles = [ {x:138,y: 86}, {x:139, y:86}, {x:138, y:87}, {x:139, y:87} ];
  var zoomLevel = null;
  var center = null;
  var type = 0;
  var url = '../php/getDataByTiles.php';

  var keys = [];

  var dataProxyOptions = {

    url: url,
    method: "GET",
    withCache: true,
    dataVersion: 0.1

  }

  var dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
  dataProxy.init();
  dataProxy.dataCache.clear();

  function complete( data ) {

    var runtimeCache = dataProxy.dataCache.cache;

    for( var key in runtimeCache ) {
      
      keys.push( key );
    }

    //everything is in local storage, create new dataproxy with different version name
    dataProxyOptions.dataVersion = 0.1;
  dataProxy = new ScukMap.model.DataProxy( dataProxyOptions );
    dataProxy.init();

    //the local storage shoud be empty
    var dc = dataProxy.dataCache;

    var randomKey = keys[ Math.floor( keys.length * Math.random() ) ];
    var arr = randomKey.split("-");
    var x = parseInt( arr[0] );
    var y = parseInt( arr[1] );
  
  var dcItem = dc.get( x, y, type );      
  
  equal( dcItem, null, "there shoudln't be anything in the local storage");

  //strictEqual( len, runtimeCacheLen, "everything in runtime cache" );

  
    //get all tiles from local storage
  start();  

  }

  dataProxy.getData( complete, 0, tiles );
  
});

