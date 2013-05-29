<?php $version = "0.23"; ?>

<?php 
  $requestURI = explode("/", $_SERVER["REQUEST_URI"]);
  
  foreach( $requestURI as $uriPart ) {
    
    if( $uriPart == "d" ) {
        $backlink = $_SERVER[ "PHP_SELF" ];
        echo count( $requestURI );
        require( "detailSample.php" );
        return;
    }

  }

  
?>


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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
  <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->

  <link rel="stylesheet" href="css/styles.css?<?php echo $version; ?>">
  
  <!-- All JavaScript at the bottom, except this Modernizr build.
       Modernizr enables HTML5 elements & feature detects for optimal performance.
       Create your own custom Modernizr build: www.modernizr.com/download/ -->
  <script src="js/libs/modernizr-2.5.3.min.js"></script>
  
</head>
<body>
  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
  <header>
  </header>
  <div id="map">
  </div>
  <div id="controls">
    <section class="userLocationControl">
        <div id="userLocationControl"></div>
    </section>
    <section class="autoComplete">
      <form>
          <input id="autoComplete" type="text" placeholder="Napiš adresu" size="30" />
      </form>
    </section>
    <section class="typeSelector">
      <select id="typeSelector">
        <option value="0">Vše</option>
        <option value="1">Restaurace</option>
        <option value="3">Kavárny</option>
        <option value="8">Cukrárny</option>
        <option value="6">Lahůdky</option>
        <option value="5">Ovozel</option>
        <option value="4">Maso</option>
        <option value="11">Ryby</option>
        <option value="2">Pekárny</option>
        <option value="9">Farmy</option>
        <option value="7">Nápoje</option>
      </select>
    </section>
 </div>
 <footer></footer>
  </div>
  
  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  
  <!--<script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.min.js"><\/script>')</script>-->
  <script>window.jQuery || document.write('<script src="js/libs/jquery-1.7.1.js"><\/script>')</script>
  <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyB7MKCUedN9wCarH7GOll39ffkYwZjyHbk&sensor=false&amp;libraries=places"> </script>
  
  <script src="js/libs/jquery.ba-bbq.js"></script>
  <script src="js/libs/jquery.geocomplete.js"></script>
  <script src="js/libs/infobox.js"></script>
  <script src="js/libs/MapMarker.js"></script>

  <script src="js/global.js?<?php echo $version; ?>"> </script>

  <script src="js/utils/GeoUtil.js?<?php echo $version; ?>"> </script>
  <script src="js/utils/DataUtil.js?<?php echo $version; ?>"> </script>
  <script src="js/utils/TextUtil.js?<?php echo $version; ?>"> </script>

  <script src="js/model/DataCache.js?<?php echo $version; ?>"> </script>
  <script src="js/model/SimpleDataProxy.js?<?php echo $version; ?>"> </script>
  <script src="js/model/DataProxy.js?<?php echo $version; ?>"> </script>
  <script src="js/model/DataLocalStorage.js?<?php echo $version; ?>"> </script>
  <script src="js/model/Model.js?<?php echo $version; ?>"> </script>
 
  <script src="js/controller/Controller.js?<?php echo $version; ?>"> </script> 
  
  <script src="js/view/UserLocationControl.js?<?php echo $version; ?>"> </script> 
  <script src="js/view/HashNavigator.js?<?php echo $version; ?>"> </script>
  <script src="js/view/AutoComplete.js?<?php echo $version; ?>"> </script>
  <script src="js/view/InfoWindow.js?<?php echo $version; ?>"> </script>
  <script src="js/view/CustomInfoWindow.js?<?php echo $version; ?>"> </script>
  <script src="js/view/TypeSelector.js?<?php echo $version; ?>"> </script>
  <script src="js/view/markers/GroupMarker.js?<?php echo $version; ?>"> </script>
  <script src="js/view/markers/MarkersImages.js?<?php echo $version; ?>"> </script> 
  <script src="js/view/markers/MarkerManager.js?<?php echo $version; ?>"> </script> 
  <script src="js/view/markers/Marker.js?<?php echo $version; ?>"> </script>  
  <script src="js/view/markers/MarkerGridOverlay.js?<?php echo $version; ?>"> </script>
  <script src="js/view/Map.js?<?php echo $version; ?>"> </script>
  <script src="js/view/View.js?<?php echo $version; ?>"> </script> 
  
  <script src="js/App.js?<?php echo $version; ?>"> </script>

  <script src="js/plugins.js?<?php echo $version; ?>"> </script>
  <script src="js/script.js?<?php echo $version; ?>"> </script> 

  <!--<script src="js/all-ck.js?<?php echo $version; ?>"> </script> -->

</body>
</html>