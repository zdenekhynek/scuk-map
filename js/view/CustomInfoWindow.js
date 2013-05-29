/**
*	
*	wrapper infowindow typu google.maps.InfoWindow 
*	@opts - { typeSelectorId - id selectu }
*	
*	autor: zdenek.hynek@gmail.com
*/
ScukMap.view.CustomInfoWindow = function( googleMap ) {	

  this.SMALL_BUBBLE_LIMIT = 482;
  this.OFFSET_Y = -50;

  this.callbacks = {};

  this.isOpen = false;

  this.googleMap = googleMap;
  this.googleInfoWindow = null;
  this.marker = null;

  this.wrapper = null;
  this.link = null;
  this.userLocation = null;

  //TODO zbavit se tohodle
  this.window = $( window );
}

ScukMap.view.CustomInfoWindow.prototype = {

	init: function() {

		var self = this;

		var myOptions = {

			disableAutoPan: false,
			autoPanCallback: $.proxy( self.onAutoPan, this ),
			closeBoxURL: "images/close.gif",
			alignBottom: true/*,
			boxStyle: { 
                background: "url('images/tipbox.gif') #fff no-repeat"
            }*/

        };
		
		this.googleInfoWindow = new InfoBox( myOptions );
		
		//pridat event na resizovani google infa
    	google.maps.event.addListener( this.googleInfoWindow, "domready", $.proxy( this.onWindowDisplay, this ) );
	
	},

	/**
	*	zavrene okno
	*/
	close: function() {
		
		if( this.isOpen ) {
			
			this.isOpen = false;
			this.googleInfoWindow.close();
			this.marker = null;

		}
		

	},

	/**
	*	nastavit obsah okna
	* 	@data - data pro zobrazeni v bublin ve formatu { title: ... , address: ..., description: ..., score: ..., satisfaction: ..., url: ..., web: ... }
	*/
	setContent: function( data ) {

		//oriznout text v tabulce
		var $description = $( data.description );
		var text = ScukMap.utils.TextUtil.add3dots( $description.text(), "...", 100 );

		//oddelat Ceska republika
		var address = ScukMap.utils.TextUtil.removeCountry( data.address, ", Česká republika" );

		//oddelat prvni slash
		var url = data.url.substr( 1 );
		
		//pridat hashe
		//url += window.location.hash;

		//vytvorit obsah bubliny
		var contentString = "<section class='infoWindow'><header><h1>"  + data.title + "</h1>" 
    				   + "<div class='icons'><span class='score' data-score='" + data.score + "'></span><span class='level' data-level='" + data.level + "'></span><span class='satisfaction' data-satisfaction='" + data.satisfaction + "'></span></div>"
    				   + "</header>"
    				   + "<p class='address'>" + address + " <a href='" + data.web + "' target='_blank'>" + data.web + "</a></p>"
    				   + "<p class='desc'>" + text + "</p>" 
    				   + "<footer><a href='" + url + "' title='" + data.title + "'>DETAIL</a></footer></section>";
    	
    	var $contentString = $( contentString );
    	
    	var pixelOffset, infoBoxClearance;
    	//dle velikosti okna nastavit clearance bubliny, pro koretni autopanning po otevreni bubliny
		if( this.window.width() > this.SMALL_BUBBLE_LIMIT ) {

			pixelOffset = new google.maps.Size( -230, this.OFFSET_Y ); 
			infoBoxClearance = new google.maps.Size( 0, 60 );

		} else {

			//bubliny na mobilu potrebuje vetsi clearance, protoze controly na mape jsou pod sebou a zabiraji vic mista
			pixelOffset = new google.maps.Size( -115, this.OFFSET_Y ); 
			infoBoxClearance = new google.maps.Size( 0, 110 );
			
		}

		//log( "setContent" );
		//log( this.window, this.window.width(), pixelOffset );

    	//nastaveni vlastnosti googleInfoWindow
    	var infoOptions = { content: contentString, pixelOffset: pixelOffset, infoBoxClearance: infoBoxClearance };
    	this.googleInfoWindow.setOptions( infoOptions );


	},

	/**
	*	otevrit okno u markeru
	* 	@marker - marker typu ScukMap.view.Marker, k jeho googleMarker je pridelane infowindow
	*/
	open: function( marker  ) {
		
		this.isOpen = true;
		this.googleInfoWindow.open( this.googleMap, marker.googleMarker );
		
	},

	/**
	*	handler otevreni infoboxu a mozneho posunuti mapy
	* 	@panned - boolean zda byla kvuli otevreni bubliny posunuta mapa
	*/
	onAutoPan: function( panned ) {

		if( this.callbacks.hasOwnProperty( "onAutoPan") ) {
    	
			this.callbacks.onAutoPan.apply( this, [ panned ] );

    	}
		
	},

	/**
	*	otevrit okno u markeru
	* 	@marker - marker typu ScukMap.view.Marker, k jeho googleMarker je pridelane infowindow
	*/
	onWindowDisplay: function() {
		
		//pokud neni v cachy wrapper, pridat		
		if( !this.wrapper ) {

			this.wrapper = $( ".infoBox" );
		
		}

	}
}
