var now = new Date();

function SunApp(config){
    this.config = $.extend(false, {
        'lat': 51.508,
        'lng': -0.125,
        'day': now.getDate(),
        'month': now.getMonth() + 1,
        'year': now.getFullYear()
    }, config);

    this.timer = null;
    this.interval = 60000; // The update interval for updating effects
}

SunApp.prototype = {
    init: function () {
        var geo = new Geolocation($.proxy(this.handleGeolocationSuccess, this), $.proxy(this.handleGeolocationErrors, this));
        geo.init();
    },

    destroy: function () {
        this.timer = null;
    },

    calculateTimes: function () {
        var theSun = new Sun([this.config.day, this.config.month, this.config.year], this.config.lat, this.config.lng);
        
        theSun.calculateAll();
        
        $('ul .daySolarTransitFull').html(u.t(u.tz(theSun.JD2FullGregorian(theSun.daySolarTransit)), false));
        $('ul .nextCalendarDaySet').html(u.t(u.tz(theSun.sunSetDateParts), false));
        $('ul .nextCalendarDayRise').html(u.t(u.tz(theSun.sunRiseDateParts), false));
        $('ul .sunSetCivilTwilightDate').html(u.t(u.tz(theSun.sunSetCivilTwilightDateParts), false));
        $('ul .sunRiseCivilTwilightDate').html(u.t(u.tz(theSun.sunRiseCivilTwilightDateParts), false));

        this.setProgressBarWidths(theSun);
        this.moveMarker();
        this.animate();
    },

    handleGeolocationErrors: function (error) {
        this.calculateTimes();
    },

    handleGeolocationSuccess: function (position) {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.calculateTimes();
    },

    setProgressBarWidths: function (theSun) {
        var morningMinutes = this.minutesFromMidnight(theSun.sunRiseCivilTwilightDateParts),
            dawnMinutes = this.minutesFromMidnight(theSun.sunRiseDateParts) - morningMinutes,
            dayMinutes = this.minutesFromMidnight(theSun.sunSetDateParts) - this.minutesFromMidnight(theSun.sunRiseDateParts),
            duskMinutes = this.minutesFromMidnight(theSun.sunSetCivilTwilightDateParts) - this.minutesFromMidnight(theSun.sunSetDateParts),
            eveningMinutes = 1440 - this.minutesFromMidnight(theSun.sunSetCivilTwilightDateParts);
        
        $(".timeline .morning").css({width: (morningMinutes / 14.4) + "%"});
        $(".timeline .dawn").css({width: (dawnMinutes / 14.4) + "%"});
        $(".timeline .day").css({width: (dayMinutes / 14.4) + "%"});
        $(".timeline .dusk").css({width: (duskMinutes / 14.4) + "%"});
        $(".timeline .evening").css({width: (eveningMinutes / 14.4) + "%"});
    },

    animate: function () {
        this.timer = setInterval(this.moveMarker, this.interval);
    },

    moveMarker: function () {
        var now = new Date();
            left = ((now.getHours() * 60 + now.getMinutes()) / 14.4) + "%";
        $(".timeline .marker").css({'left': left});
        now = null;
    },

    minutesFromMidnight: function (d) {
        return  d[3] * 60 + d[4];
    }
};