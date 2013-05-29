var opts = { mapId: "map", userLocationControlId: "userLocationControl", autoCompleteId: "autoComplete", typeSelectorId: "typeSelector" };
var brnoLocation = { center: new google.maps.LatLng( 49.19506, 16.60683 ), 
                                viewport: new google.maps.LatLngBounds( new google.maps.LatLng(49.1096552,16.428067899999974), 
                                                                        new google.maps.LatLng(49.29448499999999,16.727853200000027) ) };
var barcelonaLocation = { center: new google.maps.LatLng( 41.3925, 2.1392),
                          viewport: new google.maps.LatLngBounds( new google.maps.LatLng(41.3170475,2.0524765000000116), 
                                                                  new google.maps.LatLng(41.4682658,2.226122000000032) ) };


function clearBeforeTest() {

  $(window).unbind();
  $.bbq.pushState( { lat:"", lng:"", z:"", type:"", marker:"" } );

}


test( "ScukMap.utils.TextUtil.add3dots", function() {

   log( "running test: ScukMap.utils.TextUtil.add3dots" );
  clearBeforeTest();

  equal( ScukMap.utils.TextUtil.add3dots( "Dlouhy text, dlouhy text", "...", 10 ), "Dlouhy tex...", "pridani tecek ok" );
  equal( ScukMap.utils.TextUtil.add3dots( "Prilis kratky text", "...", 30 ), "Prilis kratky text", "zachovani krakteho stringu ok" );

});

test( "ScukMap.view.Autocomplete", function() {
	
  log( "running test: ScukMap.view.Autocomplete" );
  clearBeforeTest();

  var autocomplete = new ScukMap.view.AutoComplete( opts );
	autocomplete.init();

	//log( autocomplete.plugin );
	//module( "TextUtil" );

  ok( 1 == "1", "Passed!" );

  //equal( ScukMap.utils.TextUtil.add3dots( "Dlouhy text, dlouhy text", "...", 10 ), "Dlouhy tex...", "pridani tecek ok" );
  //equal( ScukMap.utils.TextUtil.add3dots( "Prilis kratky text", "...", 30 ), "Prilis kratky text", "zachovani krakteho stringu ok" );

});

module( "ScukMap.view.TypeSelector" );

test( "change type", function() {

  log( "running test: change type" );
  clearBeforeTest();

  expect( 1 );

  var typeInput = 2;

  var typeExpected = -1;
  function onTypeChange( type ) {
    typeExpected = type;
  }

  var typeSelector = new ScukMap.view.TypeSelector( opts );
  typeSelector.callbacks.onTypeChange = onTypeChange;
  typeSelector.init();
  

  typeSelector.setType( typeInput );
  stop();

  setTimeout( function() {

    strictEqual( parseInt( typeExpected ), typeInput );
    start();

  }, 250 );

  //log( autocomplete.plugin );
  //module( "TextUtil" );

  //equal( ScukMap.utils.TextUtil.add3dots( "Dlouhy text, dlouhy text", "...", 10 ), "Dlouhy tex...", "pridani tecek ok" );
  //equal( ScukMap.utils.TextUtil.add3dots( "Prilis kratky text", "...", 30 ), "Prilis kratky text", "zachovani krakteho stringu ok" );

});

module( "ScukMap.view.UserLocationControl" );

test( "disable image control", function() {

  clearBeforeTest();
  log( "running test: disable image control" );

  expect( 2 );

  var ulc = new ScukMap.view.UserLocationControl( opts );
  ulc.init();

  ulc.disable();
  ok( ulc.element.css( "background-image" ).indexOf( "/images/userLocationControlSprite.png" ) > -1, "correct url for disabled image" );
  strictEqual( ulc.element.css( "background-position" ), ulc.DISABLE_IMAGE_OFFSET, "correct url for disable image")

} );

test( "enable image", function() {

  clearBeforeTest();
  log( "running test: enable image" );

  expect( 2 );

  var ulc = new ScukMap.view.UserLocationControl( opts );
  ulc.init();
  ulc.enable();
  
  ok( ulc.element.css( "background-image" ).indexOf( "/images/userLocationControlSprite.png" ) > -1, "correct url for disabled image" );
  strictEqual( ulc.element.css( "background-position" ), ulc.ENABLE_IMAGE_OFFSET, "correct url for enabled image" );

  //nextTest();
} );

asyncTest( "move map", function() {

  log( "running move map" );

  clearBeforeTest();
  expect( 1 );

  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init();
  view.init();

  //setTimeout( function() {

  var location = brnoLocation.center;
  view.userLocationControl.enable( location, 10 );
  view.userLocationControl.element.trigger( "click" );

  setTimeout( function() {
    var state = $.bbq.getState();
    var urlLocation = location.toUrlValue();

    strictEqual( state.p, urlLocation, "correct lat in lng in hash" );

    start();
    
  }, 500 );

  //}, 500 );

  

} );

