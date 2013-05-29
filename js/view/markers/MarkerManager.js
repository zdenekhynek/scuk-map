/**
*	
*	na zaklade dodavanych dat zobrazuje a schovava markery
*	@map - reference na google mapu
*	@infomap - reference na bublinu
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.markers.MarkerManager = function( map, infoWindow ) {

	this.callbacks = {};

	this.googleMap = map;
	this.infoWindow = infoWindow;
	this.markers = null;
	this.clickedMarker = null;

	//kdyz v hashy marker, ulozi id, u ktereho se ma otevrit bublina po dohrani markeru
	this.openInfoWindowId = "";

	this.activeSingleMarker = null;
}

ScukMap.view.markers.MarkerManager.prototype = {

	init: function() {

		this.markers = {};
		ScukMap.view.markers.MarkersImages.init();

		this.infoWindow.googleInfoWindow.addListener( "closeclick", $.proxy( this.onInfoWindowClose, this ) );
   

	},

	/**
	*	updatovat markery dle dodanych dat
	*/
	updateMarkers: function( data ) {
		
		var self = this;

		//debug
		//this.clearMarkers();

		//pole pro kontrolu pridanych a nepridanych markeru
		var currentMarkers = [];
		
		//vytvor nove markery
		$.each( data, function( i, markerData ) {
			
			//zkontrolovat prazdny object
			if( typeof markerData !== "undefined" && markerData !== null ) {

				//predelat i
				if( markerData.k == 2 ) {
					
					if( markerData instanceof Array ) markerData.i = markerData.i.join(",");
					else markerData.i = markerData.i;
				
				}
				
				//neni marker uz v mape
				//var marker = self.markers[ markerData.url ];
				var marker = self.markers[ markerData.i ];
				
				if( !marker ) {
					
					//novy marker, pridat do mapy
					marker = self.addMarker( markerData );
					
					//zkontrolovat, jestli se u markeru nema otevrit bublina
					if( marker.id == self.openInfoWindowId ) {

						//resetovat hodnotu, potreba jen poprve pri startupu
						self.openInfoWindowId = "";
						marker.openInfoWindow();

					}

				}

				//ulozit pro naslednou kontrolu markeru pro smazani
				currentMarkers[ marker.id ] = marker;

			}
		
		} );

		//smazat nepotrebne markery
		$.each( this.markers, function( i, marker ) {
			
			//neni prazdne policko ?
			if( marker ) {
				
				//je marker v aktualnich datech
				var markerExists = currentMarkers[ marker.id ];
				if( !markerExists ) {

					//smazat marker
					self.clearMarker( marker );

				} 

			}

		} );

	},

	/**
	*	smazat single marker
	*	@marker - marker na smazani typu google.maps.Marker
	*/
	clearMarker: function( marker ) {
		
		marker.remove();
		this.markers[ marker.id ] = null;

	},

	/**
	*	smazat vsechny markery
	*/
	clearMarkers: function() {

		$.each( this.markers, function( i, marker ) {
			
			marker.setMap( null );
		
		});

	},

	/**
	*	pridat single marker dle predpisu v datech
	*/
	addMarker: function( data ) {
		
		var self = this;

		//vytvorit type markeru dle hodnoty data.k
		var marker;
		if( data.k == 1 ) {

			//jednoduchy marker
			marker = new ScukMap.view.markers.Marker( data, this.googleMap, this.infoWindow );
			marker.callbacks.onClick = $.proxy( this.onMarkerClick, this );
			marker.callbacks.onMouseOver = $.proxy( this.onMarkerMouseOver, this );
			marker.callbacks.onMouseOver = $.proxy( this.onMarkerMouseOver, this );
			marker.callbacks.onMouseOut = $.proxy( this.onMarkerMouseOut, this );

		} else {

			//group marker
			marker = new ScukMap.view.markers.GroupMarker( data, this.googleMap, this.infoWindow );
			marker.callbacks.onClick = $.proxy( this.onGroupMarkerClick, this );

		}

		//vlozit marker do cache
		this.markers[ marker.id ] = marker;
		
		return marker;

	},

	removeMarker: function() {

	},

	/**
    *	handler clicku na marker, odeslat pro zapsani hashe a nahrani detailnich dat
    **/
	onMarkerClick: function( id ) {
		
		//zavrit bublinu 
	    this.infoWindow.close();

		this.clickedMarker = this.markers[ id ];

		//nastavit infowindow novy marker
		this.infoWindow.marker = this.clickedMarker;

		if( this.callbacks.hasOwnProperty( "onInfoWindowChange" ) ) {
    		this.callbacks.onInfoWindowChange.apply( this, [ id ] );
    	}

	},

	/**
    *	
    **/
	onMarkerMouseOver: function( marker ) {
		
		this.activeSingleMarker = marker;

	},

	/**
    *	
    **/
	onMarkerMouseOut: function( marker ) {
		
		this.activeSingleMarker = null;

	},

	/**
    *	handler clicku na marker, odeslat pro zapsani hashe
    **/
	onGroupMarkerClick: function( bounds ) {
		
		if( this.activeSingleMarker ) return;

		if( this.callbacks.hasOwnProperty( "onGroupMarkerClick" ) ) {
    	
    		this.callbacks.onGroupMarkerClick.apply( this, [ bounds ] );
    	
    	}

	},

	/**
    *	handler zavreni infowindow, odeslat pro zapsani hashe
    **/
  	onInfoWindowClose: function(  ) {
    	
    	if( this.callbacks.hasOwnProperty( "onInfoWindowChange" ) ) {
	    
	      this.callbacks.onInfoWindowChange.apply( this, [ "" ] );
	    
	    }

  	},

  	/**
  	* 	callback po obdrzeni dat s detailem markeru, otevrit infowindow
  	*   TODO - predelat format dat
  	*   @data - nova data ve formatu [ {"point": [14, 50], "web": "", "level": 1, "score": 4, "description": "", "title": "Amorino", "url": "/d/amorino/", "address": "", "type": "3:kavarny:Kav\u00e1rny;8:cukrarny:Cukr\u00e1rny", "satisfaction": 1}, { ... } ] 
  	**/
  	onUpdateMarker: function( data ) {
	    
	    //vlozit novy obsah
	    this.infoWindow.setContent( data );
	    //otevrit bublinu
	    this.infoWindow.open( this.clickedMarker );

	},

  	/**
    *	vynutit otevreni infookna na zaklade zmeny hashe
    **/
	openInfoWindow: function( id ) {
    	
    	var marker = this.markers[ id ];
    	if( marker ) {

    		marker.openInfoWindow();

    	} else {

    		this.openInfoWindowId = id;

    	}
		
  	},

  	/**
    *	vynutit zavreni infowindow na zaklade zmeny hashe
    **/
  	closeInfoWindow: function() {

  		if( this.infoWindow ) {

  			this.infoWindow.close();

  		}

  	}

}

