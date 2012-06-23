/**
 * Utils: Class containing date and trigonometry functions
 * @Author: Mathieu Davy - Ekynoxe, 2012 http://ekynoxe.com
 */
function Utils(){}

Utils.prototype = {
    /**
     * Format a date from an array [day, month, year, hours, minutes, seconds] to 'DD/MM/YYYY at hh:mm:ss'
     * @param: Array d
     */
    f: function(d) {
        return u.pad2(d[0]) + '/' + u.pad2(d[1]) + '/' + u.pad2(d[2]) + ' at ' + u.pad2(d[3]) + ':' + u.pad2(d[4]) + ':' + u.pad2(d[5]);
    },

    /**
     * Format a date from an array [day, month, year, hours, minutes, seconds] to 'hh:mm:ss'
     * @param: Array d
     */
    t: function(d) {
        return u.pad2(d[3]) + ':' + u.pad2(d[4]) + ':' + u.pad2(d[5]);
    },

    /**
     * Format a date from an array [day, month, year, hours, minutes, seconds] to 'DD/MM/YYYY'
     * @param: Array d
     */
    d: function(d) {
        return u.pad2(d[0]) + '/' + u.pad2(d[1]) + '/' + u.pad2(d[2]);
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
    },

    /**
     * To degrees. Transforms a value in radians to degrees
     * @param: Float r
     */
    td: function(r) {
        return (r/Math.PI*180)%360;
    },

    /**
     * Zero pad of single digit numbers to two digits
     * @param: Int number
     */
    pad2: function (number){
        return (number < 10 ? '0' : '') + number;
    }
};