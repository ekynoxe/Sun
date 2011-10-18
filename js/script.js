/**
 * Sun: Calulating sunrise, sunset and equinoxes
 * This code is based on the work of Dr Louis Strous at
 *		http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *		use his constant values found at
 *		http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011
 */

var sun = sun || {};

sun.CONST = {
	J2000: 2451545,
	earth:{
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
		rightAscension:{
			A2: -2.4680,
			A4: 0.0530,
			A6: -0.0014
		},
		declination:{
			D1: 0.5999,
			D3: 0.0493,
			D5: 0.0003
		}
	}
};

sun.start = function (){
	var today = sun.today();
	var todayUTC = sun.todayUTC();
	
	today = [1, 4, 2004];
	todayUTC = [1, 4, 2004];
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
};
/* Returns the gregorian day, month and year */
sun.today = function(){
	var d = new Date();
	return [d.getDate(), d.getMonth()+1, d.getFullYear()];
};

/* Returns the gregorian day, month and year in UTC format */
sun.todayUTC = function(){
	var d = new Date();
	return [d.getUTCDate(), d.getUTCMonth()+1, d.getUTCFullYear()];
};

/**
 *	Calculate the Chronological Julian Day Number from a Gregorian Date
 * @param: Array gregorianDate, the gregorian date parts as calendar day, calendar month, calendar year
 */
sun.gregorian2CJDN = function(gregorianDate){
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
sun.CJDN2gregorian = function(J){
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
			
	return [d,m,j];
};

/**
 *	Calculate the Chronological Julian Day Number from a Julian Date
 * @param: Array julianDate, the julian date parts as calendar day, calendar month, calendar year
 */
sun.julian2CJDN = function(julianDate){
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
sun.CJDN2julian = function(J){
	var	y2 = J - 1721118,
			x2 = Math.floor((4*y2 + 3)/1461),
			z2 = y2 - Math.floor(1461*x2/4),
			x1 = Math.floor((5*z2 + 2)/153),
			c0 = Math.floor((x1 + 3)/12),
			j = x2 + c0,
			m = x1 - 12*c0 + 3,
			d = z2 - Math.floor((153*x1 - 3)/5);
			
	return [d,m,j];
};

/**
 *	Calculate the Mean Anomaly for a given Chronological Julian Day Number for planet EARTH
 * @param: int J, the Chronological Julian Day Number
 */
sun.calcMeanAnomaly = function(J){
	var M = sun.CONST.earth.meanAnomaly.M0 + sun.CONST.earth.meanAnomaly.M1*(J - sun.CONST.J2000);	
	return (M % 360);
};

/**
 *	Calculate the Equation of Center for a given Mean Anomaly for planet EARTH
 * @param: float M, the Mean Anomaly for planet EARTH
 */
sun.calcEquationCenter = function(M){
	var C =	sun.CONST.earth.equationOfCenter.C1 * Math.sin(M*Math.PI/180) +
				sun.CONST.earth.equationOfCenter.C2 * Math.sin(2 * M*Math.PI/180) +
				sun.CONST.earth.equationOfCenter.C3 * Math.sin(3 * M*Math.PI/180);
			
	return C;
};

/**
 * Calculate the ecliptic longitude of the Sun as seen from planet Earth
 * @param: float v, the True Anomaly for planet EARTH
 */
sun.calcSunEclipticLon = function(v){
	var lambda = v + sun.CONST.earth.periphelion + 180;
	return lambda % 360;
};

$(sun.start);