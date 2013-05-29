/**
* staticka pomocna trida pro parsovani data
**/
ScukMap.utils.DataUtil = {

	/**
	*	ze stringu vytvori pole typu
	*	@typeString - typy ve tvaru "3:kavarny:Kav\u00e1rny;8:cukrarny:Cukr\u00e1rny; ... ""
	*/
	parseMarkerType: function( typeString ) {

		var types = [];
		
		//rozdelit string na vsechny typy
		var typeArray = typeString.split( ";" );
			
		//project vsechny typy
		var lenTypes = typeArray.length;
		for( var i = 0 ; i < lenTypes; i++ ) {
			
			var type = typeArray[ i ];
			
			//do vysledneho pole vlozit jen cisla
			var typeNumber = type.split( ":" )[ 0 ];
			types.push( typeNumber );	
		
		}

		return types;

	}

}