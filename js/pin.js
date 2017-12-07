'use strict';

(function () {
  var createPinElement = function (ad) {
    var pinPointerHeight = 18;
    var pinSizeY = 44;
    var avatarWidth = 40;
    var avatarHeight = 40;

    var buttonElement = document.createElement('button');
    buttonElement.style.left = ad.location.x + 'px';
    buttonElement.style.top = (ad.location.y - pinSizeY / 2 - pinPointerHeight) + 'px';
    buttonElement.className = 'map__pin';
    buttonElement.dataset.ad = JSON.stringify(ad);

    var imgElement = document.createElement('img');
    imgElement.src = ad.author.avatar;
    imgElement.width = avatarWidth;
    imgElement.height = avatarHeight;
    imgElement.draggable = false;
    imgElement.style.pointerEvents = 'none';

    buttonElement.appendChild(imgElement);
    return buttonElement;
  };

  var mapPinClickHandler = function (evt) {
    var target = evt.target;
    if (target.classList.contains('map__pin')) {
      window.card.deactivateOtherPins();
      var adData = target.dataset.ad;
      if (adData) {
        var pinAd = JSON.parse(adData);
        window.card.showAdElement(window.card.createAdElement(pinAd));
      }
      target.classList.add('map__pin--active');
    }

    document.addEventListener('keydown', window.card.popupEscPressHandler);
  };

  window.pin = {
    createPinElement: createPinElement,
    mapPinClickHandler: mapPinClickHandler,
  };
})();
