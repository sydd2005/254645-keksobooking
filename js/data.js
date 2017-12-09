'use strict';

(function () {
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

  window.data = {
    generateAds: generateAds,
  };
})();
