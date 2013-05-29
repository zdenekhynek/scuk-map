/**
*
*	vyuziva view pro komunikaci s controllerem
*   autor: zdenek.hynek@gmail.com
*/

ScukMap.controller.Controller = function( model ) {

	this.model = model;

}

ScukMap.controller.Controller.prototype = {

	init: function() {

		this.model.init();

	},

	updateViewPort: function( center, zoomLevel, tiles ) {

		this.model.updateViewPort( center, zoomLevel, tiles );

	},

	updateType: function( type, forceDataLoad ) {
		
		this.model.updateType( type, forceDataLoad );

	},

	/**
	*
	*/
	updateMarker: function( id ){

		this.model.updateMarker( id );

	}

}
