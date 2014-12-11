/**
 * Created by Deathnerd on 11/13/2014.
 */

/*
 * TODO: Get the user location showing
 */

var mapOptions = {};
var map;
var markers = [];
var is_iOS = navigator.userAgent.match(/iPhone/i) ||
	navigator.userAgent.match(/iPad/i) ||
	navigator.userAgent.match(/iPod/i);

/*
 * Initialize the object to hold the current position stuff with a default accuracy and lat/long
 */
var currentPosition = {
	latitudue: 37.423021,   //placeholder; Google HQ
	longitude: -122.083739, //placeholder; Google HQ
	accuracy: 15,
	altitude: 0,
	latLng: 0
};

/**
 * This fires when the user first loads the page and/or after the user okays the use of their geographic position
 */
navigator.geolocation.getCurrentPosition(function (pos) {
	currentPosition.latitudue = pos.coords.latitude;
	currentPosition.longitude = pos.coords.longitude;
	currentPosition.altitude = pos.coords.altitude;
	currentPosition.latLng = new google.maps.LatLng(currentPosition.latitudue, currentPosition.longitude);

	map.setCenter(currentPosition.latLng);
});

/**
 * Runs at page load to set up the map. Sets the center of the map to the user's current location
 */
function initialize() {
	currentPosition.latLng = new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
	mapOptions.center = currentPosition.latLng;
	mapOptions.zoom = currentPosition.accuracy;

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	map.setCenter(new google.maps.LatLng(currentPosition.latitudue, currentPosition.longitude));

	var image = 'images/current_position_icon.png';  // The image for the user's current position. Currently AWOL

	/*
	 * This should set a marker to the user's current point, but alas it's being a dick
	 */
	markers[0] = new google.maps.Marker({
		position: currentPosition.latLng,
		map: map,
		icon: image
	});

}

/*
 * When the window is done loading, run the initialize function defined above
 */
google.maps.event.addDomListener(window, 'load', initialize);

/**
 * Reset the marker in the markers array at the specified index
 * @param map
 * @param index
 */
function resetMarker(map, index) {
	markers[index].setMap(map);
}

/**
 * Pans the map to a specific location
 * @param name The name of the location
 */
var goToBuilding = function (name) {
	/*
	 * The coordinates are stored in the building's option's val attribute in a CSV format of lat,long.
	 */
	var coords = $('#buildingDropdown').val().split(",");
	coords[0] = parseFloat(coords[0]);
	coords[1] = parseFloat(coords[1]);

	/*
	 * Make the point to pan to. Shocking, I know.
	 */
	var panPoint = new google.maps.LatLng(coords[0], coords[1]);

	// A small check if it's not the first time we've panned to a building. If so, remove the previous marker
	if (markers.length > 1) {
		resetMarker(null, 1);
	}

	markers[1] = new google.maps.Marker({
		position: panPoint,
		map: map,
		title: name
	});
	map.panTo(panPoint);
};

var openInGMaps = function () {
	/*
	 * The coordinates are stored in the building's option's val attribute in a CSV format of lat,long.
	 */
	var coords = $('#buildingDropdown').val().split(",");
	/*
	 * http://maps.google.com/maps?z=12&t=m&q=loc:38.9419+-78.3020
	 * -z is the zoom level (1-20)
	 * -t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
	 * -q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +
	 */
	var z = currentPosition.accuracy;
	var t = "m";
	var q;
	var url;

	if (is_iOS) {
		q = coords[0] + "," + coords[1];
		url = "http://maps.apple.com/?z=" + z + "&t=" + t + "&q=" + q;
	} else {
		q = "loc:" + coords[0] + "+" + coords[1];
		url = "http://maps.google.com/maps?z=" + z + "&t=" + t + "&q=" + q;
	}
	window.open(url);
};
