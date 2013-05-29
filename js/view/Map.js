/**
*
*   spravuje instanci google mapy a jejich eventu
*   @opts - { id - elementu, kam bude vlozena mapa }
*
*   autor: zdenek.hynek@gmail.com
*/

ScukMap.view.Map = function ( opts ) {
	
  //uvodni lokace
  this.INITIAL_LATLNG = new google.maps.LatLng( 49.792635,15.410864 ); 
  //uvodni zoom level
  this.INITIAL_ZOOM_LEVEL = 8;
  //uvodni bounds
  this.INITIAL_LATLNG_BOUNDS = new google.maps.LatLngBounds( new google.maps.LatLng( 48.14118844726973, 10.796606390625016 ), new google.maps.LatLng( 51.38963008032814, 20.025122015625016 ) );	
  //level, na ktery se ma zoomovat pri zamereni uzivatele a geokodovani adresy bez zadanych bounds
  this.STREET_LEVEL_ZOOM = 16;

  this.opts = opts;
  this.callbacks = {};

  this.googleMap = null;
  this.markers = null;
  this.mapCenter = null;
  this.mapZoom = null;

  //flag jestli je uz mozne volat getBounds()
  this.tilesFirstLoaded = false;
  //flag jestli je potreba po tileLoaded volat updateViewport
  this.viewportDirty = false;
  //flag jestli mapa nactena v initial pozici, pokud ano, blokuje se prvni idle
  this.blockIdle = false;
  
  //dalsi tridy component mapy
  this.markerManager = null;
  this.infoWindow = null;
  this.markerGridOverlay = null;

  //ulozeni id kliknuteho markeru v infowindowChange, bude pridan do autopan
  this.infoWindowId = null;

  //ulozit posledni hodnoty
  this.lastCenter = null;
  this.lastZoomLevel = null;

}

