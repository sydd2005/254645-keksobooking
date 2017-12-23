'use strict';

(function () {
  var MAX_ADS = 5;
  var VALUE_ANY = 'any';
  var PRICE_RANGES = {
    low: {
      from: 0,
      to: 10000,
    },
    middle: {
      from: 10000,
      to: 50000,
    },
    high: {
      from: 50000,
      to: Infinity,
    },
  };

  var filters = {};

  var filtersFormElement = document.querySelector('.map__filters');
  if (filtersFormElement) {
    filtersFormElement.addEventListener('change', function (evt) {
      filters[evt.target.id] = typeof evt.target.checked !== 'undefined' ? evt.target.checked : evt.target.value;
      window.debounce(window.map.updateMapPins);
    });
  }

  var matchesAny = function (value) {
    return typeof value === 'undefined' || value === VALUE_ANY;
  };

  var matchesPriceRange = function (rangeName, offerPrice) {
    return matchesAny(rangeName) || (+offerPrice >= PRICE_RANGES[rangeName].from && +offerPrice < PRICE_RANGES[rangeName].to);
  };

  var filterAds = function (ads) {
    return ads.filter(function (ad) {
      return (matchesAny(filters['housing-type']) || ad.offer.type === filters['housing-type']) &&
             matchesPriceRange(filters['housing-price'], ad.offer.price) &&
             (matchesAny(filters['housing-rooms']) || ad.offer.rooms.toString() === filters['housing-rooms']) &&
             (matchesAny(filters['housing-guests']) || ad.offer.guests.toString() === filters['housing-guests']) &&
             (matchesAny(filters['filter-wifi']) || !filters['filter-wifi'] || ad.offer.features.indexOf('wifi') !== -1) &&
             (matchesAny(filters['filter-dishwasher']) || !filters['filter-dishwasher'] || ad.offer.features.indexOf('dishwasher') !== -1) &&
             (matchesAny(filters['filter-parking']) || !filters['filter-parking'] || ad.offer.features.indexOf('parking') !== -1) &&
             (matchesAny(filters['filter-washer']) || !filters['filter-washer'] || ad.offer.features.indexOf('washer') !== -1) &&
             (matchesAny(filters['filter-elevator']) || !filters['filter-elevator'] || ad.offer.features.indexOf('elevator') !== -1) &&
             (matchesAny(filters['filter-conditioner']) || !filters['filter-conditioner'] || ad.offer.features.indexOf('conditioner') !== -1);
    }).slice(0, MAX_ADS);
  };

  window.filterAds = filterAds;
})();
