/**
*
*	stara se o mapu, autocomplete, selectbox
*	@model - 
*	@controller - 
*	@opts - { mapId - id elementu, kam bude vlozena mapa, autoCompleteId - id imputu pro inicializaci autocomplete }
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.View = function ( model, controller, opts ) {

	var self = this;

	this.model = model;
	this.controller = controller;
	this.opts = opts;

	//pridat modelove listenery
	this.model.callbacks.onUpdateData = $.proxy( this.onUpdateData, this );
	this.model.callbacks.onUpdateMarker = $.proxy( this.onUpdateMarker, this );
	
	//nova instance mapy
	this.map = new ScukMap.view.Map( { id: opts.mapId } );
	//pridat listener pro zmenu viewportu
	this.map.callbacks.onViewPortUpdate = $.proxy( this.onViewPortUpdate, this );
	this.map.callbacks.onInfoWindowChange = $.proxy( this.onInfoWindowChange, this );
	this.map.callbacks.onAutoPan = $.proxy( this.onAutoPan, this );

	//nova instance autocomplete
	this.userLocationControl = new ScukMap.view.UserLocationControl( this.opts );
	//pridat listener pro vraceni autocomplete vysledku
	this.userLocationControl.callbacks.onClick = $.proxy( this.onUserLocationControlClick, this );

	//nova instance autocomplete
	this.autoComplete = new ScukMap.view.AutoComplete( this.opts );
	//pridat listener pro vraceni autocomplete vysledku
	this.autoComplete.callbacks.onGeocodeResult = $.proxy( this.onGeocodeResult, this );

	//nova instance categoryselector
	this.typeSelector = new ScukMap.view.TypeSelector( this.opts );
	//pridat listener pro zmenu kategorie
	this.typeSelector.callbacks.onTypeChange = $.proxy( this.onTypeChange, this );
	
	//nova instance hashnavigatoru
	this.hashNavigator = new ScukMap.view.HashNavigator();
	//pridat listener pro zmenu hashe
	this.hashNavigator.callbacks.onHashChange = $.proxy( this.onHashChange, this );

	//flag jestli po zamereni se mas uzivatel premistit na pozici, defaultne na true, pokud je v hashy pri nahrani pozice, prepsat na false
	this.setMapToUserLocation = true;

	//ulozeni id kliknuteho markeru v infowindowChange, bude pridan do autopan
  	this.infoWindowId = null;

}

ScukMap.view.View.prototype = {

	/**
	*	init mapy
	*/
	init: function() {
		//log("view.js init");
		//initializace komponent
		this.map.init();
		this.userLocationControl.init();
		this.autoComplete.init();
		this.typeSelector.init();
		this.hashNavigator.init();

		//pridat controly do mapy
		this.map.addControls( document.getElementById( "controls" ) );

		//nastavit mapu dle parametru v url, jestli jsou nejake
		var state = this.hashNavigator.getInitialState();

		//je v hashy type ?
		var type = this.hashNavigator.getTypeFromHash();
		
		if( type > -1 ) {

			//nastavit type bez vynuceni loadu novych dat, data se nahraji az se zmenou extentu, na startupu by se tedy nahravali dvkarat
			this.typeSelector.setType( type, false );

		}

		//je v hashy marker
		var marker  = this.hashNavigator.getMarkerFromHash();
		if( marker != "" ) {
			
			this.map.openInfoWindow( marker );
		
		}	

		//je v hashy pozice ?
		var position = this.hashNavigator.getPositionFromHash();
		if( position ) {

			//v url nastavena pozice
			this.hashNavigator.lockHash = true;

			//nastavit mapu do pozice z hashe
			this.map.setViewPort( position.latLng, position.zoomLevel );

			//pri geolokaci uzivatele se nema mapa premistit na jeho lokcati
			this.setMapToUserLocation = false;

		} else {
			
			//hash bez lokace
			//mapa ve vychozi pozici pokud ji neprepise geolokace uzivatele
			//log("initDefault");
			this.hashNavigator.lockHash = true;
			this.map.initDefault();
		
		}

		//pokazde pri nahrani se zeptat na polohu
		ScukMap.utils.GeoUtil.getGeolocation( $.proxy( this.onGeolocationResult, this ), $.proxy( this.onGeolocationError, this ) );

	},

	/**
	*	handler zmeny viewportu mapy
	*	@center - stred viewport typu google.maps.LatLng 
	* 	@zoomLevel - potrebny pro hashnavigator
	* 	@tiles - seznam vsech dlazdic ve viewportu
	*/
	onViewPortUpdate: function( center, zoomLevel, tiles ) {
		
		//log("view.js onviewportupdate", this.hashNavigator.lockHash);
		this.controller.updateViewPort( center, zoomLevel, tiles );
		
		//ulozit data do hashe
		if( !this.hashNavigator.lockHash ) {

			if( this.infoWindowId ) {

				this.hashNavigator.updateViewPortAndMarker( center, zoomLevel, this.infoWindowId );
				//resetovat hodnotu
				this.infoWindowId = "";
			
			} else {

				this.hashNavigator.updateViewPort( center, zoomLevel );

			}

		} else {
			//prvni nahrani, odemknout hash pro zapis
			this.hashNavigator.lockHash = false;
		}

	},

	/**
	*	handler obdrzeni novych dat z modelu
	*	TODO - aktualizovat model dat
	*   @data - nova data ve formatu [ {"point": [14, 50], "web": "", "level": 1, "score": 4, "description": "", "title": "Amorino", "url": "/d/amorino/", "address": "", "type": "3:kavarny:Kav\u00e1rny;8:cukrarny:Cukr\u00e1rny", "satisfaction": 1}, { ... } ] 
	*/
	onUpdateData: function( data ) {
		
		this.map.updateData( data );

	},

	/**
	* handler clicknuti na control user location, ktery vrati mapu na zamerenou polohu uzivatele
	* @center - stred mapy typu google.maps.LatLng
	* @zoomLevel - uroven priblizeni mapy
	*/
	onUserLocationControlClick: function( center, zoomLevel ) {
		
		this.map.setViewPort( center, zoomLevel );
	
	},

	/**
	*	handler obdrzeni pozice z autocomplete controleru
	*	@location - obdrzena pozice typu google.maps.LatLng
	* 	@bounds - hranice na zazoomovani typu google.maps.LatLngBounds
	*/
	onGeocodeResult: function( location, bounds ) {
		
		var param = bounds;
		//bylo pro misto nalezno i doporucene bounds ?
		if( typeof( bounds ) === "undefined" ) {
			
			//ne, pouzit defaultni level zoom
			param = this.map.STREET_LEVEL_ZOOM;
		}

		this.map.setViewPort( location, param );

	},

	/**
	*	handler obdrzeni pozice z geolokace prohlizece
	*	@geolocationResults - obdrzena pozice od prohlizece ve formatu { coords: { latitude:..., longitude: ... } }
	*/
	onGeolocationResult: function( geolocationResults ) {
		
		//prevezt data do spravneho formatu
		var coords = geolocationResults.coords;

		//zaokoruhlit na sest
		var mult = 1000000;
		var lat = Math.round( coords.latitude * mult ) / mult;
		var lng = Math.round( coords.longitude * mult ) / mult;
		var latLng = new google.maps.LatLng( lat, lng );

		var defaultZoomLevel = this.map.STREET_LEVEL_ZOOM;

		//byla pri loadu hashy pozice ?
		//var position = this.hashNavigator.getPositionFromHash();
		//log("view.js geolocationresult", this.setMapToUserLocation );
		if( this.setMapToUserLocation ) {
			
			//odemknout hash pro zapis
			this.hashNavigator.lockHash = false;

			//v hashy nebyla pri loadu nastavena pozice ktera ma prednost, mozno nastavit mape stred na uzivatele
			this.map.setViewPort( latLng, defaultZoomLevel );
		
		}

		//aktivovat tlacitko pro navrat na userlocation
		this.userLocationControl.enable( latLng, defaultZoomLevel );

	},

	/**
	*	handler neuspesneho obdrzeni geolokace z prohlizece
	*	@msg - vysvetleni neuspesne geolokace
	*/
	onGeolocationError: function( msg ) {
		
		log( "onGeolocationError", msg );
	
	},

	/**
	*	handler zmeny typu
	*	@type - novy typ dle ciselniku 
	*/
	onTypeChange: function( type, forceDataLoad ) {
		
		this.controller.updateType( type, forceDataLoad );
		this.hashNavigator.updateType( type );
		
	},

	/**
	 *   handler otevreni infoboxu a mozneho posunuti mapy
	 *   @panned - boolean zda byla kvuli otevreni bubliny posunuta mapa
	 */
	onAutoPan: function( panned, infoWindowId ) {
		
		if( !panned ) {
			
			//mapa nepanuje, ulozit rovnou
			this.hashNavigator.updateMarker( infoWindowId );

		} else {

			//ceka se na dopanovani mapy a hash se meni po idle eventu
			this.infoWindowId = infoWindowId;

		}
		
	},

	/**
	*	handler zmeny hashe
	*	@type - novy typ dle ciselniku 
	*/
	onHashChange: function() {
		
		//log("view.js onhashChange",this.hashNavigator.lockHash);

		//neni hash zablokovana
		if( this.hashNavigator.lockHash ) {
			
			//zmena hashe nema zmenit mapu ( napr. kliknuti na marker a potreba pockat na idle mapy )
			this.hashNavigator.lockHash = false;
			return;

		} else {

			
		}

		//zmenila se hash a je potreba updatovat mapu
		
		//je v hashy pozice ?
		var position = this.hashNavigator.getPositionFromHash();
		if( position ) {

			//nastavit mapu do pozice z hashe
			this.map.setViewPort( position.latLng, position.zoomLevel );

		} else {

			//log("view locking hashnavigator");
			//zamknout hash, aby se nezapsal
			this.hashNavigator.lockHash = true;
			//vratit se na defaultni pozici
			this.map.returnToDefaultViewPort();

		}
		
		//je v hashy type ?
		var type  = this.hashNavigator.getTypeFromHash();
		if( type > -1 ) {

			this.typeSelector.setType( type, true );

		} else {

			//nastavit default
			this.typeSelector.setDefault();

		}

		//je v hashy marker
		var marker  = this.hashNavigator.getMarkerFromHash();

		if( marker != "" ) {
			
			this.map.openInfoWindow( marker );
		
		} else {

			this.map.closeInfoWindow();

		}

	},

	/**
	*	handler clicknuti na marker a zavolani pro data, nebo zavreni bubliny
	*	@id - id markeru pro ktere se maji ziskat dat
	*/
	onInfoWindowChange: function( id ) {
		
		//nebyla kliknuto na zaviraci tlacitko ?
		if( id !== "" ) {

			//kliknuto na novy marker,zavolat o data
			this.controller.updateMarker( id );

		} else {

			//kliknuto na zaviraci krizek
			this.hashNavigator.updateMarker( "" );

		}
		
	},

	/**
	*	callback po odbrzeni dat s detailem pro bublinu markeru
	* 	TODO - napsat format dat
	*	@data - data s detailem markeru
	*/
	onUpdateMarker: function( data ) {
		
		this.map.onUpdateMarker( data );

	}

}
