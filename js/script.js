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
			},
			/**
			 * Returns the gregorian day, month and year
			 * @param: Date d
			 */
			dayParts: function(d) {
				return [d.getDate(), d.getMonth()+1, d.getFullYear()];
			},
			
			/**
			 * Returns the gregorian day, month and year in UTC format
			 * @param: Date d
			 */
			dayUTCParts: function(d) {
				return [d.getUTCDate(), d.getUTCMonth()+1, d.getUTCFullYear()];
			}
		},
		defaults = {
			london: {
			// decimal below correspond to: 51°30′26″N 0°7′39″W
				lat: 51.507222,
				lng: 0.1275
			},
			netherlands: {
			// numbers below correspond to: 52°00′00″N 0°5′00″E, for testing against resource site date example
				lat: 52,
				lng:-5
			}
		},
		mySun = {
			getDateParts: function (){
				//new Date(2004, 3, 1), // April 1st 2004, for testing against resource site date example
				return [parseInt($('input:text[name=day]').val()), parseInt($('input:text[name=month]').val()), parseInt($('input:text[name=year]').val())];
			},
			getCoordinates: function (){
				return {lat: parseFloat($('input:text[name=lat]').val()), lng: parseFloat($('input:text[name=lng]').val())};
			},
			setFields: function(date, coords) {
				$('input:text[name=day]').val(date.getDate());
				$('input:text[name=month]').val(date.getMonth()+1);
				$('input:text[name=year]').val(date.getFullYear());
				$('input:text[name=lat]').val(coords.lat);
				$('input:text[name=lng]').val(coords.lng);
			},
			calculateTimes: function() {
				var	dateParts = mySun.getDateParts(),
						coordinates = mySun.getCoordinates(),
						theSun = new Sun(dateParts, coordinates.lat, coordinates.lng);
						
				theSun.calculateAll();
				
				$('#day').html(theSun.day[0] + ' ' + theSun.day[1] + ' ' + theSun.day[2]);
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
			}
		};

$(function(){
	mySun.setFields(new Date(), defaults.london);
	mySun.calculateTimes();
	$("#calculate").click(function(){mySun.calculateTimes(); return false;});
});