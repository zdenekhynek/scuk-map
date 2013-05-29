/**
*
*	hlavni trida Scuk mapy
*	@opts - { mapId - id elementu, kam bude vlozena mapa, autoCompleteId - id imputu pro inicializaci autocomplete }
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.App = function ( opts ) {
	
	this.opts = opts;
	
	//zakladni prvky MVC
	this.view = null;
	this.controller = null;
	this.model = null;
	
}

ScukMap.App.prototype = {

	/**
	*	init aplikace
	**/

	init: function() {

		this.model = new ScukMap.model.Model( this.opts.modelOpts );
		this.controller = new ScukMap.controller.Controller( this.model );
		this.view = new ScukMap.view.View( this.model, this.controller, this.opts );
		
		//model initializovany z kontrolleru
		this.controller.init();	
		this.view.init();
	
	}
}