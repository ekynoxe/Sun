/**
 * Sun: Calulating sunrise, sunset and equinoxes
 * This code is based on the work of Dr Louis Strous at
 *		http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *		use his constant values found at
 *		http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011 http://ekynoxe.com
 */

var	$=$,
		sun = {},
		// Utilities
		u={
			// Converts degrees to radians
			tr: function(d){ return d*Math.PI/180;},
			// Converts radians to degrees
			td: function(r){ return r/Math.PI*180;}
		};
		
// Formulae constants
sun.CONST = {
	J2000: 2451545,
	earth: {
		meanAnomaly: {
			M0: 357.5291,
			M1: 0.98560028
		},
		equationOfCenter: {
			C1: 1.9148,
			C2: 0.0200,
			C3: 0.0003
		},
		periphelion: 102.9372,
		obliquity: 23.45,
		rightAscension: {
			A2: -2.4680,
			A4: 0.0530,
			A6: -0.0014
		},
		declination: {
			D1: 0.5999,
			D3: 0.0493,
			D5: 0.0003
		},
		sideralTime: {
			T0: 280.1600,
			T1: 360.9856235
		},
		solarTransit: {
			J0: 0.0009,
			J1: 0.0053,
			J2: -0.0069,
			J3: 1
		},
		refraction: -0.83,
		solarDiskDiameter: 0.53
	}
};

sun.start = function () {
	var
			today = sun.today(),
			todayUTC = sun.todayUTC(),
			// today = [1, 4, 2004],
			// todayUTC = [1, 4, 2004],
			// lat = 52,
			// lng = -5
// Values for London
// 51°30′26″N 0°7′39″W
			lat = 51.507222,
			lng = 0.1275
			;
	
	$('#today').html(today[0] + ' ' + today[1] + ' ' + today[2]);
	$('#todayUTC').html(todayUTC[0] + ' ' + todayUTC[1] + ' ' + todayUTC[2]);
	
	var todayCJDN = sun.gregorian2CJDN(today);
	//sun.CJDN2gregorian();
	//sun.julian2CJDN();
	//sun.CJDN2julian();
	$('#todayCJDN').html(todayCJDN);
	
	var todayMeanAnomaly = sun.calcMeanAnomaly(todayCJDN);
	$('#todayMeanAnomaly').html(todayMeanAnomaly);
	
	var todayEquationCenter = sun.calcEquationCenter(todayMeanAnomaly);
	$('#todayEquationCenter').html(todayEquationCenter);
	$('#todayTrueAnomaly').html(todayMeanAnomaly+todayEquationCenter);
	
	var sunEclipticLon = sun.calcSunEclipticLon(todayMeanAnomaly+todayEquationCenter);
	$('#todaySunEclipticLon').html(sunEclipticLon);
	
	var sunRightAscension = sun.calcSunRightAscension(sunEclipticLon);
	$('#todaySunRightAscension').html(sunRightAscension);
	
	var sunDeclination = sun.calcSunDeclination(sunEclipticLon);
	$('#todaySunDeclination').html(sunDeclination);
	
	var todaySunSideralTime = sun.calcSunSideralTime(todayCJDN, lng);
	$('#todaySunSideralTime').html(todaySunSideralTime);
	
	var todaySunHourAngle = sun.calcSunHourAngle(sunRightAscension, todaySunSideralTime);
	$('#todaySunHourAngle').html(todaySunHourAngle);
	
	var todaySunAzimuth = sun.calcSunAzimuth(todaySunHourAngle, lat, sunDeclination);
	$('#todaySunAzimuth').html(todaySunAzimuth);
	
	var todaySunAltitude = sun.calcSunAltitude(todaySunHourAngle, lat, sunDeclination);
	$('#todaySunAltitude').html(todaySunAltitude);
	
	var todaySolarTransit = sun.calcSolarTransit(todayCJDN, 0, lng, sunEclipticLon);
	$('#todaySolarTransit').html(todaySolarTransit);
	
	var nextAndDiff = sun.calcClosestAndDiff(todaySolarTransit),
		 diffPosition = 'before';
	$('#nextJulianDay').html(nextAndDiff[0]);
	if(nextAndDiff[1] > 0) {
		diffPosition = 'after';
	}
	$('#diffPosition').html(diffPosition);
	$('#diff').html(sun.formatHoursToHMS(Math.abs(nextAndDiff[1])).join(', '));
	$('#nextCalendarDay').html(sun.CJDN2gregorian(nextAndDiff[0]).join(' / '));
	
	
	var sunSet = sun.calcSunsetHourAngle(lat,sunDeclination);
	$('#sunSet').html(sunSet);
	
	var sunSetJStar = sun.calcSolarTransit(todayCJDN, sunSet, lng, sunEclipticLon);
	var sunRiseJStar = sun.calcSolarTransit(todayCJDN, -sunSet, lng, sunEclipticLon);
//	$('#sunSetJStar').html(sunSetJStar);

	var sunSetSolarTransit = sun.calcSunsetTransit(sunSetJStar,todayMeanAnomaly,sunEclipticLon);
	var sunRiseSolarTransit = sun.calcSunsetTransit(sunRiseJStar,todayMeanAnomaly,sunEclipticLon);
	$('#sunSetSolarTransit').html(sunSetSolarTransit);
	$('#nextCalendarDaySet').html(sun.CJDN2gregorian(sunSetSolarTransit).join(' / '));
	$('#sunRiseSolarTransit').html(sunRiseSolarTransit);
	$('#nextCalendarDayRise').html(sun.CJDN2gregorian(sunRiseSolarTransit).join(' / '));
	
};
/* Returns the gregorian day, month and year */
sun.today = function() {
	var d = new Date();
	return [d.getDate(), d.getMonth()+1, d.getFullYear()];
};

