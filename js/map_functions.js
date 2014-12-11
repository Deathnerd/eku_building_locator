/**
 * Created by Deathnerd on 11/13/2014.
 */

var mapOptions = {};
var map;
var marker;
var markers = [];
var is_iOS = navigator.userAgent.match(/iPhone/i);

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

/*
 * This fires when the user first loads the page and/or after the user okays the use of their geographic position
 */
navigator.geolocation.getCurrentPosition(function (pos) {
	/*if (navigator.userAgent.match(/iPhone/i)) {
		alert("Accuracy: " + pos.coords.accuracy);
	}*/
	currentPosition.latitudue = pos.coords.latitude;
	currentPosition.longitude = pos.coords.longitude;
	//currentPosition.accuracy = pos.coords.accuracy;
	currentPosition.altitude = pos.coords.altitude;
	currentPosition.latLng = new google.maps.LatLng(currentPosition.latitudue, currentPosition.longitude);

	map.setCenter(currentPosition.latLng);
});

/*
 * This fires every time the position of the device changes
 */
navigator.geolocation.watchPosition(function (pos) {
	/*currentPosition.latitude = pos.coords.latitude;
	 currentPosition.longitude = pos.coords.longitude;
	 currentPosition.accuracy = pos.coords.accuracy;
	 currentPosition.altitude = pos.coords.altitude;
	 currentPosition.latLng = new google.maps.LatLng(currentPosition.latitudue, currentPosition.longitude);

	 map.setCenter(currentPosition.latLng);*/
});

/*
 * Runs at page load to set up the map.
 */
function initialize() {
	currentPosition.latLng = new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
	mapOptions.center = currentPosition.latLng;
	mapOptions.zoom = currentPosition.accuracy;
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	map.setCenter(new google.maps.LatLng(currentPosition.latitudue, currentPosition.longitude));

	var image = 'images/current_position_icon.png';
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

/*
 * Function to interact with the server to save a user's position
 */
var savePosition = function () {
	$.ajax({
		url: "http://wesgilleland.com/projects/lat_long/save.php",
		data: {
			data: JSON.stringify(currentPosition)
		},
		success: function (response) {
			var resp;

			try {
				resp = JSON.parse(response);
			} catch (e) {
				alert("There was an error parsing your location");
				console.log("Error: " + e);
				return;
			}

			if (!resp.success) {
				alert("Your position could not be recorded at this time");
			}
		}
	});
};

function resetMarker(map, index) {
	markers[index].setMap(map);
}

var goToBuilding = function (name) {
	var coords = $('#buildingDropdown').val().split(",");
	coords[0] = parseFloat(coords[0]);
	coords[1] = parseFloat(coords[1]);
	var panPoint = new google.maps.LatLng(coords[0], coords[1]);
	if(markers.length > 1){
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
	 * http://maps.google.com/maps?z=12&t=m&q=loc:38.9419+-78.3020
	 * -z is the zoom level (1-20)
	 * -t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
	 * -q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +
	 */
	var coords = $('#buildingDropdown').val().split(",");
	var z = currentPosition.accuracy;
	var t = "m";
	var q;
	var url;

	if(is_iOS){
		q = coords[0]+","+coords[1];
		url = "http://maps.apple.com/?z="+z+"&t="+t+"&q="+q;
	} else {
		q = "loc:" + coords[0] + "+" + coords[1];
		url = "http://maps.google.com/maps?z=" + z + "&t=" + t + "&q=" + q;
	}
	window.open(url);
};
