/**
*	
*	wrapper infowindow typu google.maps.InfoWindow 
*	@opts - { typeSelectorId - id selectu }
*	
*	autor: zdenek.hynek@gmail.com
*/
ScukMap.view.InfoWindow = function( googleMap ) {	

  this.googleMap = googleMap;
  this.googleInfoWindow = null;
  this.marker = null;

}

ScukMap.view.InfoWindow.prototype = {

	init: function() {

		this.googleInfoWindow = new google.maps.InfoWindow( );

	},

	/**
	*	zavrene okno
	*/
	close: function() {

		this.googleInfoWindow.close();
		this.marker = null;

	},

	/**
	*	nastavit obsah okna
	* 	@data - data pro zobrazeni v bublin ve formatu { title: ... , address: ..., description: ..., score: ..., satisfaction: ..., url: ..., web: ... }
	*/
	setContent: function( data ) {

		//oriznout text v tabulce
		var text = ScukMap.utils.TextUtil.add3dots( data.description, "...", 100 );
		//oddelat Ceska republika
		var address = ScukMap.utils.TextUtil.removeCountry( data.address, ", Česká republika" );

		//oddelat prvni slash
		var url = data.url.substr( 1 );
		
		//pridat hashe
		url += window.location.hash;

		//vytvorit obsah bubliny
		var contentString = "<section class='infoWindow' style='height:300px;'><header><h1>"  + data.title + "</h1>" 
    				   + "<div class='icons'><span class='score' data-score='" + data.score + "'></span><span class='level' data-level='" + data.level + "'></span><span class='satisfaction' data-satisfaction='" + data.satisfaction + "'></span></div>"
    				   + "</header>"
    				   + "<p class='address'>" + address + " <a href='" + data.web + "' target='_blank'>" + data.web + "</a></p>"
    				   + "<p class='desc'>" + text + "</p>" 
    				   + "<footer><a href='" + url + "' title='" + data.title + "'>DETAIL</a></footer></section>";
    	
    	var $contentString = $( contentString );
    	
    	//nastaveni vlastnosti googleInfoWindow
    	var infoOptions = { content: contentString };
    	this.googleInfoWindow.setOptions( infoOptions );
    	
	},

	/**
	*	otevrit okno u markeru
	* 	@marker - marker typu ScukMap.view.Marker, k jeho googleMarker je pridelane infowindow
	*/
	open: function( marker ) {
		
		this.googleInfoWindow.open( this.googleMap, marker.googleMarker );
		//ulozit marker jako referenci, aby se znovu neotviralo okno pro stejny markre
		this.marker = marker;

	}

}
