'use strict';

(function () {
  window.showCard = function (adElement) {
    var mapElement = document.querySelector('.map');
    if (mapElement) {
      var existingAdElements = mapElement.querySelectorAll('.' + adElement.className.replace(' ', '.'));
      for (var i = 0; i < existingAdElements.length; i++) {
        mapElement.removeChild(existingAdElements[i]);
      }
      var filterContainersElement = mapElement.querySelector('.map__filters-container');
      if (filterContainersElement) {
        mapElement.insertBefore(adElement, filterContainersElement);
      }
    }
  };
})();
