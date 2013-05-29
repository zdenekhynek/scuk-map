/**
*	
*	wrapper controlu pro navrat na zamerenou pozici
*	@opts - { typeSelectorId - id wrapperu kolem selectu }
*	
*	autor: zdenek.hynek@gmail.com
*/
ScukMap.view.UserLocationControl = function( opts ) {	

	this.ENABLE_IMAGE_OFFSET = "-30px 0px";
	this.DISABLE_IMAGE_OFFSET = "0px 0px";

	this.callbacks = {};	
  	this.opts = opts;
  	
  	this.element = null;
  	this.enabled = false;
	this.latLng = null;
  	this.zoomLevel = null;

}

ScukMap.view.UserLocationControl.prototype = {

	init: function() {

		this.element = $("#" + this.opts.userLocationControlId );
		this.element.on( "click", $.proxy( this.onClick, this ) );

	},

	/**
	*	zapnout control
	*/
	enable: function( latLng, zoomLevel ) {

		this.enabled = true;

		//ulozit hodnoty o lokaci
		this.latLng = latLng;
		this.zoomLevel = zoomLevel;

		this.element.css( "background-position", this.ENABLE_IMAGE_OFFSET );

	},

	/**
	*	vypnout control
	*/
	disable: function() {

		this.disabled = true;

		this.element.css( "background-position", this.DISABLE_IMAGE_OFFSET );

	},

	/**
	*	handler clicku na control
	*/
	onClick: function() {

		if( this.enabled ) {
			
			if( this.callbacks.hasOwnProperty( "onClick" ) ) {

				this.callbacks.onClick.apply( this, [ this.latLng, this.zoomLevel ] );
		
			}

		}

	}


}
