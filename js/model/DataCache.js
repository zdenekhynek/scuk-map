/**
*
*	cache pro ziskavani dat z local storage nebo polyfillu
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.model.DataCache = function () {

	this.cache = null;
	this.localStorage = null;
	this.dataVersion = null;

}

ScukMap.model.DataCache.prototype	= {

	init: function() {

		//vytvorit runtime cache
		this.cache = [];

		//rozhodnout se, jestli je mozne pouzit local storage nebo polyfill
		if ( Modernizr.localstorage ) {
			
			this.localStorage = new ScukMap.model.DataLocalStorage();

		} 

	},

	/**
	*	
	*/
	checkDataVersion: function( dataVersion ) {

		//zkontrolovat jestli jsou v local storage aktualni data, pokud ne je potreba vymazat 
		var correctVersion = this.localStorage.isCorrectDataVersion( dataVersion );
		if( correctVersion ) {

			//log( "in local storage correct version" );

		} else {

			//log( "in local storage incorrect version" );
			//vymazat vsechny data
			this.clear( true, true );

			//nastavit do local storage korektni verzi
			this.localStorage.updateVersion( dataVersion );
		
		}

		return correctVersion;
	},

	/**
	*	ulozit ziskana data do cache
	*	@data - data pro vlozeni
	* 	@x - x-ovy identifikator dlazdice 
	* 	@y - y-ovy identifikator dlazdice
	* 	@type - typ markeru, ktery se ukladaj
	*/
	store: function( data, x, y, type ) {

		var key = this.constructKey( x, y, type );

		//vlozit do runtime cache
		this.cache[ key ] = data;
		
		//vlozit do localStorage
		//vlozit idecka pod klicem dlazdice
		var msg = "";
		if( this.localStorage ) msg = this.localStorage.setTile( key, data );
		
		//vlozit veskere info o markeru do marker objectu pod klicem id


		return msg;
	},

	/**
	*	ziskat data pro dlazdici z cache
	*	@x - x-ovy identifikator dlazdice 
	* 	@y - y-ovy identifikator dlazdice
	* 	@type -  typ markeru, ktery je potreba ziskat
	*/
	get: function( x, y, type ) {

		var data = null;
		var key = this.constructKey( x, y, type );
		
		//zkusit runtime cache
		data = this.cache[ key ];

		if( !data && this.localStorage ) {

			//v runtime cache nic neni, zkusit localstorage
			var dataFromLC = this.localStorage.getTile( key );
			if( dataFromLC && dataFromLC.length > 0 ) {
			
				data = this.localStorage.getTile( key );
			
			}
			
		} else {

			//log( "data from runtime cache", data );
		}

		return data;

	},

	/**
	*
	*/
	startNewStorage: function( x, y, type ) {

		//log( "startNewStorage" );
		if( this.localStorage ) this.localStorage.startNewStorage();
	
	},

	/**
	*
	*/
	endNewStorage: function( x, y, type ) {

		//log( "endNewStorage" );
		if( this.localStorage ) this.localStorage.endNewStorage();

	},

	/**
	*	vytvorit key pro cache
	*	@x - x-ovy identifikator dlazdice 
	* 	@y - y-ovy identifikator dlazdice
	* 	@type -  typ markeru
	*/
	constructKey: function( x, y, type ) {

		return x + "-" + y + "-"  + type;

	},

	/**
	*	vycistit runtime cache ( pro ucely testovani )
	**/
	clear: function( clearRuntimeCache, clearLocalStorage ) {

		if( typeof clearRuntimeCache === "undefined" ) {

			clearRuntimeCache = true;

		}

		if( typeof clearLocalStorage === "undefined" ) {

			clearLocalStorage = true;

		}

		if( clearRuntimeCache )	this.cache = [];
		if( clearLocalStorage )	this.localStorage.clear();

	}

}
