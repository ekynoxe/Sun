/**
 * sunApp: Using my Sun library to calulating sunrise, sunset and later on equinoxes
 *  https://github.com/ekynoxe/Sun/blob/master/public/js/Sun.js
 * The library code is based on the work of Dr Louis Strous at
 *      http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *      use his constant values found at
 *      http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011 http://ekynoxe.com
 */

var u = new Utils(),
    // Specific code for the Sun front-end application
    sunApp = {
        defaults: {
            london: { // Westminster
                lat: 51.508,
                lng: -0.125
            }
        },
        defaultCoordsMessage: "The date has been set to Today's date, and the place defaulted to London - Westminster.<br/.>Update the values below and hit \"Calculate!\" to get the info you want!",
        getDateParts: function (){
            return [parseInt($('input:text[name=day]').val(), 10), parseInt($('input:text[name=month]').val(), 10), parseInt($('input:text[name=year]').val(), 10)];
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
            var dateParts = sunApp.getDateParts(),
                    coordinates = sunApp.getCoordinates(),
                    theSun = new Sun(dateParts, coordinates.lat, coordinates.lng);
                    
            theSun.calculateAll();
            
            $('.day').html(theSun.day[0] + ' / ' + theSun.day[1] + ' / ' + theSun.day[2]);
            $('.dayCJDN').html(theSun.dayCJDN);
            $('.dayMeanAnomaly').html(u.td(theSun.dayMeanAnomaly));
            $('.dayEquationCenter').html(u.td(theSun.dayEquationCenter));
            $('.dayTrueAnomaly').html(u.td(theSun.dayMeanAnomaly + theSun.dayEquationCenter));
            $('.daySunEclipticLon').html(u.td(theSun.sunEclipticLon));
            $('.daySunRightAscension').html(u.td(theSun.sunRightAscension));
            $('.daySunDeclination').html(u.td(theSun.sunDeclination));
            $('.daySunSiderealTime').html(u.td(theSun.daySunSiderealTime));
            $('.daySunHourAngle').html(u.td(theSun.daySunHourAngle));
            $('.daySunAzimuth').html(u.td(theSun.daySunAzimuth));
            $('.daySunAltitude').html(u.td(theSun.daySunAltitude));
            $('.daySolarTransit').html(theSun.daySolarTransit);
            $('.daySolarTransitFull').html(u.f(theSun.JD2FullGregorian(theSun.daySolarTransit)));
            $('ul .daySolarTransitFull').html(u.t(theSun.JD2FullGregorian(theSun.daySolarTransit)));

            $('.sunSetHourAngle').html(theSun.sunSetHourAngle);
            $('.sunSetSolarTransit').html(theSun.sunSetSolarTransit);
            $('.nextCalendarDaySet').html(u.f(theSun.sunSetDateParts));
            $('ul .nextCalendarDaySet').html(u.t(theSun.sunSetDateParts));
            $('.sunRiseSolarTransit').html(theSun.sunRiseSolarTransit);
            $('.nextCalendarDayRise').html(u.f(theSun.sunRiseDateParts));
            $('ul .nextCalendarDayRise').html(u.t(theSun.sunRiseDateParts));
            
            // TWILIGHTS
            
            $('.sunSetCivilTwilightDate').html(u.f(theSun.sunSetCivilTwilightDateParts));
            $('.sunRiseCivilTwilightDate').html(u.f(theSun.sunRiseCivilTwilightDateParts));
            $('.sunSetNauticalTwilightDate').html(u.f(theSun.sunSetNauticalTwilightDateParts));
            $('ul .sunSetNauticalTwilightDate').html(u.t(theSun.sunSetNauticalTwilightDateParts));
            $('.sunRiseNauticalTwilightDate').html(u.f(theSun.sunRiseNauticalTwilightDateParts));
            $('ul .sunRiseNauticalTwilightDate').html(u.t(theSun.sunRiseNauticalTwilightDateParts));
            $('.sunSetAstronomicalTwilightDate').html(u.f(theSun.sunSetAstronomicalTwilightDateParts));
            $('.sunRiseAstronomicalTwilightDate').html(u.f(theSun.sunRiseAstronomicalTwilightDateParts));
            
        },

        initiate_geolocation: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(sunApp.handle_geolocation_query, sunApp.handle_errors);
            } else {
                yqlgeo.get('visitor', sunApp.normalize_yql_response);
            }
        },

        handle_errors: function (error) {
            var errMsg = "";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errMsg = "You did not share geolocation data. ";
                break;

                case error.POSITION_UNAVAILABLE:
                    errMsg = "We could not detect current position. ";
                break;

                case error.TIMEOUT:
                    errMsg = "Retrieving your current position timed out. ";
                break;

                default:
                    errMsg = "An unknown error happened. ";
                break;
            }

            sunApp.setFields(new Date(), sunApp.defaults.london);
            
            $('#box').prepend($('<p class="info">').html(errMsg + sunApp.defaultCoordsMessage));
            $('.userinputs').show();
            sunApp.calculateTimes();
        },

        normalize_yql_response: function (response) {
            if (response.error) {
                var error = { code : 0 };
                sunApp.handle_error(error);
                return;
            }

            var position = {
                coords : {
                    latitude: response.place.centroid.latitude,
                    longitude: response.place.centroid.longitude
                },
                address : {
                    city: response.place.locality2.content,
                    region: response.place.admin1.content,
                    country: response.place.country.content
                }
            };

            sunApp.handle_geolocation_query(position);
        },

        handle_geolocation_query: function (position) {
            sunApp.setFields(new Date(), {lat: position.coords.latitude, lng: position.coords.longitude});
            sunApp.calculateTimes();
        }
    };

$(function(){
    $('.userinputs').hide();
    sunApp.initiate_geolocation();

    $("#calculate").click(function(){sunApp.calculateTimes(); return false;});
});