/* Returns the gregorian day, month and year in UTC format */
sun.todayUTC = function() {
	var d = new Date();
	return [d.getUTCDate(), d.getUTCMonth()+1, d.getUTCFullYear()];
};

/**
 *	Calculate the Chronological Julian Day Number from a Gregorian Date
 * @param: Array gregorianDate, the gregorian date parts as calendar day, calendar month, calendar year
 */
sun.gregorian2CJDN = function(gregorianDate) {
	var	c0 = Math.floor((gregorianDate[1]-3)/12),
			x4 = gregorianDate[2] + c0,
			x3 = Math.floor(x4/100),
			x2 = x4 - 100*x3,
			x1 = gregorianDate[1] - 12*c0 -3,
			J0 = 1721120,
			J1 = Math.floor(146097*x3/4),
			J2 = Math.floor(36525*x2/100),
			J3 = Math.floor((153*x1 + 2)/5),
			J = J1 + J2 + J3 + gregorianDate[0] - 1 + J0;
			
	return J;
};

/**
 *	Calculate the Gregorian Date from a Chronological Julian Day Number
 * @param: int J, the Chronological Julian Day Number
 */
sun.CJDN2gregorian = function(J) {
	var	y3 = J - 1721120,
			x3 = Math.floor((4*y3 + 3)/146097),
			y2 = y3 - Math.floor(146097*x3/4),
			x2 = Math.floor((100*y2 + 99)/36525),
			y1 = y2 - Math.floor(36525*x2/100),
			x1 = Math.floor((5*y1 + 1)/153),
			c0 = Math.floor((x1 + 3)/12),
			j = 100*x3 + x2 + c0,
			m = x1 - 12*c0 + 3,
			d = y1 - Math.floor((153*x1 - 3)/5);
			
	return [d, m, j];
};

/**
 *	Calculate the Chronological Julian Day Number from a Julian Date
 * @param: Array julianDate, the julian date parts as calendar day, calendar month, calendar year
 */