/*asyncTest( "not move map if control disabled", function() {

  expect( 1 );

  log( "running test: not move map" );
  clearBeforeTest();

  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init();
  view.init();

  //$.bbq.pushState = { lat:"",lng:"",z:"" };

  var location = brnoLocation.center;
  view.userLocationControl.enable( location, 10 );

  view.userLocationControl.disable();
  view.userLocationControl.element.trigger( "click" );

  setTimeout( function() {
    
    var state = $.bbq.getState();
    var urlLocation = location.toUrlValue();

    log( "state", state.p, urlLocation );
    notStrictEqual( state.p, urlLocation , "correct lat in hash" );
   
    start();

  }, 500 );

} );*/

module( "ScukMap.view.HashNavigator");

asyncTest( "Save Brno and Barcelona to hash", function(){

  log( "running test: Save Brno and Barcelona to hash" );
  clearBeforeTest();

  expect( 4 );

  var bounds = brnoLocation.viewport;
  var center = bounds.getCenter();
  var zoomLevel = 5;

  var hashNavigator = new ScukMap.view.HashNavigator( );
  hashNavigator.init();
  hashNavigator.updateViewPort( center, zoomLevel );

  var state = $.bbq.getState();
  var centerUrlValue = center.toUrlValue();
  
  strictEqual( state.p, centerUrlValue , "Latitude, longitude correct" );
  strictEqual( parseFloat( state.z ), zoomLevel, "zoomlevel correct" );

  bounds = barcelonaLocation.viewport;
  center = bounds.getCenter();
  zoomLevel = 5;

  hashNavigator.updateViewPort( center, zoomLevel );

  var state = $.bbq.getState();
  
  strictEqual( state.p, center.toUrlValue() , "Latitude, longitude correct" );
  strictEqual( parseFloat( state.z ), zoomLevel, "zoomlevel correct" );

  start();
});

asyncTest( "Save type to hash", function(){

  log( "running test: Save type to hash" );
  clearBeforeTest();

  expect( 1 );
  var type = 3;
  var hashNavigator = new ScukMap.view.HashNavigator( );
  hashNavigator.init();
  hashNavigator.updateType( type );

  var state = $.bbq.getState();
  
  strictEqual( parseFloat( state.t ), type, "Type correct" );

  start();
});

module( "ScukMap.view");


asyncTest( "initMapWithoutHash", function() {
  
  clearBeforeTest();

  log( "running test: initMapWithoutHash" );
  expect( 1 );
  
  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();

  //log( autocomplete.plugin );
  //module( "TextUtil" );

  setTimeout( function() {
    var mapLocation = view.map.googleMap.getCenter();
    deepEqual( mapLocation, view.map.INITIAL_LATLNG, "Map in default position" );
    start();
  
  }, 500 );


});

asyncTest( "initMapWithLatLngZHash", function() {
  
  log( "running test: initMapWithLatLngZHash" );
  clearBeforeTest();

  expect( 2 );
 
  var krakow = new google.maps.LatLng(50.059077,19.9386);
  var zoomLevel = 13;
  var latlng = krakow.toUrlValue();
  
  var currentState = {};
  currentState[ "p" ] = krakow.toUrlValue();
  currentState[ "z" ] = zoomLevel;
  
  $.bbq.pushState( currentState );

  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();

  //log( autocomplete.plugin );
  //module( "TextUtil" );

  setTimeout( function() {

    var mapLocation = view.map.googleMap.getCenter();
    log( mapLocation );
    
    strictEqual( mapLocation.lat(), krakow.lat(), "Lat in correct position" );
    strictEqual( mapLocation.lng(), krakow.lng(), "Lng in correct position" );
    
    start();
    
  }, 500 );

});

asyncTest( "initMapWithTypeHash", function() {
  
  log( "running test: initMapWithTypeHash" );
  clearBeforeTest();

  expect( 1 );
 
  var expectedType = 2;
  $.bbq.pushState( {t:expectedType} );

  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();

  //log( autocomplete.plugin );
  //module( "TextUtil" );

  setTimeout( function() {

    var mapLocation = view.map.googleMap.getCenter();
    var selectedType = view.typeSelector.selectedType;
    
    strictEqual( parseFloat( selectedType ), expectedType, "types are correct" );
    
    start();
    
  }, 500 );

});

