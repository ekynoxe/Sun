/**
 * Sun: Calulating sunrise, sunset and later on equinoxes
 * This code is based on the work of Dr Louis Strous at
 *		http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *		use his constant values found at
 *		http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011 http://ekynoxe.com
 */

var	$=$,
		Sun = Sun,
		// Utilities
		u={
			// Format a date from an array [day, month, year, hours, minutes, seconds] to 'DD/MM/YYYY at hh:mm:ss'
			f: function(d) {
				return d[0] + '/' + d[1] + '/' + d[2] + ' at ' + d[3] + ':' + d[4] + ':' + d[5];
			}
		},
		// Coordinates for London
		// decimal below correspond to: 51°30′26″N 0°7′39″W
		coords1 = [51.507222, 0.1275],
		// Coordinates for the Netherlands
		// numbers below correspond to: 52°00′00″N 0°5′00″E, for testing against resource site date example
		coords2 = [52, -5],
		date1 = new Date(), // Today
		date2 = new Date(2004, 3, 1), // April 1st 2004, for testing against resource site date example
		coords = coords1,
		date = date1;

$(function(){
	var theSun = new Sun(date, coords[0], coords[1]);
	
	$('#day').html(theSun.day[0] + ' ' + theSun.day[1] + ' ' + theSun.day[2]);
	$('#dayUTC').html(theSun.dayUTC[0] + ' ' + theSun.dayUTC[1] + ' ' + theSun.dayUTC[2]);
	$('#dayCJDN').html(theSun.dayCJDN);
	$('#dayMeanAnomaly').html(theSun.dayMeanAnomaly);
	$('#dayEquationCenter').html(theSun.dayEquationCenter);
	$('#dayTrueAnomaly').html(theSun.dayMeanAnomaly + theSun.dayEquationCenter);
	$('#daySunEclipticLon').html(theSun.sunEclipticLon);
	$('#daySunRightAscension').html(theSun.sunRightAscension);
	$('#daySunDeclination').html(theSun.sunDeclination);
	$('#daySunSideralTime').html(theSun.daySunSideralTime);
	$('#daySunHourAngle').html(theSun.daySunHourAngle);
	$('#daySunAzimuth').html(theSun.daySunAzimuth);
	$('#daySunAltitude').html(theSun.daySunAltitude);
	$('#daySolarTransit').html(theSun.daySolarTransit);
	$('#daySolarTransitFull').html(u.f(theSun.JD2FullGregorian(theSun.daySolarTransit)));
	$('#sunSetHourAngle').html(theSun.sunSetHourAngle);
	$('#sunSetSolarTransit').html(theSun.sunSetSolarTransit);
	$('#nextCalendarDaySet').html(u.f(theSun.sunRiseDateParts));
	$('#sunRiseSolarTransit').html(theSun.sunRiseSolarTransit);
	$('#nextCalendarDayRise').html(u.f(theSun.sunSetDateParts));
	
	// TWILIGHTS
	$('#sunSetCivilTwilightDate').html(u.f(theSun.sunSetCivilTwilightDateParts));
	$('#sunRiseCivilTwilightDate').html(u.f(theSun.sunRiseCivilTwilightDateParts));
	$('#sunSetNauticalTwilightDate').html(u.f(theSun.sunSetNauticalTwilightDateParts));
	$('#sunRiseNauticalTwilightDate').html(u.f(theSun.sunRiseNauticalTwilightDateParts));
	$('#sunSetAstronomicalTwilightDate').html(u.f(theSun.sunSetAstronomicalTwilightDateParts));
	$('#sunRiseAstronomicalTwilightDate').html(u.f(theSun.sunRiseAstronomicalTwilightDateParts));
	
});