sun.julian2CJDN = function(julianDate) {
	var	c0 = Math.floor((julianDate[1] - 3)/12),
			J0 = 1721117,
			J1 = Math.floor(1461*(julianDate[2] + c0)/4),
			J2 = Math.floor((153*julianDate[1] - 1836*c0 - 457)/5),
			J = J1 + J2 + julianDate[0] + J0;
			
	return J;
};

/**
 *	Calculate the Julian Date from a Chronological Julian Day Number
 * @param: int J, the Chronological Julian Day Number
 */
sun.CJDN2julian = function(J) {
	var	y2 = J - 1721118,
			x2 = Math.floor((4*y2 + 3)/1461),
			z2 = y2 - Math.floor(1461*x2/4),
			x1 = Math.floor((5*z2 + 2)/153),
			c0 = Math.floor((x1 + 3)/12),
			j = x2 + c0,
			m = x1 - 12*c0 + 3,
			d = z2 - Math.floor((153*x1 - 3)/5);
			
	return [d, m, j];
};

/**
 *	Calculate the Mean Anomaly for a given Chronological Julian Day Number for planet EARTH
 * @param: int J, the Chronological Julian Day Number
 */
sun.calcMeanAnomaly = function(J) {
	var M = sun.CONST.earth.meanAnomaly.M0 + sun.CONST.earth.meanAnomaly.M1*(J - sun.CONST.J2000);	
	return (M % 360);
};

/**
 *	Calculate the Equation of Center for a given Mean Anomaly for planet EARTH
 * @param: float M, the Mean Anomaly for planet EARTH
 */
sun.calcEquationCenter = function(M) {
	var C =	sun.CONST.earth.equationOfCenter.C1 * Math.sin(u.tr(M)) +
				sun.CONST.earth.equationOfCenter.C2 * Math.sin(2 * u.tr(M)) +
				sun.CONST.earth.equationOfCenter.C3 * Math.sin(3 * u.tr(M));
			
	return C;
};

/**
 * Calculate the ecliptic longitude of the Sun as seen from planet Earth
 * @param: float v, the True Anomaly for planet EARTH
 */
sun.calcSunEclipticLon = function(v) {
	var lambda = v + sun.CONST.earth.periphelion + 180;
	return lambda % 360;
};

/**
 * Calculate the Right Ascension of the sun from planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
sun.calcSunRightAscension = function(lambda) {
	var alpha = Math.atan2(Math.sin(u.tr(lambda)) * Math.cos(u.tr(sun.CONST.earth.obliquity)), Math.cos(u.tr(lambda)));
	return u.td(alpha);
};

/**
 * Calculate the declination of the sun from planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
sun.calcSunDeclination = function(lambda) {
	var delta = Math.asin(Math.sin(u.tr(lambda)) * Math.sin(u.tr(sun.CONST.earth.obliquity)));
	return u.td(delta);
};

/**
 * Calculate the sun's Sideral Time for the given coordinates of the observer on planet EARTH
 * @param: int J, the Julian day
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float lon, the longitude WEST of the observer on planet EARTH
 */
sun.calcSunSideralTime = function(J, lng) {
	var theta = sun.CONST.earth.sideralTime.T0 + sun.CONST.earth.sideralTime.T1 * (J - sun.CONST.J2000) - lng;
	return theta%360;
};

/**
 * Calculate the sun's Hour angle
 * @param: float alpha, the sun Right Ascension
 * @param: float theta, the sun's Siedral Time
 */
sun.calcSunHourAngle = function(alpha, theta) {
	var H = theta - alpha;
	return H%360;
};

/**
 * Calculate the sun's Azimuth
 * @param: float H, the sun's Hour Angle
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float delta, the sun's declination
 */
sun.calcSunAzimuth = function(H, lat, delta) {
	var A = Math.atan2(Math.sin(u.tr(H)), Math.cos(u.tr(H)) * Math.sin(u.tr(lat)) - Math.tan(u.tr(delta)) * Math.cos(u.tr(lat)));
	return u.td(A);
};

