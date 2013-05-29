/**
*
*	ulozeni stavu aplikaci, ziskavani dat
*
*   autor: zdenek.hynek@gmail.com
**/

ScukMap.model.Model = function ( opts ) {

	this.callbacks = {};	

	/*{

	  	url: "php/getDataFromScukDev.php",
	  	method: "GET",
	  	withCache: true

	}*/

	this.dataProxy = new ScukMap.model.DataProxy( opts );
	//this.dataProxy = new ScukMap.model.SimpleDataProxy();

	//ukladani stavu aplikace
	this.currentCenter = null;
	this.currentZoomLevel = null;
	this.currentType = 0;
	this.currentTiles = null;
}

ScukMap.model.Model.prototype = {

	init: function() {

		this.dataProxy.init();
	
	},

	/**
	*	volano z kontrolleru, zavola pro nova data pro zmeneny bounding box
	*	@center - stred mapy typu google.maps.LatLng - nepouziva se, misto neho seznam dlazdic
	*	@zoomLevel - priblizeni mapy
	* 	@tiles - pole aktualne viditelnych dlazdic ve viewportu
	*/
	updateViewPort: function( center, zoomLevel, tiles ) {
		
		//log("Model.js updateViewPort", tiles);
		//aktualizovat stav aplikace
		this.currentCenter = center;
		this.currentZoomLevel = zoomLevel;
		this.currentTiles = tiles;

		//zavolat pro data
		this.dataProxy.getData( $.proxy( this.onUpdateData, this ), this.currentZoomLevel, this.currentType, this.currentTiles );
	
	},

	/**
	*	volano z kontrolleru po zmene zobrazovaneho typu
	*	@type - novy zobrazovany typ
	*	@forceDataLoad - maji se natahnout nova data ? false v pripade, ze se nasledovne nastavuje i novy viewport
	*/
	updateType: function( type, forceDataLoad ) {
		
		//aktualizovat stav aplikace
		this.currentType = type;
		
		if( forceDataLoad ) {
			
			//zavolat pro data
			this.dataProxy.getData( $.proxy( this.onUpdateData, this ), this.currentZoomLevel, this.currentType, this.currentTiles );

		}
		
	},

	/**
	*	callback po obdrzeni dat z DataProxy
	*/
	onUpdateData: function( data ) {

		//log("Model.js onUpdateData", data);
		
		if( this.callbacks.onUpdateData ) this.callbacks.onUpdateData.apply( this, [ data ] );
	
	},

	/**
	*
	*/
	updateMarker: function( id ) {

		this.dataProxy.getDataForMarker( $.proxy( this.onUpdateMarker, this ), id );

	},

	onUpdateMarker: function( data ) {

		if( this.callbacks.onUpdateMarker ) this.callbacks.onUpdateMarker.apply( this, [ data ] );
	

	}

}

