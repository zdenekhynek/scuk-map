/**
*
*	staticka trida pro vsechny ikonky markeru
*	
*	autor: zdenek.hynek@gmail.com
**/

ScukMap.view.markers.MarkersImages = {

	//zakladni nastaveni spritesheetu z markery
	spriteSize: new google.maps.Size( 27, 41 ),
	spriteUrl: "images/mapmarks.png",
	transparentSpriteUrl: "images/mapmarks50.png",

	//stin
	shadowSize: new google.maps.Size( 35, 24 ),
	shadowAnchor: new google.maps.Point( 1, 23 ),
	shadowIcon: null,

	//group marker
	groupMarkerSize: new google.maps.Size( 77, 77 ),
	groupMarkerOrigin: new google.maps.Point( 152, 987 ),

	images: null,
	transparentImages: null,

	init: function() {

		this.images = [];
		this.transparentImages = [];

		//vytvorit markerImage se posouvanym originem
		var len = 12;
		for( var i = 0; i < len; i++ ) {
			//marker image pro normalni stav
			var markerImageOut = new google.maps.MarkerImage( ScukMap.view.markers.MarkersImages.spriteUrl, ScukMap.view.markers.MarkersImages.spriteSize, new google.maps.Point( 0, i * ScukMap.view.markers.MarkersImages.spriteSize.height ) );
			//marker image pro rollover stav
			var markerImageOver = new google.maps.MarkerImage( ScukMap.view.markers.MarkersImages.spriteUrl, ScukMap.view.markers.MarkersImages.spriteSize, new google.maps.Point( ScukMap.view.markers.MarkersImages.spriteSize.width, i * ScukMap.view.markers.MarkersImages.spriteSize.height ) );
			this.images.push( { out: markerImageOut, over: markerImageOver } );
		}

		//vytvorit transparent markerImage
		len = 12;
		for( i = 0; i < len; i++ ) {
			//marker image pro normalni stav
			markerImageOut = new google.maps.MarkerImage( ScukMap.view.markers.MarkersImages.transparentSpriteUrl, ScukMap.view.markers.MarkersImages.spriteSize, new google.maps.Point( 0, i * ScukMap.view.markers.MarkersImages.spriteSize.height ) );
			//marker image pro rollover stav
			markerImageOver = new google.maps.MarkerImage( ScukMap.view.markers.MarkersImages.transparentSpriteUrl, ScukMap.view.markers.MarkersImages.spriteSize, new google.maps.Point( ScukMap.view.markers.MarkersImages.spriteSize.width, i * ScukMap.view.markers.MarkersImages.spriteSize.height ) );
			this.transparentImages.push( { out: markerImageOut, over: markerImageOver } );
		}

		//vytvorit stin ikonku
		this.shadowIcon = new google.maps.MarkerImage( this.spriteUrl, this.shadowSize, new google.maps.Point( 27, 1015 ), this.shadowAnchor );

		//vytvorit group ikonku
		this.groupIcon = new google.maps.MarkerImage( this.spriteUrl, this.groupMarkerSize, this.groupMarkerOrigin, new google.maps.Size( 0, 0 ) );

	},	

	/**
	*	dle typu ve formatu ( [ id:slug:title; id:slug:title ] ) vratit spravnou ikonku pro marker
	*/
	getMarkerImageForType: function( type, transparent ) {

		var markerImageIndex = -1;

		//kolik kategorii markeru?
		//var typeArray = type.split( ";" );
		typeArray = type;
		var numTypes = typeArray.length;

		if( numTypes == 1 ) {
			
			//jedna kategorie kategorii, zjistit id
			//var type = typeArray[ 0 ].split( ":" )[ 0 ];
			var type = typeArray[ 0 ];
			type = parseInt( type );

			//zjistit pro id image ve spritesheetu
			switch( type ) {
				case 1:
					markerImageIndex = 5; 
					break;
				case 2:
					markerImageIndex = 8; 
					break;
				case 3:
					markerImageIndex = 3; 
					break;
				case 4:
					markerImageIndex = 5; 
					break;
				case 5:
					markerImageIndex = 8; 
					break;
				case 6:
					markerImageIndex = 4; 
					break;				
				case 7:
					markerImageIndex = 10;
					break;
				case 8:
					markerImageIndex = 2;
					break;
				case 9:
					markerImageIndex = 3;
					break;
				case 11:
					markerImageIndex = 6;
					break;
			}

		} else {
			
			//vicekategorii 
			markerImageIndex = 0;
		
		}

		return ( !transparent ) ? this.images[ markerImageIndex ] : this.transparentImages[ markerImageIndex ] ;

	}
	
}