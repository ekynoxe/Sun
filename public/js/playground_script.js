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
    now = new Date(),
    // Specific code for the Sun front-end application
    sunApp = {
        day: now.getDay(),
        month: now.getMonth(),
        year: now.getYear(),
        // Defaulting to London Westminster
        lat: 51.508,
        lng: -0.125,
        defaultsCoordsMessage: "The date has been set to Today's date, and the place defaulted to London - Westminster.<br/.>Update the values below and hit \"Calculate!\" to get the info you want!",
        calculateTimes: function() {
            var theSun = new Sun([sunApp.day, sunApp.month, sunApp.year], sunApp.lat, sunApp.lng);
            
            theSun.calculateAll();
            
            $('ul .daySolarTransitFull').html(u.t(u.tz(theSun.JD2FullGregorian(theSun.daySolarTransit)), false));
            $('ul .nextCalendarDaySet').html(u.t(u.tz(theSun.sunSetDateParts), false));
            $('ul .nextCalendarDayRise').html(u.t(u.tz(theSun.sunRiseDateParts), false));
            $('ul .sunSetNauticalTwilightDate').html(u.t(u.tz(theSun.sunSetNauticalTwilightDateParts), false));
            $('ul .sunRiseNauticalTwilightDate').html(u.t(u.tz(theSun.sunRiseNauticalTwilightDateParts), false));
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

            $('#box').prepend($('<p class="info">').html(errMsg + sunApp.defaultsCoordsMessage));
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
            sunApp.lat = position.coords.latitude;
            sunApp.lng = position.coords.longitude;
            sunApp.calculateTimes();
        },

        toggleDetails: function () {
            $(this).children('span').toggle();
            $('.details').toggle(400);
            return false;
        }
    };

$(function(){
    sunApp.initiate_geolocation();
});