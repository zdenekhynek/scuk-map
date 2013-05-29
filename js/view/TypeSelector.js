/**
*	
*	wrapper selectu pro vyber typu
*	@opts - { typeSelectorId - id selectu }
*	
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.TypeSelector = function( opts ) {	

  this.callbacks = {};
	this.opts = opts;
  this.element = null;
  this.options = null;
  this.selectedType = 0;

  this.$defaultOption = null;

}

ScukMap.view.TypeSelector.prototype = {

	init: function() {

		var self = this;
    this.element = $("#" + this.opts.typeSelectorId );
    this.options = this.element.find( "option" );
    
    this.$defaultOption = this.options.filter( "[value="+ "0" + "]" );

    //select default option
    this.$defaultOption.attr( "selected", "selected" );

    //pridani event listeneru
    this.element.on( "change", function() {
      
      self.onTypeChange( this, true );
    
    } );
    
	},

  /**
  * nastavit typ
  * @type - ciselny index nastaveni typu
  * @forceDataLoad - ma se po nastaveni vyzadat nova data
  */
  setType: function( type, forceDataLoad ) {
    
    //zkontrolovat, ze typ neni nastaven
    var $newType = this.options.filter( "[value="+ type + "]" );
    var isSet = $newType.attr( "selected" );
    
    if( !isSet ) {
      
      //nastvit novy typ
      $newType.attr( "selected", "selected" );
      this.onTypeChange( this.element, forceDataLoad );
    
    }
    

  },

  /**
  * nastavit vychozi typ
  */
  setDefault: function( ) {

    var isDefaultSelected = this.$defaultOption.attr( "selected" );
    if( !isDefaultSelected ) {

      this.$defaultOption.attr( "selected", "selected" );
      this.onTypeChange( this.element );
      
    }

  },

  /**
  *   handler zmeny typu
  */
	onTypeChange: function( select, forceDataLoad ) {
    
    if( this.callbacks.hasOwnProperty( "onTypeChange" ) ) {
      
      var type = $( select ).val();

      if( type !== this.selectedType ) {
        
        this.selectedType = type;
        this.callbacks.onTypeChange.apply( this, [ type, forceDataLoad ] );
      
      }
       
    }

  }

}