/**
*	
*	wrapper kolem markeru typu google.maps.Marker
*	@data - data pro zobrazeni v bublin ve formatu { title: ... , address: ..., description: ..., score: ..., satisfaction: ..., url: ..., web: ... }
*	@map - reference na google mapu
*	@infomap - reference na bublinu
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.markers.Marker = function( data, map, infoWindow ) {

	//random z-index
	this.Z_INDEX = 9;

	this.callbacks = {};

	//this.id = data.url;
	this.id = data.i;
	this.data = data;
	this.googleMap = map;
	this.infoWindow = infoWindow;

	//geograficka pozice bodu
	//var point = data.point;
	var point = [ data.o, data.a ];
	
	//ikonky
	var transparent = ( Math.random() > .5 ) ? true : false;
	//this.icons = ScukMap.view.MarkersImages.getMarkerImageForType( data.type, transparent );
	this.icons = ScukMap.view.markers.MarkersImages.getMarkerImageForType( data.y, transparent );
	//stin
	this.shadowIcon = ScukMap.view.markers.MarkersImages.shadowIcon;

	//vytvor google marker
	var self = this;
	
	this.googleMarker =  new google.maps.Marker( {
      		
      		position: new google.maps.LatLng( point[ 1 ] , point[ 0 ] ), 
      		map: self.googleMap,
      		//title: data.title,
      		title: data.t,
      		icon: this.icons.out,
      		shadow: this.shadowIcon

    } );

	//nastavit googlemarkeru set index pro moznost ovlivnit sortovani markeru
	this.googleMarker.setZIndex( this.Z_INDEX );

    //listenery
    google.maps.event.addListener( this.googleMarker, "click", $.proxy( this.onClick, this ) );
	google.maps.event.addListener( this.googleMarker, "mouseover", $.proxy( this.onMouseOver, this ) );
	google.maps.event.addListener( this.googleMarker, "mouseout", $.proxy( this.onMouseOut, this ) );

}

ScukMap.view.markers.Marker.prototype = {

	/**
	*	handler kliku na marker, otevreni bubliny
	*/
	onClick: function( evt ) {
		
		if( this.callbacks.hasOwnProperty( "onClick") ) {
    		this.callbacks.onClick.apply( this, [ this.id ] );
    	}

    },

    /**
    *	vynutit otevreni infookna na zaklade zmeny hashe
    **/
    openInfoWindow: function() {

    	//zkontrolovat, jestli uz pro dany marker neni infobublina otevrena ( muze se volat po kliku na marker a nasledujici zmene hashe )
    	if( !this.infoWindow.marker || this.infoWindow.marker.id !== this.id ) {
    		
    		google.maps.event.trigger( this.googleMarker, "click" );

    	}
    
    },

	/**
	*	handler mouseover na markeru, zmena ikonky
	*/
	onMouseOver: function() {
		
		//zmenit ikonku na overstate
		this.googleMarker.setIcon( this.icons.over );
		//dat marker nad ostatni markery
		this.googleMarker.setZIndex( this.Z_INDEX + 1 );

		if( this.callbacks.hasOwnProperty( "onMouseOver") ) {
    		this.callbacks.onMouseOver.apply( this, [ this ] );
    	}

	},

	/**
	*	handler mouseout na markeru, zmena ikonky
	*/
	onMouseOut: function() {
		
		//zmenit ikonku na normalni state
		this.googleMarker.setIcon( this.icons.out );
		//vratit marker od rady
		this.googleMarker.setZIndex( this.Z_INDEX );
		
		if( this.callbacks.hasOwnProperty( "onMouseOut" ) ) {
    		this.callbacks.onMouseOut.apply( this, null );
    	}

	},

	setMap: function() {

		this.googleMarker.setMap( null );

	},

	remove: function() {

		this.googleMarker.setMap( null );

	}

}
