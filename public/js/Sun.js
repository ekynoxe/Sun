/**
 * Sun: Calulating sunrise, sunset and later on, equinoxes
 * This code is based on the work of Dr Louis Strous at
 *		http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *		use his constant values found at
 *		http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011 http://ekynoxe.com
 */
var dtr = Math.PI/180;

function Sun(day, lat, lng){
	this.lat = lat * dtr;
	this.lng = -lng * dtr;
	this.day = day;
	this.constants = this.CONST;
}

// Formulae constants
var CONST = {
	J2000: 2451545,
	M0: 357.5291 * dtr,
	M1: 0.98560028 * dtr,
	C1: 1.9148 * dtr,
	C2: 0.0200 * dtr,
	C3: 0.0003 * dtr,
	P: 102.9372 * dtr,
	E: 23.45 * dtr,
	T0: 280.1600 * dtr,
	T1: 360.9856235 * dtr,
	J0: 0.0009,
	J1: 0.0053,
	J2: -0.0069,
	h0: -0.83 * dtr,
	dsun: 0.53 * dtr,
	twcivil: -6 * dtr,
	twnautical: -12 * dtr,
	twastronomical: -18 * dtr
};

/**
 *	Calculate the Chronological Julian Day Number from a Gregorian Date
 * @param: Array gregorianDate, the gregorian date parts as [calendar day, calendar month, calendar year]
 */
Sun.prototype.gregorian2CJDN = function(gregorianDate) {
	var	c0 = Math.floor((gregorianDate[1]-3)/12),
			x4 = gregorianDate[2] + c0,
			x3 = Math.floor(x4/100),
			x2 = x4 - 100*x3,
			x1 = gregorianDate[1] - 12*c0 -3,
			J0 = 1721120,
			J1 = Math.floor(146097*x3/4),
			J2 = Math.floor(36525*x2/100),
			J3 = Math.floor((153*x1 + 2)/5);
			
	return J1 + J2 + J3 + gregorianDate[0] - 1 + J0;
};

/**
 *	Calculate the Gregorian Date from a Chronological Julian Day Number
 * @param: int J, the Chronological Julian Day Number
 */
