<?php
	/**
	 * Created by PhpStorm.
	 * User: Deathnerd
	 * Date: 11/13/2014
	 * Time: 12:03 PM
	 */

	include("settings.php");

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
			/*
			 * Check for errors. Set the message to show on the buildings dropdown
			 */
			$locations[] = ["name"        => "We're sorry. There was an error processing your request",
			                'latitude'    => null,
			                'longitude'   => null,
			                'description' => null];
			$locations = null;
		}
	} catch (Exception $e) {
		/*
		 * Check for errors. Set the message to show on the buildings dropdown
		 */
		$locations[] = ["name"        => "We're sorry. There was an error processing your request",
		                'latitude'    => null,
		                'longitude'   => null,
		                'description' => null];
		$locations = null;
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
	<?
		/*
		 * Check for the error condition that the database done blown up. If it hasn't, it's business as usual
		 */
		if (!is_null($locations)) {
			?>
			<!-- The world as we know it -->
			<div id="map-canvas" style="width: 100%; height: 300px;"></div>
			<!-- The end of the world as we know it -->

			<label for="buildingDropdown">
				Pick a building:
				<select class="form-control" name="buildingDropdown" id="buildingDropdown">
					<?
						/*
						 * Populate the dropdown with the building names and their coordinates in lat,long format.
						 * They will be broken up later by javascript
						 */
						foreach ($locations as $location) {
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
			<button class="btn btn-default" type="button" id="openInMapsButton" onclick="openInGMaps()" disabled>Open in
				Google
				Maps
			</button>
			<?
			/*
			 * Otherwise throw up a big huge fat error
			 */
		} else {
			?>
			<div class="alert alert-error">We're sorry. There was an error processing your request. Please try again later</div>
		<?
		}
	?>
</div>
</body>
<!-- load the map functions after everything to ensure proper functionality -->
<script src="js/map_functions.js"></script>
</html>