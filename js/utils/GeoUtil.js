/**
* staticka pomocna trida pro geokodovani, html5 geolocation apod.
**/
ScukMap.utils.GeoUtil = {
  
  geocodeAddress: function(address,callback,region){
      var geocoder = new google.maps.Geocoder();

       geocoder.geocode( { 'address': address, 'region' : region}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          callback(results[0].geometry.location);
        }
         else {
          log("Geocode was not successful for the following reason: " + status);
        }
      });
  },

  decodeAddress: function(latlng,callback,region){
    
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode( { 'location': latlng , 'region' : region}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         callback(results[0].formatted_address);
      }
       else {
        log("Geocode was not successful for the following reason: " + status);
      }
    });
  },

  getGeolocation: function( successCallback, errorCallback, maxAccuracy ) {
    //success callback 
    function success( position ) {
       //check for accuracy if required
       if( maxAccuracy ) {
          var accuracy = position.coords.accuracy;
          
          if( accuracy > maxAccuracy ) {
            //result to shaky, call error
            errorCallback.apply( this, [ "Accuracy too poor." ] );
            return;
          }
       }

       ScukMap.utils.GeoUtil.handleGeolocationSuccess( successCallback, position );
    }

    //error callback
    function error( error ) {
      ScukMap.utils.GeoUtil.handleGeolocationError( errorCallback, error );
    
    }

    //check for support
    if ( navigator.geolocation ) {
      
      navigator.geolocation.getCurrentPosition( success, error, { timeout: 5000 });
    
    } else {
     
      errorCallback.apply( this, [ "Geolocation is not supported by this browser." ] );
    
    }

  },

  handleGeolocationSuccess: function( callback, position ) {
      
      callback.apply( this, [ position ] );
  
  },

  handleGeolocationError: function( callback, error ) {
    
    var msg = "";
    switch( error.code ) {
      case error.PERMISSION_DENIED:
        msg = "User denied the request for Geolocation.";
        break;
      case error.POSITION_UNAVAILABLE:
        msg = "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        msg = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        msg = "An unknown error occurred.";
        break;
    }
    
    callback.apply( this, [ msg ] );

  },

  pointToTile: function( map, latLng, z ) {

      var mercator_range = 256;
      var projection = map.getProjection();
      var worldCoordinate = projection.fromLatLngToPoint(latLng);
      var pixelCoordinate = new google.maps.Point(worldCoordinate.x * Math.pow(2, z), worldCoordinate.y * Math.pow(2, z));
      var tileCoordinate = new google.maps.Point( Math.floor( pixelCoordinate.x / mercator_range ), Math.floor( pixelCoordinate.y / mercator_range ));
      return tileCoordinate;

  },

  latlngToPx: function( map, latLng ) {

    var projection = map.getProjection();
    return projection.fromLatLngToContainerPixel( latLng );

  }

}

