/**
 * Geolocation: Class containing geolocation functions
 * @Author: Mathieu Davy - Ekynoxe, 2012 http://ekynoxe.com
 */
function Geolocation (success, failure) {
	this.success = success;
	this.failure = failure;
}

Geolocation.prototype = {
    init: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.success, this.failure);
        } else {
            yqlgeo.get('visitor', this.normalize_yql_response);
        }
    },

    normalize_yql_response: function (response) {
        if (response.error) {
            var error = { code : 0 };
            this.failure(error);
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

        this.success(position);
    }
 };