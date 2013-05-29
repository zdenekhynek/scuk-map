/**
*	
*	navigace pomoci hash a bbq pluginu
*	@opts - { id - id inputu se zadavanim mist,
*			  mapId - id canvasu s mapou, plugin umi je automaticky zameri }
*	
*	ukazka hashe - #p=52.524873,13.418367&z=14&t=0&m=/d/dos-palillos-berlin/
*
*	autor: zdenek.hynek@gmail.com
*
*/

ScukMap.view.HashNavigator = function( opts ) {

	//constanty klicu v hashy
	this.POSITION_KEY = "p";
	this.ZOOM_KEY = "z";
	this.TYPE_KEY = "t";
	this.MARKER_KEY = "m";
	this.USER_LOCATION_KEY = "ul";

	this.callbacks = {};
	this.opts = opts;

	//flag pro vyhnuti rekurzivnich zmen hashe
	this.lockHash = false;

	//cachovani aktualniho stavu hashe
	this.currentState = null;
}

ScukMap.view.HashNavigator.prototype = {

	init: function() {

		//append hash change
		$( window ).bind( 'hashchange', $.proxy( this.onHashChange, this ) );
		//log( "events", $( window ).data( "events" ) );
		
		this.currentState = $.bbq.getState();
	},

	/**
	*	ziskat uvodni stav hashe
	*/
	getInitialState: function() {

		//using bbq plugin
		var state = $.bbq.getState();
		return state;
	
	},

	/**
	*	promitnout zmenu viewport do hashe
	* 	@bounds - bounds typu google.maps.LatLngBounds
	* 	@zoomLevel - zoom level typu int
	*/
	updateViewPort: function( center, zoomLevel ) {
		
		var currentState = {};
		currentState[ this.POSITION_KEY ] = center.toUrlValue();
		currentState[ this.ZOOM_KEY ] = zoomLevel;

		$.bbq.pushState( currentState );
	    
	},


	/**
	*	promitnout zmenu kategorie do hashe
	* 	@type - 0 vse, 1 - restaurace ...
	*/
	updateType: function( type ) {
		//log("updatetype");
		var typeState = $.bbq.getState( this.TYPE_KEY );
		
		//je potreba updatovat hash ?
		if( typeState !== type ) {
			 
			var state = {};
			state[ this.TYPE_KEY ] = type;
			$.bbq.pushState( state );
		
		}
	
	},

	/**
	*	promitnout otevreni/zavreni bubliny do hashe
	* 	@markerId - id markeru pro zapsani do hashe
	*/
	updateMarker: function( markerId ) {
		
		//potreba zablokovat hash, aby se nevolal onhashChange pri otvirani bubliny, jinak se muze nastavit novy viewport a zablokovat tim autopane
		//this.lockHash = true;

		var state = {};
		state[ this.MARKER_KEY ] = markerId;
		$.bbq.pushState( state );

	},

	/**
	*	pouziti pri autopanu mapy po kliknuti na marker
	* 	@bounds - bounds typu google.maps.LatLngBounds
	* 	@zoomLevel - zoom level typu int
	* 	@markerId - id markeru pro zapsani do hashe
	*/
	updateViewPortAndMarker: function( center, zoomLevel, markerId ) {
		
		//log("udpateviewport");
		var currentState = {};
		currentState[ this.POSITION_KEY ] = center.toUrlValue();
		currentState[ this.ZOOM_KEY ] = zoomLevel;
		currentState[ this.MARKER_KEY ] = markerId;

		$.bbq.pushState( currentState );
	    
	},

	/**
	*	handler zmeny hashe
	*/
	onHashChange: function() {
		
		//updatovat cachovanou hodnotu
		this.currentState = $.bbq.getState();

		if( this.callbacks.hasOwnProperty( "onHashChange" ) ) {

			//log("onHashChange", this.currentState );
			this.callbacks.onHashChange.apply( this, [ this.currentState ] );
	
		}

	},

	/**
	*	vratit v hashy ulozenou hodnotu
	*/
	getPositionFromHash: function() {

		var latLng = null;
		//ziskat hodnot dle klicu
		var position = this.currentState[ this.POSITION_KEY ];
		var zoomLevel = parseInt( this.currentState[ this.ZOOM_KEY ] );

		//jsou v hashy prislusne hodnoty
		if( position != null && !isNaN( zoomLevel ) ) {

			//potreba parsovat pozici, zakodovany pomoci google.maps.latLng.toUrlValue() - 52.524873,13.418367
			var arr = position.split( "," );
			if( arr.length > 1 ) {

				var lat = parseFloat( arr[ 0 ] );
				var lng = parseFloat( arr[ 1 ] );
				
				//jsou cislene hodnoty
				if( !isNaN( lat ) && !isNaN( lng ) ) {

					latLng = new google.maps.LatLng( lat, lng );
			
				}
	
			}
		} 

		//vratit hodnotu, jen pokud position a zoom jsou ok
		var returnObject = null;
		if( latLng instanceof google.maps.LatLng ) {

			returnObject = { latLng: latLng, zoomLevel: zoomLevel };
		
		}

		return returnObject; 

	},

	/**
	*	vratit v hashy ulozeny typ
	*/
	getTypeFromHash: function() {

		var type = -1;

		//je v hashy hodnota se spravnym klicem ?
		var typeInHash = this.currentState[ this.TYPE_KEY ];
		if( typeof typeInHash !== "undefined" && typeInHash !== null ) {
			type = typeInHash;
		}
		
		return type;
	},

	/**
	*	vratit v hashy ulozeny otevreny marker
	*/
	getMarkerFromHash: function() {

		var marker = "";

		//je v hashy hodnota se spravnym klicem ?
		var markerInHash = this.currentState[ this.MARKER_KEY ];
		if( typeof markerInHash !== "undefined" && markerInHash !== null ) {
			marker = markerInHash;
		}
		
		return marker;

	},

	/**
	*	vratit v hashy ulozeny otevreny marker
	*/
	getEnabledUserLocation: function() {

		var enabledUserLocation = false;

		//je v hashy hodnota se spravnym klicem ?
		var ulInHash = this.currentState[ this.USER_LOCATION_KEY ];
		if( typeof ulInHash !== "undefined" && ulInHash === "true" ) {
			enabledUserLocation = true;
		}
		
		return enabledUserLocation;

	}

}
