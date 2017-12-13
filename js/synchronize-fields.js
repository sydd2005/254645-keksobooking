'use strict';

(function () {
  window.synchronizeFields = function (mainElement, dependentElement, mainValues, dependentValues, cb) {
    if (mainElement && dependentElement) {
      var valuesMap = {};
      for (var i = 0; i < mainValues.length; i++) {
        valuesMap[mainValues[i]] = dependentValues[i];
      }
      mainElement.addEventListener('input', function (evt) {
        cb(dependentElement, valuesMap[evt.target.value]);
      });
    }
  };
})();
