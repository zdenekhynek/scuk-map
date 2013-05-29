/**
*	staticka pomocna trida pro upravy textu
**/
ScukMap.utils.TextUtil = {
	
	add3dots: function( string, repl, limit) {
    	
    	if( string ) {
    		
    		if( string.length > limit ) {
	      
	      		return string.substr( 0, limit ) + repl; 
	    
		    } else {
		    
		      return string;
		    
		    }
    	
    	}
	
  	},

  	removeCountry: function( string, repl ) {
    	
    	if( string ) {

    		var indexOf = string.indexOf( repl ); 
    	
	    	if( indexOf > -1 ) {

				return string.substr( 0, indexOf );

			} else {

				return string;

			}

    	}	
    	
  	}

}

