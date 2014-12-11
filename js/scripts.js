$(document).ready(function () {
	/*
	 * Functions for the bootstrap theme
	 */
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active');
	});

	$('.btn-toggle').click(function () {
		$(this).find('.btn').toggleClass('active').toggleClass('btn-default').toggleClass('btn-primary');
	});


	/*
	 * Pan the map to the selected building's location
	 */
	$('#goToBuildingButton').click(function(){
		$('#openInMapsButton').prop('disabled', false);  // Re-enable the open in maps button
		var select = document.getElementById('buildingDropdown');
		goToBuilding(select.options[select.selectedIndex].text);  // Pass it the name of the selected building
	});

	/*
	 * Change the button text for iOS devices
	 */
	if(is_iOS){
		$('#openInMapsButton').text("Open in iMaps");
	}
});