/**
 * Sun: Calulating sunrise, sunset and later on equinoxes
 * This code is based on the work of Dr Louis Strous at
 *      http://www.astro.uu.nl/~strous/AA/en/index.html
 * Specifically, these calculations implement his equations and
 *      use his constant values found at
 *      http://www.astro.uu.nl/~strous/AA/en/reken/zonpositie.html
 * @Author: Mathieu Davy - Ekynoxe, 2011 http://ekynoxe.com
 */

var $=$,
    Sun = Sun,
    // Utilities
    u={
        // Format a date from an array [day, month, year, hours, minutes, seconds] to 'DD/MM/YYYY at hh:mm:ss'
        f: function(d) {
            return u.pad2(d[0]) + '/' + u.pad2(d[1]) + '/' + u.pad2(d[2]) + ' at ' + u.pad2(d[3]) + ':' + u.pad2(d[4]) + ':' + u.pad2(d[5]);
        },
        // Format a date from an array [day, month, year, hours, minutes, seconds] to 'hh:mm:ss'
        t: function(d) {
            return u.pad2(d[3]) + ':' + u.pad2(d[4]) + ':' + u.pad2(d[5]);
        },
        // Format a date from an array [day, month, year, hours, minutes, seconds] to 'DD/MM/YYYY'
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
        td: function(r) {
            return (r/Math.PI*180)%360;
        },
        pad2: function (number){
            return (number < 10 ? '0' : '') + number;
        }
    },
    defaults = {
        london: {
        // decimal below correspond to: 51°30'26"N 0°7'39"W
            lat: 51.508,
            lng: -0.125
        },
        netherlands: {
        // numbers below correspond to: 52°00'00"N 0°5'00"E, for testing against resource site date example
            lat: 52,
            lng: 5
        }
    },
    mySun = {
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
            var dateParts = mySun.getDateParts(),
                    coordinates = mySun.getCoordinates(),
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
            
        }
    };

$(function(){
    mySun.setFields(new Date(), defaults.london);
    // mySun.setFields(new Date(2004, 3, 1),defaults.netherlands);
    mySun.calculateTimes();
    $("#calculate").click(function(){mySun.calculateTimes(); return false;});
});