asyncTest( "setMapViewportWithLatLng", function() {
  
  log( "running test: setMapViewportWithLatLng" );
  clearBeforeTest();

  expect( 4 );

  var location = brnoLocation.center;
  var zoomLevel = 15;
 
  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();
  
  view.map.setViewPort( location, zoomLevel );
  view.hashNavigator.lockHash = false;
   
  setTimeout( function() {

      var mapCenter = view.map.googleMap.getCenter();
      var mapZoom = view.map.googleMap.getZoom();
      
      log( "mapCenter", mapCenter, "location:", location );
      
      //check map position correct
      deepEqual( mapCenter, location, "map center correct" );
      strictEqual( zoomLevel, mapZoom, "map zoom correct" );

      var state = $.bbq.getState();
      //log( state, mapCenter.lat(), mapCenter.lng() );
    
      //check hash
      strictEqual( mapCenter.toUrlValue(), state.p, "lat,lng in hash correct" );
      strictEqual( mapZoom, parseFloat( state.z ), "z in hash correct" );

      start();

  }, 500 );

});


asyncTest( "setMapViewportWithLatLng", function() {
  
  log( "running test: setMapViewportWithLatLng" );
  clearBeforeTest();

  expect( 4 );

  var location = brnoLocation.center;
  var zoomLevel = 15;
 
  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();
  
  view.map.setViewPort( location, zoomLevel );
  view.hashNavigator.lockHash = false;
   
  setTimeout( function() {

      var mapCenter = view.map.googleMap.getCenter();
      var mapZoom = view.map.googleMap.getZoom();
      
      log( "mapCenter", mapCenter, "location:", location );
      
      //check map position correct
      deepEqual( mapCenter, location, "map center correct" );
      strictEqual( zoomLevel, mapZoom, "map zoom correct" );

      var state = $.bbq.getState();
      //log( state, mapCenter.lat(), mapCenter.lng() );
    
      //check hash
      strictEqual( mapCenter.toUrlValue(), state.p, "lat,lng in hash correct" );
      strictEqual( mapZoom, parseFloat( state.z ), "z in hash correct" );

      start();

  }, 500 );

});

/*asyncTest( "setMapViewportWithLatLngBounds", function() {
  
  log( "running test: setMapViewportWithLatLngBounds" );
  expect( 3 );

  var bounds = barcelonaLocation.viewport;
  var location = bounds.getCenter();
  
  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();

  view.map.setViewPort( location, bounds );
  view.hashNavigator.lockHash = false;
  
  setTimeout( function() {

    var mapBounds = view.map.googleMap.getBounds();
    
    //compute distance between 
    var neDistance = google.maps.geometry.spherical.computeDistanceBetween( mapBounds.getNorthEast(), bounds.getNorthEast() );
    var swDistance = google.maps.geometry.spherical.computeDistanceBetween( mapBounds.getSouthWest(), bounds.getSouthWest() );
    var limitDistance = 15000;

    //check map
    ok( neDistance < limitDistance, "ne corner of map correct" );
    ok( swDistance < limitDistance, "sw corner of map correct" );
    
    var state = $.bbq.getState();
    var pString = state.p;
    var arr = pString.split("-");
    var latLng = new google.maps.LatLng( parseFloat( arr[0] ), parseFloat( arr[1] ) );
    
    var center = mapBounds.getCenter();
    log( "state", state, mapBounds, center );
    var centerDistance = google.maps.geometry.spherical.computeDistanceBetween( center, latLng );
    //log("centerDistance", arr, centerDistance,latLng, center );

    //check hash
    strictEqual( center.toUrlValue(), state.p , "lat and lng in hash correct" );
    
    start();

  }, 500 );

  
}); */



asyncTest( "setMapViewportWithLatLng", function() {
  
  log( "running test: setMapViewportWithLatLng" );
  clearBeforeTest();

  expect( 4 );

  var location = brnoLocation.center;
  var zoomLevel = 15;
 
  var model = new ScukMap.model.Model();
  var controller = new ScukMap.controller.Controller( model );
  var view = new ScukMap.view.View( model, controller, opts );

  controller.init(); 
  view.init();
  
  view.map.setViewPort( location, zoomLevel );
  view.hashNavigator.lockHash = false;
   
  setTimeout( function() {

      var mapCenter = view.map.googleMap.getCenter();
      var mapZoom = view.map.googleMap.getZoom();
      
      log( "mapCenter", mapCenter, "location:", location );
      
      //check map position correct
      deepEqual( mapCenter, location, "map center correct" );
      strictEqual( zoomLevel, mapZoom, "map zoom correct" );

      var state = $.bbq.getState();
      //log( state, mapCenter.lat(), mapCenter.lng() );
    
      //check hash
      strictEqual( mapCenter.toUrlValue(), state.p, "lat,lng in hash correct" );
      strictEqual( mapZoom, parseFloat( state.z ), "z in hash correct" );

      start();

  }, 500 );

});