ScukMap.view.Map.prototype = {

  init: function() { 
    var self = this;

    //log("map.js init map");

    //nastaveni map options
    var mapOptions = {
          center: this.INITIAL_LATLNG,
          zoom: this.INITIAL_ZOOM_LEVEL,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL,
            position: google.maps.ControlPosition.LEFT_BOTTOM
          },
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
          },
          streetViewControl: false,
          panControl: false
    };
    
    //initializace google mapy
    this.googleMap = new google.maps.Map( document.getElementById( this.opts.id ), mapOptions );
    this.mapCenter = this.googleMap.getCenter();
    this.mapZoom = this.googleMap.getZoom();

    //inicializace grid overlay, pouziteho pro vypocet viditelnych dlazdic ve viewportu
    this.markerGridOverlay = new ScukMap.view.markers.MarkerGridOverlay();
    this.googleMap.overlayMapTypes.insertAt( 0, this.markerGridOverlay );

    //initializace custom infookna
    this.infoWindow = new ScukMap.view.CustomInfoWindow( this.googleMap );
    this.infoWindow.callbacks.onAutoPan = $.proxy( this.onAutoPan, this );
    this.infoWindow.init();
    
    //iniicali marker maangeru
    this.markerManager = new ScukMap.view.markers.MarkerManager( this.googleMap, this.infoWindow );
    //pridat listener zmen v infowindow pro odeslani do hashe
    this.markerManager.callbacks.onInfoWindowChange = $.proxy( this.onInfoWindowChange, this );
    //pridat listener kliknuti na groupu
    this.markerManager.callbacks.onGroupMarkerClick = $.proxy( this.onGroupMarkerClick, this );
    this.markerManager.init();

    var dragLock = false;
    
    //pouzit idle event pro oznameni zmeny viewportu
    google.maps.event.addListener( this.googleMap, "idle", function( evt ) {
      //log("Map.js idle", self.blockIdle );
      //pri prvnim nahrani neudelat nic
      if( self.blockIdle ) {

        self.blockIdle  = false;
        return;
      
      }
      
      //log( "map.js idle", dragLock );
      if( dragLock ) return;

      //uz jsou dostupne bounds? pokud ne, pouzit defaultni vyber dlazdic
      var tiles = ( self.googleMap.getBounds() ) ? self.markerGridOverlay.computeVisibleTiles( self.googleMap ) : self.getInitialTiles();
      self.onViewPortUpdate( self.googleMap.getCenter(), self.googleMap.getZoom(), tiles );
      
      //pripravit dlazdice na dalsi nacteni
      self.markerGridOverlay.clearTiles();   
     
    } );

    //hack pro mobilni safari, spatne se vola idle
    var wrapper = $("#" + this.opts.id );
    
    wrapper.on( "touchstart", function() {
    
      dragLock = true;

    } );

    wrapper.on( "touchend", function() {
    
      dragLock = false;

    } );
    
    //uvodni data mozno nacist az po docteni vsech dlazdic
    google.maps.event.addListenerOnce( this.googleMap, "bounds_changed", function() {
      //log("map.js bounds_changed",self.viewportDirty,self.tilesFirstLoaded);
      if( !self.tilesFirstLoaded ) {
        
        self.tilesFirstLoaded = true;
        //log("map.js  self.viewportDirty", self.viewportDirty);
        //neni defaultni viewport? je potreba dohrat oznamit view, ze je jiny viewport ( donactou se data ) 
        if( self.viewportDirty ) {
          
          self.viewportDirty = false;
          //log("map.js  calling viewport update after bonds_changed");
          self.onViewPortUpdate( self.googleMap.getCenter(), self.googleMap.getZoom(), self.markerGridOverlay.computeVisibleTiles( self.googleMap ) );
        
        }
      
      }
    
    });

    //pri male sirce schovat controly
    var $window = $( window );
    $window.on( "resize", function() {
      
      var width = $window.width();
      var minWidth = 481;
      var modifiedOptions = {};

      //sirka je mensi nez minialni pro zobrazeni kontrolu nahore
      if( width < minWidth ) {
        
        modifiedOptions.mapTypeControl = false;
        modifiedOptions.zoomControl = false;
      
      } else {

        modifiedOptions.mapTypeControl = true;
        modifiedOptions.zoomControl = true;
      
      }

      //pouzit modifikovany options na mapu
      self.googleMap.setOptions( modifiedOptions );
 
    } );

    $window.trigger( "resize" );
  },

  /**
  *   inicializovat mapu v defaultnim zobrazeni
  */
  initDefault: function() {

    //log("map.js initdefault");
    var tiles = this.getInitialTiles();
    this.onViewPortUpdate( this.INITIAL_LATLNG_BOUNDS, this.INITIAL_ZOOM_LEVEL, tiles );
    
    //nastavit flag aby se nevolal viewportupdate po uvodnim idle ( vsechno uz je nacteno z bounds_changed, ktere se vola drive)
    this.blockIdle = true;

  },

  /**
  *
  */
  returnToDefaultViewPort: function() {
    
    var tiles = this.getInitialTiles();
    //this.setViewPort( null,  this.INITIAL_LATLNG_BOUNDS );
    this.setViewPort( this.INITIAL_LATLNG, this.INITIAL_ZOOM_LEVEL );
   
  },

  /**
  *   pridani controlu do mapy
  *   @div - element obsahujici controly
  */
  addControls: function( div ) {

     this.googleMap.controls[ google.maps.ControlPosition.TOP_LEFT ].push( div );

  },

  /**
  *   handle zmeny viewportu  
  */
  onViewPortUpdate: function( center, zoomLevel, tiles ) {
   
    //log("map.js check in viewport updat", center, zoomLevel, this.lastCenter, this.lastZoomLevel );
    //byl viewport skutecne updatovany
    if( center == this.lastCenter && this.lastZoomLevel == zoomLevel ) {

      //viewport zustal stejny, nic nedelat
      //return;

    }

    this.lastCenter = center;
    this.lastZoomLevel = zoomLevel;

    if( this.callbacks.hasOwnProperty( "onViewPortUpdate" ) ) this.callbacks.onViewPortUpdate.apply( this, [ center, zoomLevel, tiles ] );

  },

  /**
  *   aktualizovat data v mape
  *   TODO - predelat format dat
  *   @data - nova data ve formatu [ {"point": [14, 50], "web": "", "level": 1, "score": 4, "description": "", "title": "Amorino", "url": "/d/amorino/", "address": "", "type": "3:kavarny:Kav\u00e1rny;8:cukrarny:Cukr\u00e1rny", "satisfaction": 1}, { ... } ] 
  */
  updateData: function( data ) {

    this.markerManager.updateMarkers( data );
  
  },

  /**
  *   nastaveni center a zoomLevelu mapy
  *   @center - pozice na zacentrovani typu google.maps.LatLng
  *   @param - bounds typue google.maps.LatLngBounds nebo zoomLevel 
  */
  setViewPort: function( center, param ) {
    //log("map.js setViewport", center, param );

    //prepsat flag, protoze je potreba
    this.blockIdle = false;

    //zjistit jestli se ma zazoomovat 
    if( typeof( param ) !== "undefined" && param ) { 
      
      //zazoomovat pomoci bounds nebo nastaveni zoomlevelu ?
      if( param instanceof google.maps.LatLngBounds ) {
      
        //pomoci bounds
        this.googleMap.fitBounds( param );
      
      } else {
      
        //pomoci zoomLevelu
        this.googleMap.setZoom( param );
        this.googleMap.setCenter( center ); 
       

      }
      
    }
    
  },

  /**
  * vynutit otevreni infookna na zaklade zmeny hashe
  **/
  openInfoWindow: function( id ) {

    this.markerManager.openInfoWindow( id );

  },

  /**
  * vynutit zavreni infowindow na zaklade zmeny hashe
  **/
  closeInfoWindow: function() {

    if( this.infoWindow ) {

      this.infoWindow.close();

    }

  },

  /**
  * handler zmeny infowindow, odeslat pro zapsani hashe, donacteni dat s detailem markeru apod.
  **/
  onInfoWindowChange: function( id ) {
    
    this.infoWindowId = id;

    if( this.callbacks.hasOwnProperty( "onInfoWindowChange" ) ) {
        
      this.callbacks.onInfoWindowChange.apply( this, [ id ] );
    
    }

  },

  /**
  *   handler kliknuti na groupMarker
  *   @bounds - viewport typu google.maps.LatLngBounds, na ktery se ma zazoomovat po kliku na groupmarker
  **/
  onGroupMarkerClick: function( bounds ) {
    
    this.setViewPort( null, bounds );

  },

  /**
  *   handler otevreni infoboxu a mozneho posunuti mapy
  *   @panned - boolean zda byla kvuli otevreni bubliny posunuta mapa
  */
  onAutoPan: function( panned ) {
    
    if( this.callbacks.hasOwnProperty( "onAutoPan" ) ) {
        
      this.callbacks.onAutoPan.apply( this, [ panned, this.infoWindowId ] );
    
    }

  },

  /**
  *   callback po odbrzeni dat s detailem pro bublinu markeru
  *   TODO - napsat format dat
  *   @data - data s detailem markeru
  */
  onUpdateMarker: function( data ) {
    
    this.markerManager.onUpdateMarker( data );

  },

  /**
  *   ziskat souradnice vsech dlazdic uvodniho defaultniho viewportu mapy
  */
  getInitialTiles: function() {

    //hranicni dlazdice defaultniho viewportu
    //TODO zmenit na static 
    var west = 135;
    var east = 142;
    var north = 85;
    var south = 88;

    var tiles = [];
    var x = west;
    var y = north;

    var diffX = east - west;
    var diffY = south - north;

    //ziskat vsechy dlazdice od severozapadni do jihovychodni
    for( var i = 0; i < diffX; i++ ) {

      for( var q = 0; q < diffY; q++) {

        var tile = [ x, y ];
        tiles.push(  { x: x, y: y } );
        y++;
      
      }

      y = north;
      x++;
    }

    //log( tiles )

    return tiles;

  }

}

