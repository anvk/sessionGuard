/**
 * @author Alexey Novak.
 */

/*global $*/

(function(sessionGuard, $) {
  "use strict";
  
  var that = {},
    timeLogout = 20000,
    timeWarning = 10000,
    onWarning = function() {},
    onLogout = function() {},
    onActive = function() {},
    cookieName = "userActivity", // Cookie name which will be used for tracking activity time
    activityTime, warningTimeout, logoutTimeout;
  
  var writeCookieTime = function () {
    var now = new Date();
    activityTime = now;
    $.cookie(cookieName, now.toString());
  };
  
  var startCountdown = function () {
    clearTimeout(warningTimeout);
    clearTimeout(logoutTimeout);
    
    warningTimeout = setTimeout(function () {
      activityCheck(onWarning);
    }, timeWarning);
    
    logoutTimeout = setTimeout(function () {
      activityCheck(onLogout);
    }, timeLogout);
  };
  
  var activityCheck = function (callback) {
    if (that.checkIfActive(activityTime)) {
      startCountdown();
      onActive();
    } else {
      callback();
    }
  };
  
  that.getPageActivityTime = function () {
    return activityTime.toString();
  };
  
  that.getCookieActivityTime = function () {
    return (new Date($.cookie(cookieName)));
  };
  
  that.getTimeTillWarning = function () {
    return timeWarning;
  };
  
  that.getTimeTillLogout = function () {
    return timeLogout;
  };
  
  that.checkIfActive = function(timeStamp) {
    var cookieActiveTimeStamp = that.getCookieActivityTime();
    if (timeStamp < cookieActiveTimeStamp) {
      activityTime = cookieActiveTimeStamp;
      return true;
    }
    return false;
  };
  
  sessionGuard.start = function(options) {
    options = options || {};
    
    timeLogout = options.timeLogout * 1000 || timeLogout,
    timeWarning = options.timeWarning * 1000 || timeWarning,
    onWarning = options.onWarning || onWarning,
    onLogout = options.onLogout || onLogout,
    onActive = options.onActive || onActive
    
    if (timeWarning >= timeLogout) {
      return;
    }
    timeWarning = timeLogout - timeWarning;
    
    writeCookieTime();
    startCountdown();
    
    return that;
  };
  
})(window.sessionGuard = window.sessionGuard || {}, jQuery);