/**
*	
*	wrapper kolem places api pluginu ( http://ubilabs.github.com/geocomplete/ )
*	@opts - { id - id inputu se zadavanim mist,
*			  mapId - id canvasu s mapou, plugin umi je automaticky zameri }
*	
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.AutoComplete = function( opts ) {	

  this.callbacks = {};
	this.opts = opts;
  this.plugin = null;

}

ScukMap.view.AutoComplete.prototype = {

	init: function() {

		var self = this;
    
    //initializace pluginu
		this.plugin = $( "#" + this.opts.autoCompleteId ).geocomplete()
      //callback po uspesnem dotazu
			.bind("geocode:result", function( event, result ){
      
          self.onGeocodeResult( event, result );
      
      })
      //callback po neuspesnem dotazu
      .bind("geocode:error", function( event, status){
      
          self.onGeocodeError( event, status );
      
      })
      //callback vraceni vice moznych vysledku
      .bind("geocode:multiple", function( event, results){
         
         self.onGeocodeMultiple( event, results );
      
      });

	},

  /**
  *   handler uspesneho dotazu
  */
	onGeocodeResult: function( event, result ) {
      
    if( this.callbacks.hasOwnProperty( "onGeocodeResult" ) ) {
      
      var location = result.geometry.location;
      var viewport = result.geometry.viewport;
      
      this.callbacks.onGeocodeResult.apply( this, [ location, viewport ] );
	  
    }

  },

  /**
  *   handler neuspesneho dotazu
  */
  onGeocodeError: function( event, status ) {
     
    log("AutoComplete.js: geocoding ERROR: " + status);
      
	},

  /**
  *   handler vicenasovneho vysledku
  */
	onGeocodeMultiple: function( event, results ) {
    
    log("AutoComplete.js: geocoding Multiple: " + results.length + " results found");
         
	}

}