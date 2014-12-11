<?php
	/**
	 * Created by PhpStorm.
	 * User: Deathnerd
	 * Date: 11/13/2014
	 * Time: 12:03 PM
	 */

	define('GOOGLE_API_KEY', 'AIzaSyDjrbUgW82pgXE589Fc_yxSqZpqKB610Vo');

	$db = new SQLite3('db.sqlite');
	try {
		$ret = $db->query("SELECT * FROM locations;");

		if ($ret) {
			while ($row = $ret->fetchArray(SQLITE3_ASSOC)) {
				$locations[] = ["name"        => $row['name'],
				                'latitude'    => $row['latitude'],
				                'longitude'   => $row['longitude'],
				                'description' => $row['description']];
			}
		} else {
			$locations[] = ["name"        => "There was an error with the database",
			                'latitude'    => null,
			                'longitude'   => null,
			                'description' => null];
		}
	} catch (Exception $e) {
		$locations[] = ["name"        => "There was an error with the database",
		                'latitude'    => null,
		                'longitude'   => null,
		                'description' => null];
	}


?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>EKU Building Locator</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
	<link rel="stylesheet" href="css/bootstrap.min.css"/>
	<link rel="stylesheet" href="css/styles.css"/>
	<link rel="stylesheet" href="css/bootstrap-theme.min.css"/>
	<script src="js/jquery-2.1.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/scripts.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=<?= GOOGLE_API_KEY; ?>" type="text/javascript"></script>
</head>
<body>
<div class="page-container">
	<!-- nav bar -->
	<nav class="navbar nav-bar-fixed-top" role="navigation">
		<a class="navbar-brand" href="#">EKU Building Locator</a>
	</nav>
	<div id="map-canvas" style="width: 100%; height: 300px;"></div>
	<!--<label>
		Place name
		<input class="form-control" type="text"/>
	</label>
	<button class="btn btn-default" onclick="savePosition()" type="button">Save my position!</button>-->
	<label for="buildingDropdown">
		Pick a building:
		<select class="form-control" name="buildingDropdown" id="buildingDropdown">
			<?
				foreach($locations as $location){
					$latitude = $location['latitude'];
					$longitude = $location['longitude'];
					$name = $location['name'];
					?>
					<option value="<?= $latitude; ?>,<?= $longitude; ?>"><?= $name; ?></option>
				<?
				}
			?>
		</select>
	</label>
	<button class="btn btn-default" type="button" id="goToBuildingButton">Go to building</button>
	<button class="btn btn-default" type="button" id="openInMapsButton" onclick="openInGMaps()" disabled>Open in Google Maps</button>
</div>
</body>
<!-- load the map functions after everything to ensure proper functionality -->
<script src="js/map_functions.js"></script>
</html>