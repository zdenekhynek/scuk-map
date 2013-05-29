/**
*
*	wrapper pro ziskavani dat z backendu, nebo z cache
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.model.DataProxy = function ( opts ) {

	this.opts = opts || {};
	//this.dataVersion = this.opts.dataVersion;
	this.url = this.opts.url;
	//this.dbName = ( this.opts.dbName ) ? this.opts.dbName : "scuk_test";
	this.dataType = ( this.opts.dataType ) ? this.opts.dataType : "json";
	this.method = this.opts.method;
	this.withCache = this.opts.withCache;

	//flag jestli je prvni nahrani dat ( bude vzdy ze serveru, a ne z cache, aby se zjistila aktualni verze )
	this.firstLoad = true;

	if( this.withCache ) {
	
		this.dataCache = new ScukMap.model.DataCache();

	}


}

ScukMap.model.DataProxy.prototype	= {

	init: function() {

		if( this.dataCache ) {

			this.dataCache.init( this.dataVersion );

			//debug
			//this.dataCache.clear();

		}
	},

	/**
	*	ziskava data pro novy bounding box ( filtry )
	*	@callback - uspesny callback
	*	@center - stred mapy typu google.maps.LatLng - nepouziva se, misto neho seznam dlazdic
	*	@zoomLevel - priblizeni mapy
	*	@type - vybrana kategorie podniku
	* 	@tiles - pole aktualne viditelnych dlazdic ve viewportu
	*/
	getData: function( callback, zoomLevel, type, tiles ) {
		
		var self = this;
		
		//pripravit pole pro dlazdice, ktere je skutecne potreba nahrat
		//var tilesToLoad = [];
		var tilesToLoad = "";

		//pole pro ulozeni dlazdice z cache
		var tilesFromCache = [];
		
		if( this.dataCache ) {

			//vytvorit markersObject
			this.dataCache.startNewStorage();

		}

		//projet vsechny vyzadovane dlazdice, a pripravit na request ty co nejsou v cachy
		var len = tiles.length;

		$.each( tiles, function( i, tile ) {

			var tileFromCache = ( self.dataCache ) ? self.dataCache.get( tile.x, tile.y, type ) : null; 
			
			if( self.firstLoad || ( typeof tileFromCache === "undefined" || tileFromCache === null ) ) {
			
				//tile neni v cache
				//tilesToLoad.push( tile );
				tilesToLoad += tile.x + "_" + tile.y;
				if( i < len - 1 ) tilesToLoad += "+";

			} else {

				//tile z cache
				tilesFromCache = tilesFromCache.concat( tileFromCache );

			}

		} );

		//je potreba nahrat dlazdice ze serveru ?
		if( tilesToLoad.length > 0 ) {

			function complete( dataFromServer ) {

				//dlazdice vracene za serveru
				self.returnData( callback, tilesFromCache, dataFromServer );

			}

			//zavolat asynchronne pro dlazdice
			this.getDataFromServer( complete, zoomLevel, tilesToLoad, type );

		} else {

			//pouziti jen dat z cache, neni potreba asynchrone cekat
			this.returnData( callback, tilesFromCache );

		}

	},

	/**
	*	ajaxove volani na server pro data
	* 	@callback - uspesny callback
	*	@zoomLevel - priblizeni mapy
	*	@tilesToLoad - seznam dlazdic
	*/
	getDataFromServer: function( callback, zoomLevel, tilesToLoad, type ) {

		//volani na server
		//z - zoomlevel, l - seznam kachli, XKACHLE_YKACHLE, oddeleny +, nepovinny parametr t

		//zakladni json struktura
		/*
			{ 
				"shop_type": null, #zopakovany udaj 't' z url
				"version": 1, #verze dat 
				"tiles": {...}, #seznam kachlicek
				"zoom": 4
			}

			klic "tiles"
			
			spendlik
			'a':48.54353, #l(a)t
			'i': 752, #(i)d podniku
			'k': 1, #(k)ind =1 => pin
			'o':-4.48, #l(o)n
			't': 'u le ruffe' #(t)itle
			'y': [1] #t(y)pe

			grupa
			'a':47.43453, #l(a)t
			'c':3, #(c)ount - kolik spendliku je v grupe schovano
			'b':((47.423,-2.43242),(43.532,-2.542352)), #(b)ounding box - informace pro JS kod po kliknuti n agrupu zoomuje na tuto oblast
			'i': [752,645,716], #(i)d podniku, ktere jsou pritomne v grupe
			'k': 2, #(k)ind =2 => group
			'o':-4.48 #l(o)n
		*/

		var self = this;
		tilesToLoad = encodeURIComponent( tilesToLoad );
		
		log( "url", self.url + "?z=" + zoomLevel + "&l=" + tilesToLoad + "&t=" + type );

		$.ajax( {
		  
			url: self.url,
		  
			type: self.method,

			dataType: self.dataType,
		  
		  	//data: { tiles:tilesToLoad, dbName: self.dbName },
		  	data: { z: zoomLevel, l:tilesToLoad, t: type },
		  	
		  	success: function( data ) {
		  	
			  	//predelat na spravny format	
			  	json = data;

			  	//zkontrolovat verzi dat
			  	if( self.firstLoad ) {

					//nastavit flag, pri pristim requestu uz se muzou data tahat z cache
					self.firstLoad = false;
					
					if( self.dataCache ) {

						//nastavit spravnou verzi cache
						self.dataCache.checkDataVersion( data.version );
						
						//debug
						//self.dataCache.checkDataVersion( Math.random() );

					}
					
				}

			  	var dataFromServer = [];
			  	var quotaExceededError = false;
			  	
			  	//pripravit cache na prijmuti novych dat
			  	if( self.dataCache ) self.dataCache.startNewStorage();

			  	//pridat dlazdice vracene ze serveru
			  	$.each( json.tiles, function( i, tileMarkers ) {
			  		
			  		//log( "tileMarkers", tileMarkers );

			  		dataFromServer = dataFromServer.concat( tileMarkers );
		  			
		  			if( self.dataCache && !quotaExceededError ) {

			  			//vytvorit key pro cache
				  		var arr = i.split( "_" );
				  		var x = parseInt( arr[ 0 ] );
				  		var y = parseInt( arr[ 1 ] );

			  			//pridat dlazdice do cache
			  			var msg = self.dataCache.store( tileMarkers, x, y, type );
			  			
			  			//zkontrolovat vysledek pridani dlazdice
			  			if( msg === "QuotaExceededError" ) {

			  				//nastvit flag, at se zastavi ukladani do localStorage
			  				quotaExceededError = true;

			  			}

			  		}
			  		
			  	});

			  	//uzavrit cache po prijmuti novych dat
			  	if( self.dataCache ) self.dataCache.endNewStorage();

			  	callback.apply( this, [ dataFromServer ] );
		  	
			},

		  	error: function( xhr, ajaxOptions, thrownError) {
		        log(xhr.status);
		        log(thrownError); 
		  	} 

		} );

	},

	/**
	*	spojeni dlazdic z cache a ze serveru a vraceni do modelu
	* 	@callback - callback do modelu
	*	@tilesFromCache - pole dlazdic ziskanych z cache
	*	@tilesFromServer - pole dlazdic ziskanych ze serveru
	*/
	returnData: function( callback, tilesFromCache, tilesFromServer ) {

		//log("return data", tilesFromCache, tilesFromServer );

		var returnData = [];
		//pridat do pole dlazdice s cache a ze serveru
		returnData = returnData.concat( tilesFromCache );
		returnData = returnData.concat( tilesFromServer );

		var numFromServer = tilesFromServer ? tilesFromServer.length : 0;
		var numFromCache = tilesFromCache ? tilesFromCache.length : 0;
		
		log("numTilesFromServer", numFromServer, "numTilesFromCache", numFromCache );
		//log( returnData );

		//notifikovat model
		callback.apply( this, [ returnData ] );
	},

	
	/**
	*	spojeni dlazdic z cache a ze serveru a vraceni do modelu
	* 	@callback - callback do modelu
	*	@idMarker - pole dlazdic ziskanych z cache
	*/
	getDataForMarker: function( callback, idMarker ) {

		/* vzor dat

		{"id": 1115,
		"title": "Hells Bells Beer Pub",
		"web": "http://beerpub.hellsbells.cz/",
		"description": "<p>StandardnÃ­ pivnice sÂ konceptem, kterÃ½ tak ÃºplnÄ› nevyhcÃ¡zÃ­ sÂ prÅ¯mÄ›rnou nabÃ­dkouÂ jÃ­del.</p>",
		"url": "/podniky/hells-bells-beer-pub/",
		"level": 1,
		"score": 1,
		"satisfaction": null,
		"address": "LetohradskÃ¡ 50, Praha 7, ÄŒeskÃ¡ republika",
		"closed": false,
		"lovers": 0,
		"wished": 0,
		"visits": 0,
		"reviews": 0,
		"type": "1:restaurace:Restaurace;7:napoje:NÃ¡poje"}
		*/
		
		var dummyData = false;
		if( dummyData ) {
			var returnData = {"point": [-0.3748799999999619, 39.4779237], "web": "http://www.amorino.com/", "level": 1, "score": 4, "description": "Mezin\u00e1rodn\u00ed s\u00ed\u0165 zmrzlin\u00e1ren s\u00a0heslem \u201eZmrzliny bez barviv, bio vejce, \u010derstv\u00e9 ml\u00e9ko, vybran\u00e9 ovoce\u201c. \r\nOtev\u0159eno 12\u201323:30, ceny od 3,50\u00a0eur za porci. Zmrzlinu si m\u016f\u017eete vz\u00edt i\u00a0dom\u016f v\u00a0boxu.", "title": "Amorino", "url": "/d/amorino/", "address": "Plaza San Lorenzo, 2, Valencia, \u0160pan\u011blsko", "type": "3:kavarny:Kav\u00e1rny;8:cukrarny:Cukr\u00e1rny", "satisfaction": 1};
			//notifikovat model
			callback.apply( this, [ returnData ] );
			return;
		}

		var url = "php/getDataFromScukDev.php";

		$.ajax( {
		  
		  url: url,
		  
		  type: "GET",

		  dataType: self.dataType,
		  
		  //data: { tiles:tilesToLoad, dbName: self.dbName },
		  data: { dataType: "detail", id:idMarker },
		  
		  success: function( data ) {
		  	
		  	var json = $.parseJSON( data );
		  	callback.apply( this, [ json ] );
		  
		  }

		} );

		//http://dev1.scuk.cz/podniky/mmfk-detail-1115/
		
	},


}
