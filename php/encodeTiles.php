<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <!-- Use the .htaccess and remove these lines to avoid edge case issues.
       More info: h5bp.com/i/378 -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>Scuk - test</title>
  <meta name="description" content="">

  <!-- Mobile viewport optimized: h5bp.com/viewport -->
  <meta name="viewport" content="width=device-width">

  <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->

  <!-- All JavaScript at the bottom, except this Modernizr build.
       Modernizr enables HTML5 elements & feature detects for optimal performance.
       Create your own custom Modernizr build: www.modernizr.com/download/ -->
  <script src="../js/libs/modernizr-2.5.3.min.js"></script>
  
  <style>

    #map {
      width:300px;
      height:200px;    
    }

  </style>

</head>
<body>
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
  <header>
  </header>
  <div id="map">
  </div>
  <footer></footer>

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  
  <!--<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>-->
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.js"><\/script>')</script>
  <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyB7MKCUedN9wCarH7GOll39ffkYwZjyHbk&sensor=false&amp;libraries=places"> </script>
  
  <script src="../js/global.js"> </script>
  <script src="../js/utils/GeoUtil.js"> </script>

  <script>


    //nastaveni zoomlevelu pro vlozeni do databaze
    var zoomLevel = 18;

    //nastaveni google mapy
    var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    //initializace google mapy
    var map = new google.maps.Map( document.getElementById( "map" ), mapOptions );

    google.maps.event.addListenerOnce( map, 'projection_changed', function() 
    { 
      
      // the map's projection object can now be used 
      console.log( "projection_changed" );

      init();

    }); 


    function init() {
      console.log( "init" );

      $.ajax( {
        type: "POST",
        url: "getTiles.php",
        dataType: 'json',
        success: function( data ) {
          //console.log( "data", data );
          convertPoints( data );
        },
        error: function( msg ) {
          console.log( "init", msg );
        }

      } );

    }

    var tiles = {};

    function convertPoints( data ) {
      
      $.each( data, function( i, pointData ) {

        //console.log( pointData );

        var tileCoord = convertSinglePoint( pointData, zoomLevel );
          
        var key = zoomLevel + "-" + tileCoord.x + "-" + tileCoord.y;
        if( !tiles[ key ] ) {
          tiles[ key ] = [ pointData.id ]; 
        } else {
          tiles[ key ].push( pointData.id );
        }

      } );

      //console.log( tiles );
      sendDataToDb( tiles );

    }

    function convertSinglePoint( data, z ) {
      console.log("convertSinglePoint", data.lat, data.lng );
      var latLng = new google.maps.LatLng( data.lat, data.lng );
      var tileCoord = ScukMap.utils.GeoUtil.pointToTile( map, latLng, z );
      return tileCoord;

    }

    function sendDataToDb( tiles ) {

      $.ajax( {

        url: "getTiles.php",
        type: "POST",
        data: { mode: "insert", tiles:  JSON.stringify( tiles ) },
        success: function( data ) {
          console.log( data );
        },
        error: function( msg ) {
          console.log( msg );
        }

      } );

    }


  </script>


</body>
</html>