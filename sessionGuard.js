/**
 * @author Alexey Novak.
 */

/*global $*/

(function(sessionGuard, $) {
  "use strict";
  
  window.sessionGuard = function (options) {
    options = options || {};
    
    var that = {},
        timeLogout = options.timeLogout * 1000,
        timeWarning = options.timeWarning * 1000,
        onWarning = options.onWarning || function () {},
        onLogout = options.onLogout || function () {},
        onActive = options.onActive || function () {},
        cookieName = "userActivity", // Cookie name which will be used for tracking activity time
        activityTime, warningTimeout, logoutTimeout;
        
    if (timeWarning >= timeLogout) {
      return;
    }
    timeWarning = timeLogout - timeWarning;
    
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
    
    that.checkIfActive = options.checkIfActive || function (timeStamp) {
      var cookieActiveTimeStamp = that.getCookieActivityTime();
      if (timeStamp < cookieActiveTimeStamp) {
        activityTime = cookieActiveTimeStamp;
        return true;
      }
      return false;
    };
    
    var activityCheck = function (callback) {
      if (that.checkIfActive(activityTime)) {
        startCountdown();
        onActive();
      } else {
        callback();
      }
    };

    writeCookieTime();
    startCountdown();
    
    return that;
  };
  
})(window.sessionGuard = window.sessionGuard || {}, jQuery);