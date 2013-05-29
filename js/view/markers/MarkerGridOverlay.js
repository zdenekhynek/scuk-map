/**
*	
*	pomocny overlay pro urceni a kontrolu viditelnych dlazdic
*	@data - data pro zobrazeni v bublin ve formatu { title: ... , address: ..., description: ..., score: ..., satisfaction: ..., url: ..., web: ... }
*	@map - reference na google mapu
*	@infowindow - reference na bublinu
*
*	autor: zdenek.hynek@gmail.com
*/

ScukMap.view.markers.MarkerGridOverlay = function( data, map, infoWindow ) {

	this.tiles = [];

}

ScukMap.view.markers.MarkerGridOverlay.prototype = {

	tileSize: new google.maps.Size( 256, 256 ),
	maxZoom: 19,
	name: "Tile #s",
	alt: "Tile Coordinate Map Type",

	/**
	*	
	*/
	getTile: function( coord, zoom, ownerDocument ) {
	  
	  var div = ownerDocument.createElement('div');
	  /*div.innerHTML = coord;
	  div.style.width = this.tileSize.width + 'px';
	  div.style.height = this.tileSize.height + 'px';
	  div.style.fontSize = '10';
	  div.style.borderStyle = 'solid';
	  div.style.borderWidth = '1px';
	  div.style.borderColor = '#AAAAAA';*/
	  
	  this.tiles.push( { coord: coord, zoom: zoom } );
	  
	  return div;

	},

	/**
	*	
	*/
	releaseTile: function( tile ) {
	 
	},

	/**
	*	handler mouseout na markeru, zmena ikonky
	*/
	clearTiles: function() {

		this.tiles = [];

	},

	computeVisibleTiles: function( map ) {

		var bounds = map.getBounds(),
		boundingBoxes = [],
        boundsNeLatLng = bounds.getNorthEast(),
        boundsSwLatLng = bounds.getSouthWest(),
        boundsNwLatLng = new google.maps.LatLng(boundsNeLatLng.lat(), boundsSwLatLng.lng()),
        boundsSeLatLng = new google.maps.LatLng(boundsSwLatLng.lat(), boundsNeLatLng.lng()),
        zoom = map.getZoom(),
        tiles = [],
        tileCoordinateNw = this.pointToTile( map, boundsNwLatLng, zoom),
        tileCoordinateSe = this.pointToTile( map, boundsSeLatLng, zoom),
        tileColumns = tileCoordinateSe.x - tileCoordinateNw.x + 1,
        tileRows = tileCoordinateSe.y - tileCoordinateNw.y + 1,
        zfactor = Math.pow( 2, zoom ),
        minX = tileCoordinateNw.x,
        minY = tileCoordinateNw.y;

	    while (tileRows--) {
	        while (tileColumns--) {
	            tiles.push({
	                x: minX + tileColumns,
	                y: minY
	            });
	        }

        	minY++;
        	tileColumns = tileCoordinateSe.x - tileCoordinateNw.x + 1;
    	}

    	return tiles;

	},

	pointToTile: function( map, latLng, z ) {

		var mercator_range = 256;
	    var projection = map.getProjection();
	    var worldCoordinate = projection.fromLatLngToPoint(latLng);
	    var pixelCoordinate = new google.maps.Point(worldCoordinate.x * Math.pow(2, z), worldCoordinate.y * Math.pow(2, z));
	    var tileCoordinate = new google.maps.Point( Math.floor( pixelCoordinate.x / mercator_range ), Math.floor( pixelCoordinate.y / mercator_range ));
	    return tileCoordinate;

	}

}