Sun.prototype.CJDN2gregorian = function(J) {
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
 *	Calculate the Full Gregorian Date and Time from a Julian Date (fractional)
 * @param: float JD, the Julian Date
 */
Sun.prototype.JD2FullGregorian = function(JD) {
	var	gregorian = this.CJDN2gregorian(JD),
			julianDate = JD + 0.5,
			day = Math.floor(julianDate),
			dayDiff = julianDate - day,
			hoursDiff = dayDiff*24,
			hours = Math.floor(hoursDiff),
			minDiff = (hoursDiff - hours)*60,
			min = Math.floor(minDiff),
			sec = Math.floor((minDiff - min)*60);
			
			return [Math.round(gregorian[0]), gregorian[1], gregorian[2], hours, min, sec];
};

/**
 *	Calculate the Chronological Julian Day Number from a Julian Date
 * @param: Array julianDate, the julian date parts as calendar day, calendar month, calendar year
 */
Sun.prototype.julian2CJDN = function(julianDate) {
	var	c0 = Math.floor((julianDate[1] - 3)/12),
			J0 = 1721117,
			J1 = Math.floor(1461*(julianDate[2] + c0)/4),
			J2 = Math.floor((153*julianDate[1] - 1836*c0 - 457)/5);
			
	return J1 + J2 + julianDate[0] + J0;
};

/**
 *	Calculate the Julian Date from a Chronological Julian Day Number
 * @param: int J, the Chronological Julian Day Number
 */
Sun.prototype.CJDN2julian = function(J) {
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
Sun.prototype.calcMeanAnomaly = function(J) {
	return CONST.M0 + CONST.M1 * (J - CONST.J2000);
};

/**
 *	Calculate the Equation of Center for a given Mean Anomaly for planet EARTH
 * @param: float M, the Mean Anomaly for planet EARTH
 */
Sun.prototype.calcEquationCenter = function(M) {
	return	CONST.C1 * Math.sin(M) +
				CONST.C2 * Math.sin(2 * M) +
				CONST.C3 * Math.sin(3 * M);
};

/**
 * Calculate the ecliptic longitude of the Sun as seen from planet Earth
 * @param: float v, the True Anomaly for planet EARTH
 */
Sun.prototype.calcSunEclipticLon = function(v) {
	return v + CONST.P + Math.PI;
};

/**
 * Calculate the Right Ascension of the sun from planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
Sun.prototype.calcSunRightAscension = function(lambda) {
	return Math.atan2(Math.sin(lambda) * Math.cos(CONST.E), Math.cos(lambda));
};

/**
 * Calculate the declination of the sun from planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
Sun.prototype.calcSunDeclination = function(lambda) {
	return Math.asin(Math.sin(lambda) * Math.sin(CONST.E));
};

/**
 * Calculate the sun's Sidereal Time for the given coordinates of the observer on planet EARTH
 * @param: int J, the Julian day
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float lon, the longitude WEST of the observer on planet EARTH
 */
Sun.prototype.calcSunSiderealTime = function(J, lng) {
	return CONST.T0 + CONST.T1 * (J - CONST.J2000) - lng;
};

/**
 * Calculate the sun's Hour angle
 * @param: float alpha, the sun Right Ascension
 * @param: float theta, the sun's Siedral Time
 */
Sun.prototype.calcSunHourAngle = function(alpha, theta) {
	return theta - alpha;
};

/**
 * Calculate the sun's Azimuth
 * @param: float H, the sun's Hour Angle
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float delta, the sun's declination
 */
Sun.prototype.calcSunAzimuth = function(H, lat, delta) {
	return Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(lat) - Math.tan(delta) * Math.cos(lat));
};

/**
 * Calculate the sun's Altitude
 * @param: float H, the sun's Hour Angle
 * @param: float lat, the latitude NORTH of the observer on planet EARTH
 * @param: float delta, the sun's declination
 */
Sun.prototype.calcSunAltitude = function(H, lat, delta) {
	return Math.asin(Math.sin(lat) *  Math.sin(delta) + Math.cos(lat) * Math.cos(delta) * Math.cos(H));
};

/**
 * Calculate the solar transit on planet EARTH for the given parameters
 * @param: int J, the Julian day
 * @param: float Htarget, the target sun's Hour Angle
 * @param: float lon, the longitude WEST of the observer on planet EARTH
 * @param: float lambda, the ecliptical longitude of the sun as seen from planet EARTH
 */
Sun.prototype.calcSolarTransit = function(J, Htarget, lng, lambda) {
	var	nStar = (J - CONST.J2000 - CONST.J0) - (Htarget + lng)/(2*Math.PI),
			n = Math.round(nStar),
			JStar = CONST.J2000 + CONST.J0 + ((Htarget + lng) / (2*Math.PI)) + n,
			M = this.dayMeanAnomaly,
			C = this.calcEquationCenter(M),
			LSun = M + CONST.P + Math.PI,
			JTransit = this.calcTransit(JStar, M, LSun);
			
	return JTransit;
};

Sun.prototype.optimizeJTransit = function(J) {
	return J + (this.daySunHourAngle - this.calcSunSiderealTime(J, this.lng))/(2*Math.PI);
};


/**
 * Calculate a Transit from the parameters
 */
Sun.prototype.calcTransit = function(sunsetHourAngle, M, lambda) {
	return sunsetHourAngle + (CONST.J1 * Math.sin(M)) + (CONST.J2 * Math.sin(2 * lambda));
};

/**
 * Return hour parts in [hours, minutes, seconds]
 * @param: float hours, the decimal hours to be formatted
 */
Sun.prototype.decimalHoursToHMS = function(hours) {
	var	H = Math.floor(hours),
			M = Math.floor((hours-H)*60),
			S = Math.floor((((hours-H)*60)-M)*60);
			
	return [H, M, S];
};

/**
 * Calculate Sunset Hour Angle for the given parameters
 */
Sun.prototype.calcSunsetHourAngle = function(lat, delta, h0) {
	return Math.acos((Math.sin(h0) - (Math.sin(lat) * Math.sin(delta))) / (Math.cos(lat) * Math.cos(delta)));
};

Sun.prototype.calculateAll = function() {
	this.dayCJDN = this.gregorian2CJDN(this.day);
	this.dayMeanAnomaly = this.calcMeanAnomaly(this.dayCJDN);
	this.dayEquationCenter = this.calcEquationCenter(this.dayMeanAnomaly);
	this.sunEclipticLon = this.calcSunEclipticLon(this.dayMeanAnomaly + this.dayEquationCenter);
	this.sunRightAscension = this.calcSunRightAscension(this.sunEclipticLon);
	this.sunDeclination = this.calcSunDeclination(this.sunEclipticLon);
	this.daySunSiderealTime = this.calcSunSiderealTime(this.dayCJDN, this.lng);
	this.daySunHourAngle = this.calcSunHourAngle(this.sunRightAscension, this.daySunSiderealTime);
	this.daySunAzimuth = this.calcSunAzimuth(this.daySunHourAngle, this.lat, this.sunDeclination);
	this.daySunAltitude = this.calcSunAltitude(this.daySunHourAngle, this.lat, this.sunDeclination);
	this.daySolarTransit = this.calcSolarTransit(this.dayCJDN, 0, this.lng, this.sunEclipticLon);
	
	/*
	var optimTransitRepeat = 0,
		optimizedTransit = 0;
	
	while(optimTransitRepeat<=10) {
		optimizedTransit = this.optimizeJTransit(this.daySolarTransit);
		if(this.daySolarTransit == optimizedTransit) { break; }
		optimTransitRepeat++;
		this.daySolarTransit = optimizedTransit;
	}
	*/
	this.sunSetHourAngle = this.calcSunsetHourAngle(this.lat,this.sunDeclination, CONST.h0);
	
	this.sunSetJStar = this.calcSolarTransit(this.dayCJDN, this.sunSetHourAngle, this.lng, this.sunEclipticLon);
	this.sunRiseJStar = this.calcSolarTransit(this.dayCJDN, -this.sunSetHourAngle, this.lng, this.sunEclipticLon);
	
	this.sunSetSolarTransit = this.calcTransit(this.sunSetJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunRiseSolarTransit = this.calcTransit(this.sunRiseJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	
	this.sunRiseDateParts = this.JD2FullGregorian(this.sunRiseSolarTransit);
	this.sunSetDateParts = this.JD2FullGregorian(this.sunSetSolarTransit);
	
	// TWILIGHTS
	this.sunSetCivilTwilightHourAngle = this.calcSunsetHourAngle(this.lat,this.sunDeclination, CONST.twcivil);
	this.sunSetNauticalTwilightHourAngle = this.calcSunsetHourAngle(this.lat,this.sunDeclination, CONST.twnautical);
	this.sunSetAstronomicalTwilightHourAngle = this.calcSunsetHourAngle(this.lat,this.sunDeclination, CONST.twastronomical);
	
	this.sunSetCivilTwilightJStar = this.calcSolarTransit(this.dayCJDN, this.sunSetCivilTwilightHourAngle, this.lng, this.sunEclipticLon);
	this.sunRiseCivilTwilightJStar = this.calcSolarTransit(this.dayCJDN, -this.sunSetCivilTwilightHourAngle, this.lng, this.sunEclipticLon);
	this.sunSetNauticalTwilightJStar = this.calcSolarTransit(this.dayCJDN, this.sunSetNauticalTwilightHourAngle, this.lng, this.sunEclipticLon);
	this.sunRiseNauticalTwilightJStar = this.calcSolarTransit(this.dayCJDN, -this.sunSetNauticalTwilightHourAngle, this.lng, this.sunEclipticLon);
	this.sunSetAstronomicalTwilightJStar = this.calcSolarTransit(this.dayCJDN, this.sunSetAstronomicalTwilightHourAngle, this.lng, this.sunEclipticLon);
	this.sunRiseAstronomicalTwilightJStar = this.calcSolarTransit(this.dayCJDN, -this.sunSetAstronomicalTwilightHourAngle, this.lng, this.sunEclipticLon);
	
	this.sunSetCivilTwilightSolarTransit = this.calcTransit(this.sunSetCivilTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunRiseCivilTwilightSolarTransit = this.calcTransit(this.sunRiseCivilTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunSetNauticalTwilightSolarTransit = this.calcTransit(this.sunSetNauticalTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunRiseNauticalTwilightSolarTransit = this.calcTransit(this.sunRiseNauticalTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunSetAstronomicalTwilightSolarTransit = this.calcTransit(this.sunSetAstronomicalTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	this.sunRiseAstronomicalTwilightSolarTransit = this.calcTransit(this.sunRiseAstronomicalTwilightJStar, this.dayMeanAnomaly, this.sunEclipticLon);
	
	this.sunSetCivilTwilightDateParts = this.JD2FullGregorian(this.sunSetCivilTwilightSolarTransit);
	this.sunRiseCivilTwilightDateParts = this.JD2FullGregorian(this.sunRiseCivilTwilightSolarTransit);
	this.sunSetNauticalTwilightDateParts = this.JD2FullGregorian(this.sunSetNauticalTwilightSolarTransit);
	this.sunRiseNauticalTwilightDateParts = this.JD2FullGregorian(this.sunRiseNauticalTwilightSolarTransit);
	this.sunSetAstronomicalTwilightDateParts = this.JD2FullGregorian(this.sunSetAstronomicalTwilightSolarTransit);
	this.sunRiseAstronomicalTwilightDateParts = this.JD2FullGregorian(this.sunRiseAstronomicalTwilightSolarTransit);
	
};