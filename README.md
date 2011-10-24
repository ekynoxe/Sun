Sun is a simple javascript utility class to integrate into a website for sunrise/sunset calculations.
Later on, this should also include calculation of the current year's equinoxes.

This code is based on the work of Dr Louis Strous at http://www.astro.uu.nl/~strous/AA/en/index.html
Specifically, these calculations implement his equations and use his constant values found at http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html

## Installation
Simply include the file in your HTML `<head>` tag as follows:
	```<script type="text/javascript" src="js/Sun.js"></script>```

## Usage
On your page, or in a separate script, simply create a new instance of Sun, passing the desired date, latitude and longitude you want to calculate the sunrise and sunset for:
Latitudes and longitudes must be expressed as decimal numbers, positive latitudes being North, and positive longitudes being West.
	```<script type="text/javascript">
	// decimal below correspond to: 51°30′26″N 0°7′39″W
	var latitude = 51.507222,
		longitude = 0.1275,
		theSun = new Sun(new Date(), latitude, longitude);
	</script>```

The sunrise, solar transit, and sunset, times are available on the instance. They will be returned in an array containing the following:
[day, month, year, hours, minutes, seconds]
	```<script type="text/javascript">
	var solarTransitTime = theSun.daySolarTransit,
		sunRiseTime = theSun.sunRiseDateParts,
		sunsetTime = theSun.sunSetDateParts;
	</script>```
	
## Work is in progress
I'll try to add calculation of the chosen year's equinoxes later on!

*Mathieu Davy - Ekynoxe, 2011*