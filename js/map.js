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

    if (!adPinsInserted) {
      window.backend.load(showAds, window.showMessage);
    }
  };

  var mainPinMousemoveHandler = function (evt) {
    evt.preventDefault();
    var mainPinPointerHeight = 18;
    var mainPinSize = 65;
    var deltaY = mainPinSize / 2 + mainPinPointerHeight;
    var mapHeight = mapElement.clientHeight;
    var lowestY = mapHeight - (100 + deltaY);
    var highestY = mapHeight - (500 + deltaY);

    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY,
    };

    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    var newXCoord = mainPin.offsetLeft - shift.x;
    var newYCoord = mainPin.offsetTop - shift.y;
    newYCoord = newYCoord > lowestY ? lowestY : newYCoord;
    newYCoord = newYCoord < highestY ? highestY : newYCoord;
    mainPin.style.left = newXCoord + 'px';
    mainPin.style.top = newYCoord + 'px';
    window.form.setAddressValue('x: ' + newXCoord + ', y: ' + (mapHeight - newYCoord - deltaY));
  };

  var mainPinMousedownHandler = function (evt) {
    evt.preventDefault();

    startCoords = {
      x: evt.clientX,
      y: evt.clientY,
    };

    mainPin.addEventListener('mousemove', mainPinMousemoveHandler);
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
  };

  var removeMainPinListeners = function () {
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    mainPin.removeEventListener('mousemove', mainPinMousemoveHandler);
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
      mapElement.addEventListener('mouseup', removeMainPinListeners);
    }
  };

  window.map = {
    addMapEventListeners: addMapEventListeners,
    updateMapPins: updateMapPins,
  };
})();
