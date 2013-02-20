(function (sessionGuard, $) {
  
  var lastActivity = new Date(),
      warningDiv = "#warningDiv",
      logoutDiv = "#logoutDiv",
      timedOutClass = "timedOut",
      msToString = function (ms) {
        var sec = parseInt((ms / 1000) % 60),
            min = parseInt(((ms / 1000) / 60) % 60),
            hrs = parseInt((((ms / 1000) / 60) / 60) % 24);
        sec = (sec < 10) ? "0" + sec : "" + sec;
        min = (min < 10) ? "0" + min : "" + min;
        hrs = (hrs < 10) ? "0" + hrs : "" + hrs;
        
        return hrs + ":" + min + ":" + sec;
      },
      interval = setInterval(function () {
        var diff = (new Date()) - lastActivity,
            timeTillWarning = sg.getTimeTillWarning() - diff,
            timeTillLogout = sg.getTimeTillLogout() - diff;
        $(warningDiv).text(msToString((timeTillWarning > 0) ? timeTillWarning : 0));
        $(logoutDiv).text(msToString((timeTillLogout > 0) ? timeTillLogout : 0));
      }, 400),
      styleTimeBox = function (selector, addClass) {
        $(selector)[(addClass) ? "addClass" : "removeClass"](timedOutClass);
      },
      onWarning = function () {
        styleTimeBox(warningDiv, true);
      },
      onLogout = function () {
        styleTimeBox(logoutDiv, true);
        clearInterval(interval);
      },
      onActive = function () {
        styleTimeBox(warningDiv, false);
        styleTimeBox(logoutDiv, false);
      };
      
  var sg = sessionGuard({
    timeLogout: 20,
    timeWarning: 10,
    onWarning: onWarning,
    onLogout: onLogout
  });
})(window.sessionGuard = window.sessionGuard || {}, jQuery);