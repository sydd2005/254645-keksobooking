'use strict';

var ESC_KEYCODE = 27;

var ADS_COUNT = 8;
var MAX_GUESTS_PER_ROOM = 3;

var OFFER_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде',
];

var OFFER_TYPES = [
  'flat',
  'house',
  'bungalo',
];

var OFFER_TYPE_MAP = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало',
};

var CHECKIN_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

var CHECKOUT_TIMES = [
  '12:00',
  '13:00',
  '14:00',
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

var generateRandomInclusive = function (lowBound, highBound) {
  return lowBound + Math.floor(Math.random() * (highBound - lowBound + 1));
};

var generateRandomIndex = function (arrayLength) {
  return Math.floor(Math.random() * arrayLength);
};

var generateAds = function () {
  var ads = [];
  var avatarBase = 'img/avatars/user';
  var offerTitles = OFFER_TITLES.slice();
  var locationXLowBound = 300;
  var locationXHighBound = 900;
  var locationYLowBound = 100;
  var locationYHighBound = 500;
  var priceLowBound = 1000;
  var priceHighBound = 1000000;
  var roomsLowBound = 1;
  var roomsHighBound = 5;

  for (var i = 0; i < ADS_COUNT; i++) {
    var titleIndex = generateRandomIndex(offerTitles.length);
    var locationX = generateRandomInclusive(locationXLowBound, locationXHighBound);
    var locationY = generateRandomInclusive(locationYLowBound, locationYHighBound);
    var featuresCount = generateRandomInclusive(0, FEATURES.length);
    var allFeatures = FEATURES.slice();
    var offerFeatures = [];
    for (var j = 0; j < featuresCount; j++) {
      offerFeatures = offerFeatures.concat(allFeatures.splice(generateRandomIndex(allFeatures.length), 1));
    }
    var rooms = generateRandomInclusive(roomsLowBound, roomsHighBound);
    var guests = generateRandomInclusive(rooms, rooms * MAX_GUESTS_PER_ROOM);

    ads.push({
      author: {
        avatar: i + 1 > 9 ? avatarBase + (i + 1) + '.png' : avatarBase + '0' + (i + 1) + '.png',
      },
      offer: {
        title: offerTitles[titleIndex],
        address: locationX + ', ' + locationY,
        price: generateRandomInclusive(priceLowBound, priceHighBound),
        type: OFFER_TYPES[generateRandomIndex(OFFER_TYPES.length)],
        rooms: rooms,
        guests: guests,
        checkin: CHECKIN_TIMES[generateRandomIndex(CHECKIN_TIMES.length)],
        checkout: CHECKOUT_TIMES[generateRandomIndex(CHECKOUT_TIMES.length)],
        features: offerFeatures,
        description: '',
        photos: [],
      },
      location: {
        x: locationX,
        y: locationY,
      },
    });
    offerTitles.splice(titleIndex, 1);
  }

  return ads;
};

var fadeMapIn = function () {
  var mapElement = document.querySelector('.map');
  if (mapElement) {
    mapElement.classList.remove('map--faded');
  }
};

var createPinElements = function (ads) {
  var pins = [];
  var pinPointerHeight = 18;
  var pinSizeY = 44;
  var avatarWidth = 40;
  var avatarHeight = 40;

  for (var i = 0; i < ads.length; i++) {
    var buttonElement = document.createElement('button');
    buttonElement.style.left = ads[i].location.x + 'px';
    buttonElement.style.top = (ads[i].location.y - pinSizeY / 2 - pinPointerHeight) + 'px';
    buttonElement.className = 'map__pin';
    buttonElement.dataset.ad = JSON.stringify(ads[i]);

    var imgElement = document.createElement('img');
    imgElement.src = ads[i].author.avatar;
    imgElement.width = avatarWidth;
    imgElement.height = avatarHeight;
    imgElement.draggable = false;
    imgElement.style.pointerEvents = 'none';

    buttonElement.appendChild(imgElement);
    pins[i] = buttonElement;
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

var createAdElement = function (ad) {
  var adTemplate = document.querySelector('template');
  if (adTemplate) {
    var adElementTemplate = adTemplate.content.querySelector('.map__card');
    if (adElementTemplate) {
      var adElement = adElementTemplate.cloneNode(true);

      var titleElement = adElement.querySelector('h3');
      if (titleElement) {
        titleElement.textContent = ad.offer.title;
      }

      var addressElement = adElement.querySelector('p small');
      if (addressElement) {
        addressElement.textContent = ad.offer.address;
      }

      var priceElement = adElement.querySelector('.popup__price');
      if (priceElement) {
        priceElement.innerHTML = ad.offer.price + '&#x20bd;/ночь';
      }

      var offerTypeElement = adElement.querySelector('h4');
      if (offerTypeElement) {
        offerTypeElement.textContent = OFFER_TYPE_MAP[ad.offer.type];
      }

      var roomsForGuestsElement = adElement.querySelector('h4 + p');
      if (roomsForGuestsElement) {
        roomsForGuestsElement.textContent = ad.offer.rooms + ' для ' + ad.offer.guests + ' гостей';
      }

      var checkInOutElement = adElement.querySelector('h4 + p + p');
      if (checkInOutElement) {
        checkInOutElement.textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
      }

      var featuresElement = adElement.querySelector('.popup__features');
      if (featuresElement) {
        featuresElement.innerHTML = '';
        for (var j = 0; j < ad.offer.features.length; j++) {
          var featureElement = document.createElement('li');
          featureElement.className = 'feature feature--' + ad.offer.features[j];
          featuresElement.appendChild(featureElement);
        }
      }

      var descriptionElement = adElement.querySelector('ul + p');
      if (descriptionElement) {
        descriptionElement.textContent = ad.offer.description;
      }

      var avatarElement = adElement.querySelector('.popup__avatar');
      if (avatarElement) {
        avatarElement.src = ad.author.avatar;
      }
    }
  }

  return adElement;
};

var showAdElement = function (adElement) {
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

var enableAdForm = function () {
  var adForm = document.querySelector('.notice__form');
  if (adForm) {
    adForm.classList.remove('notice__form--disabled');
    var adFormFieldsets = adForm.querySelectorAll('fieldset');
    if (adFormFieldsets) {
      for (var i = 0; i < adFormFieldsets.length; i++) {
        adFormFieldsets[i].disabled = false;
      }
    }
  }
};

var popupEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.preventDefault();
    closePopup();
  }
};

var deactivateOtherPins = function () {
  var otherActivePins = document.querySelectorAll('.map__pin--active');
  if (otherActivePins) {
    for (var i = 0; i < otherActivePins.length; i++) {
      otherActivePins[i].classList.remove('map__pin--active');
    }
  }
};

var mapPinClickHandler = function (evt) {
  var target = evt.target;
  if (target.classList.contains('map__pin')) {
    deactivateOtherPins();
    var adData = target.dataset.ad;
    if (adData) {
      var pinAd = JSON.parse(adData);
      showAdElement(createAdElement(pinAd));
    }
    target.classList.add('map__pin--active');
  }

  document.addEventListener('keydown', popupEscPressHandler);
};

var closePopup = function () {
  var popup = document.querySelector('.popup');
  if (popup) {
    popup.parentElement.removeChild(popup);
  }

  deactivateOtherPins();

  document.removeEventListener('keydown', popupEscPressHandler);
};

var popupCloseButtonClickHandler = function (evt) {
  if (evt.target.classList.contains('popup__close')) {
    closePopup();
  }
};

var mainPinMouseupHandler = function () {
  var ads = generateAds();
  fadeMapIn();
  insertMapPins(createPinElements(ads));
  enableAdForm();

  var mainPin = document.querySelector('.map__pin--main');
  if (mainPin) {
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
  }
};

var initApp = function () {
  var mainPin = document.querySelector('.map__pin--main');
  if (mainPin) {
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
  }

  var mapPinsElement = document.querySelector('.map__pins');
  if (mapPinsElement) {
    mapPinsElement.addEventListener('click', mapPinClickHandler);
  }

  var mapElement = document.querySelector('.map');
  if (mapElement) {
    mapElement.addEventListener('click', popupCloseButtonClickHandler);
  }
};

initApp();
