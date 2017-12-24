'use strict';

(function () {
  var mapElement = document.querySelector('.map');

  var fadeMapIn = function () {
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

  var updateMapPins = function () {
    var filteredAds = window.filterAds(loadedAds);
    var newPins = createPinElements(filteredAds);
    var pinsFragment = document.createDocumentFragment();

    for (var i = 0; i < newPins.length; i++) {
      pinsFragment.appendChild(newPins[i]);
    }

    var targetElement = document.querySelector('.map__pins');
    if (targetElement) {
      var oldPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
      [].forEach.call(oldPins, function (pin) {
        targetElement.removeChild(pin);
      });
      targetElement.appendChild(pinsFragment);
    }
  };

  var mainPin = document.querySelector('.map__pin--main');
  var startCoords = {
    x: 0,
    y: 0,
  };

  var adPinsInserted = false;
  var loadedAds = [];

  var showAds = function (ads) {
    loadedAds = ads;
    fadeMapIn();
    window.form.syncRoomsWithGuests();
    window.form.enableAdForm();
    window.debounce(updateMapPins);
    adPinsInserted = true;
  };

  var mainPinMouseupHandler = function (evt) {
    evt.preventDefault();

    window.backend.load(showAds, window.showMessage);
    document.removeEventListener('mouseup', mainPinMouseupHandler);
  };

  var PIN_POINTER_HEIGHT = 18;
  var PIN_CIRCLE_HEIGHT = 65;
  var MOVE_LOW_BOUND = 100;
  var MOVE_HIGH_BOUND = 500;
  var pinHeight = PIN_CIRCLE_HEIGHT / 2 + PIN_POINTER_HEIGHT;
  var mapHeight = mapElement.clientHeight;
  var lowestY = mapHeight - (MOVE_LOW_BOUND + pinHeight);
  var highestY = mapHeight - (MOVE_HIGH_BOUND + pinHeight);

  var mainPinMousemoveHandler = function (evt) {
    evt.preventDefault();

    var clientX = evt.clientX;
    var clientY = evt.clientY + document.documentElement.scrollTop;

    if (clientY > highestY && clientY < lowestY) {
      var shift = {
        x: startCoords.x - clientX,
        y: startCoords.y - clientY,
      };

      startCoords = {
        x: clientX,
        y: clientY,
      };

      var pinTopLeftX = mainPin.offsetLeft - shift.x;
      var pinTopLeftY = mainPin.offsetTop - shift.y;
      pinTopLeftY = pinTopLeftY > lowestY ? lowestY : pinTopLeftY;
      pinTopLeftY = pinTopLeftY < highestY ? highestY : pinTopLeftY;
      mainPin.style.left = pinTopLeftX + 'px';
      mainPin.style.top = pinTopLeftY + 'px';
      var coordsText = 'x: ' + pinTopLeftX + ', y: ' + (mapHeight - pinTopLeftY - pinHeight);
      window.form.setAddressValue(coordsText);
    }
  };

  var mainPinMousedownHandler = function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY + document.documentElement.scrollTop,
    };

    document.addEventListener('mousemove', mainPinMousemoveHandler);
    if (!adPinsInserted) {
      document.addEventListener('mouseup', mainPinMouseupHandler);
    }
  };

  var mapElementMouseupHandler = function () {
    document.removeEventListener('mousemove', mainPinMousemoveHandler);
  };

  var addMapEventListeners = function () {
    if (mainPin) {
      mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    }

    var mapPinsElement = document.querySelector('.map__pins');
    if (mapPinsElement) {
      mapPinsElement.addEventListener('click', window.pin.mapPinClickHandler);
    }

    if (mapElement) {
      mapElement.addEventListener('click', window.card.popupCloseButtonClickHandler);
    }
    document.addEventListener('mouseup', mapElementMouseupHandler);
  };

  window.map = {
    addMapEventListeners: addMapEventListeners,
    updateMapPins: updateMapPins,
  };
})();
