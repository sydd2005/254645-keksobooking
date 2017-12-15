'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var OFFER_TYPE_MAP = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
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

  var deactivateOtherPins = function () {
    var otherActivePins = document.querySelectorAll('.map__pin--active');
    if (otherActivePins) {
      for (var i = 0; i < otherActivePins.length; i++) {
        otherActivePins[i].classList.remove('map__pin--active');
      }
    }
  };

  var popupEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.preventDefault();
      closePopup();
    }
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

  window.card = {
    createAdElement: createAdElement,
    deactivateOtherPins: deactivateOtherPins,
    popupCloseButtonClickHandler: popupCloseButtonClickHandler,
    popupEscPressHandler: popupEscPressHandler,
  };
})();
