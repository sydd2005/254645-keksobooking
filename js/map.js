'use strict';

(function () {
  var fadeMapIn = function () {
    var mapElement = document.querySelector('.map');
    if (mapElement) {
      mapElement.classList.remove('map--faded');
    }
  };

  var createPinElements = function (ads) {
    var pins = [];

    for (var i = 0; i < ads.length; i++) {
      pins[i] = window.pin.createPinElement(ads[i]);
    }

    return pins;
  };

  var insertMapPins = function (pins) {
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      pinsFragment.appendChild(pins[i]);
    }

    var targetElement = document.querySelector('.map__pins');
    if (targetElement) {
      targetElement.appendChild(pinsFragment);
    }
  };

  var mainPin = document.querySelector('.map__pin--main');

  var mainPinMouseupHandler = function () {
    var ads = window.data.generateAds();
    fadeMapIn();
    insertMapPins(createPinElements(ads));
    window.form.enableAdForm();

    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
  };

  var addMapEventListeners = function () {
    if (mainPin) {
      mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    }

    var mapPinsElement = document.querySelector('.map__pins');
    if (mapPinsElement) {
      mapPinsElement.addEventListener('click', window.pin.mapPinClickHandler);
    }

    var mapElement = document.querySelector('.map');
    if (mapElement) {
      mapElement.addEventListener('click', window.card.popupCloseButtonClickHandler);
    }
  };

  window.map = {
    addMapEventListeners: addMapEventListeners,
  };
})();
