/**
*	
*	wrapper kolem markeru typu google.maps.Marker
*	@data - data pro zobrazeni v bublin ve formatu { title: ... , address: ..., description: ..., score: ..., satisfaction: ..., url: ..., web: ... }
*	@map - reference na google mapu
*	@infomap - reference na bublinu
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.markers.GroupMarker = function( data, map, infoWindow ) {

	var self = this;

	this.callbacks = {};

	//this.id = data.url;
	this.id = data.i;
	this.data = data;
	this.googleMap = map;

	//get html markup 
	var $element = $("<div class='groupMapMarker'>" + data.c + "</div>");
	var element = $element.get(0);
  	//option for marker
  	var groupMarkerOption = {
  		element: element, 
  		position: new google.maps.LatLng( data.a, data.o ), 
  		map:this. googleMap,
  		anchor: new google.maps.Point( 50, 50)
  	};

  	//create new marker, automatically put on map
  	this.groupMarker = new MapMarker( groupMarkerOption );
  
    var mouseDownTime;
    var mouseDownPos;

    $element.on( "mousedown", function( evt ) {
      
      mouseDownPos = [ evt.clientX, evt.clientY ];
      mouseDownTime = new Date().getTime();
      
    } );

    $element.on( "mouseup", function( evt ) {
      
      var nowTime = new Date().getTime();
      var mouseUpPos = [ evt.clientX, evt.clientY ];
      var diff = nowTime - mouseDownTime;
      var mouseMoved = ( mouseUpPos[0] != mouseDownPos[0] || mouseUpPos[1] != mouseDownPos[1] ) ? true : false;

      log( mouseDownPos, mouseUpPos, mouseMoved );

      //zkontrolovat, jestli se pohla mys a neni moc velka prodleva mezi kliknutim
      if( !mouseMoved ) {
        
        ///doslo ke kliku
        self.onClick();
      
      }
     
    } );

}

ScukMap.view.markers.GroupMarker.prototype = {

	remove: function() {

		this.groupMarker.setMap( null );

	},

	/**
	*	handler kliku na marker, otevreni bubliny
	*/
	onClick: function( evt ) {
		
		var bounds = this.createBounds( this.data.b );

		if( this.callbacks.hasOwnProperty( "onClick") ) {
    		this.callbacks.onClick.apply( this, [ bounds ] );
    	}

    },

    createBounds: function( arrBounds ) {

    	var se = arrBounds[ 0 ];
    	var nw = arrBounds[ 1 ];

    	return new google.maps.LatLngBounds( new google.maps.LatLng( se[0], se[1] ), new google.maps.LatLng( nw[0], nw[1] ) );

    }



}