/**
 * Calculate the sun's Altitude
 * @param: float H, the sun's Hour Angle
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float delta, the sun's declination
 */
sun.calcSunAltitude = function(H, lat, delta) {
	var h = Math.asin(Math.sin(u.tr(lat)) *  Math.sin(u.tr(delta)) + Math.cos(u.tr(lat)) * Math.cos(u.tr(delta)) * Math.cos(u.tr(H)));
	return u.td(h);
};

/**
 * Calculate the solar transit on planet EARTH for the given parameters
 * @param: int J, the Julian day
 * @param: float Htarget, the target sun's Hour Angle
 * @param: float lon, the longitude WEST of the observer on planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
sun.calcSolarTransit = function(J, Htarget, lng, lambda) {
	var	nStar = (J - sun.CONST.J2000 - sun.CONST.earth.solarTransit.J0)/sun.CONST.earth.solarTransit.J3 - (Htarget + lng)/360,
			n = Math.round(nStar),
			JStar = sun.CONST.J2000 + sun.CONST.earth.solarTransit.J0 + (Htarget + lng) * sun.CONST.earth.solarTransit.J3/360 + sun.CONST.earth.solarTransit.J3 * n,
			M = sun.calcMeanAnomaly(JStar),
			C = sun.calcEquationCenter(M),
			LSun = M + C + sun.CONST.earth.periphelion + 180,
			JTransit = JStar + sun.CONST.earth.solarTransit.J1 * Math.sin(u.tr(M)) + sun.CONST.earth.solarTransit.J2 * Math.sin(u.tr(2 * LSun));
	 // alert('nStar ' +nStar+ ' \nn ' +n+ ' \nJStar: ' +JStar+ ' \nM: ' +M+ ' \nLsun: ' +LSun+ ' \nJTransit: ' +JTransit);
	return JTransit;
};

/**
 * Calculate the closest Julian Date and difference in hours from the solar transit
 * @param: float JTransit, the Julian Day of the solar transit 
 */
sun.calcClosestAndDiff = function(JTransit) {
	var	closeJ = Math.round(JTransit),
			diffDays = closeJ - JTransit, // in days
			diffHours = diffDays*24, // in hours
			sign = 1;
			
	if(closeJ > JTransit) {
		sign = -1;
	}
	
	return [closeJ, sign * diffHours];
};

/**
 * Format hours in H:M:S
 * @param: float hours, the hours to be formatted
 */
sun.formatHoursToHMS = function(hours) {
	
	var	H = Math.floor(hours),
			M = Math.floor((hours-H)*60),
			S = Math.floor((((hours-H)*60)-M)*60);
	
	return [H+'h', M+'m', S+'s'];
};

/**
 * Calculate Sunset Hour Angle for the given parameters
 */
sun.calcSunsetHourAngle = function(lat, delta) {
	var	a = Math.sin(u.tr(sun.CONST.earth.refraction)),
			b = Math.sin(u.tr(lat)),
			c = Math.sin(u.tr(delta)),
			d = Math.cos(u.tr(lat)),
			e = Math.cos(u.tr(delta)),
			f = a - b * c,
			g = d * e;
		 // alert('a ' +a+ ' \nb ' +b+ ' \nc: ' +c+ ' \nd: ' +d+ ' \ne: ' +e+ ' \nf: ' +f+ ' \ng: ' +g+ ' \nf/g: ' +f/g);
	var H = Math.acos(f / g);
	return u.td(H);
};

/**
 * Calculate the Sunset Transit
 */
sun.calcSunsetTransit = function(sunsetHourAngle, M, lambda) {
	JSetRise = sunsetHourAngle + (0.0053 * Math.sin(M)) - (0.0069 * Math.sin(2 * lambda));
	return JSetRise;
};

$(sun.start);