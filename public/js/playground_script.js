/**
 * sunApp: Using my Sun library to calulating sunrise, sunset and later on equinoxes
 *  https://github.com/ekynoxe/Sun/blob/master/public/js/Sun.js
 * The library code is based on the work of Dr Louis Strous at
 *      http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *      use his constant values found at
 *      http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011-2012 http://ekynoxe.com
 */

var u = new Utils(),
    now = new Date(),
    s = new SunApp();

$(function () {
    s.init();
});
$(window).unload(
    s.destroy
);