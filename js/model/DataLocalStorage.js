/**
*
*	wrapper kolem html5 localstorage
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.model.DataLocalStorage = function () {

	//TODO predelat na staticky
	this.DATA_VERSION_KEY = "dataVersion";
	this.MARKER_KEY = "markers";

	this.markersObject = null;

	//debug
	this.totalPushed = null;

}

ScukMap.model.DataLocalStorage.prototype = {

	init: function() {

		
	},

	/**
	*	vlozit item do localstorage
	*	@key
	*	@data 
	*/
	setItem: function( key, data ) {

		//prevest js object na string
		var stringify = JSON.stringify( data );
		//var len = stringify.length;
		//this.totalPushed += len;

		//zkusit vlozit do localstorage
		try { 
        
        	localStorage.setItem( key, stringify );
    	
    	} catch(e) {
        	
        	//local storage pro domenu uz plne, nepodarilo se vlozit
        	if( e.name === "QuotaExceededError" ) {
        		log('quoata exceeded error');
        		return e.name;

        	}
    	
    	}
		
		//log( "totalPushed", this.totalPushed );

	},

	/**
	*	ziskat data z local storage
	*	@key - 
	*/
	getItem: function( key ) {
		
		var returnValue = null;
		var value = localStorage.getItem( key );
		//log("key",key,value);

		if( value ) {

			try {

				//zkusit parsovat jako json
				returnValue = JSON.parse( value );
			
			} catch ( err ) {

				//spatna hodnota, vratit nulu

			}

		}

		return returnValue;

	},

	/**
	*	smazat vse z local storage
	**/
	clear: function() {

		localStorage.clear();

	},

	/**
	*	shoduje se verze data ulozena v local storage s verzi v aplikaci ?
	* 	@dataVersion - cislo aktualni verze
	**/
	isCorrectDataVersion: function( dataVersion ) {

		var correctVersion = false;
		var dataVersionInLS = this.getItem( "dataVersion" );

		//je v local storage stejna verze dat, jako je v aplikaci
		if( dataVersionInLS && dataVersion === dataVersionInLS.dataVersion ) {

			//verze se shoduji
			correctVersion = true;

		}

		return correctVersion;

	},

	/**
	*	ulozit novou verzi 
	*	@dataVersion - cislo aktualni verze
	**/
	updateVersion: function( dataVersion ) {

		this.setItem( "dataVersion",  { dataVersion: dataVersion } );
		
	},

	/**
	*	ziskat z local storage objekt s ulozenymi vsemi spendliky
	**/
	getMarkersObject: function( ) {

		return this.getItem( this.MARKER_KEY );
		
	},

	/**
	*	ulozit do local storage objekt s ulozenymi vsemi spendliky
	**/
	setMarkersObject: function( data ) {

		this.setItem( this.MARKER_KEY, data );

	},

	/**
	*
	*/
	setTile: function( key, data ) {

		//log( "data.length", data, data.length );

		//log("setting tile");

		var i = data.length;
		var idsObject = [];

		//projet vsechny markery a ulozit je do markersobject
		while( i-- ) {

			var dataItem = data[ i ];
			var id = ( dataItem.i instanceof Array ) ? dataItem.i.toString() : dataItem.i;
			this.markersObject[ id ] = dataItem;
			idsObject.push( id );

		}

		//ulozit jen id do tiles
		this.setItem( key, idsObject );
		//log( this.markersObject );
	},

	/**
	*
	*/
	getTile: function( key ) {

		var ids = this.getItem( key );
		var returnObject = [];
		
		if( ids ) {

			//zkontrolovat jestli mame markersobject
			if( !this.markersObject ) this.markersObject = this.getMarkersObject();

			var i = ids.length;
			while( i-- ) {

				var id = ids[i];
				var markerDetails = this.markersObject[ id ];
				if( markerDetails ) returnObject.push( markerDetails );

			}

		}

		//log( "returnObject", returnObject );

		//ulozit jen id do tiles
		return returnObject; 
	},


	/**
	*
	*/
	startNewStorage: function() {

		this.markersObject = this.getMarkersObject();
		if( !this.markersObject ) {

			this.markersObject = {};

		}

	},

	/**
	*
	*/
	endNewStorage: function() {

		this.setMarkersObject( this.markersObject );

	},

}
