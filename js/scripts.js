$(document).ready(function () {
	$('[data-toggle=offcanvas]').click(function () {
		$('.row-offcanvas').toggleClass('active');
	});

	$('.btn-toggle').click(function () {
		$(this).find('.btn').toggleClass('active').toggleClass('btn-default').toggleClass('btn-primary');
	});

	$('#goToBuildingButton').click(function(){
		$('#openInMapsButton').prop('disabled', false);
		var select = document.getElementById('buildingDropdown');
		goToBuilding(select.options[select.selectedIndex].text);  // Pass it the name of the selected building
	});

	if(is_iOS){
		$('#openInMapsButton').text("Open in iMaps");
	}
});