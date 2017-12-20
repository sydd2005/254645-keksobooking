'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var lastTimeout;

  var debounce = function (funcToDebounce) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(funcToDebounce, DEBOUNCE_INTERVAL);
  };

  window.debounce = debounce;
})();
