/* Autor:
	zdenek.hynek@gmail.com
*/

( function( $, window, undefined ) {
   
   //nastaveni zakladnich parametru
   var opts = { mapId: "map", userLocationControlId: "userLocationControl", autoCompleteId: "autoComplete", typeSelectorId: "typeSelector" };

   //nastaveni parameteru pro napojeno na data
   var modelOpts = { 
   		url: "php/getDataFromScukDev.php",
	  	method: "GET",
	  	withCache: true
   };
   opts.modelOpts = modelOpts;

   var app = new ScukMap.App( opts );
   app.init();

})( jQuery, this );



