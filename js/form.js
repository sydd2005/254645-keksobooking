'use strict';

(function () {
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var APARTMENT_TYPES = ['bungalo', 'flat', 'house', 'palace'];
  var APARTMENT_MIN_PRICES = [0, 1000, 5000, 10000];

  var setUpSyncOfCheckTimes = function () {
    var checkInSelect = document.querySelector('#timein');
    var checkOutSelect = document.querySelector('#timeout');

    var syncValues = function (element, value) {
      element.value = value;
    };

    window.synchronizeFields(checkInSelect, checkOutSelect, CHECK_TIMES, CHECK_TIMES, syncValues);
    window.synchronizeFields(checkOutSelect, checkInSelect, CHECK_TIMES, CHECK_TIMES, syncValues);
  };

  var setUpMinPricesSync = function () {
    var typeSelect = document.querySelector('#type');
    var priceInput = document.querySelector('#price');

    var syncValueWithMin = function (element, value) {
      element.min = value;
    };

    window.synchronizeFields(typeSelect, priceInput, APARTMENT_TYPES, APARTMENT_MIN_PRICES, syncValueWithMin);
  };

  var generateCapacityOptionsFragment = function (capacity, selectedValue) {
    var optionsFragment = document.createDocumentFragment();

    if (capacity === 0) {
      var optionElement = document.createElement('option');
      optionElement.value = 0;
      optionElement.innerText = 'не для гостей';
      optionsFragment.appendChild(optionElement);
    } else {
      for (var i = 1; i <= capacity; i++) {
        optionElement = document.createElement('option');
        optionElement.value = i;
        var guestsPlural = (i % 10 === 1) ? 'гостя' : 'гостей';
        optionElement.innerText = 'для ' + i + ' ' + guestsPlural;
        optionElement.selected = selectedValue === i.toString(10);
        optionsFragment.appendChild(optionElement);
      }
    }

    return optionsFragment;
  };

  var roomsAmountSelect = document.querySelector('#room_number');
  var capacitySelect = document.querySelector('#capacity');

  var setUpGuestsCapacitySync = function () {
    if (roomsAmountSelect && capacitySelect) {
      roomsAmountSelect.addEventListener('input', function () {
        var newRoomsAmount = roomsAmountSelect.value;
        var previouslySelectedValue = capacitySelect.value;
        capacitySelect.innerHTML = '';
        var newCapacity = newRoomsAmount === '100' ? 0 : +newRoomsAmount;
        var newOptionsFragment = generateCapacityOptionsFragment(newCapacity, previouslySelectedValue);
        capacitySelect.appendChild(newOptionsFragment);
      });
    }
  };

  var setInvalid = function (element, outlineColor) {
    element.style.borderColor = outlineColor;
  };

  var setValid = function (element) {
    element.style.borderColor = '';
  };

  var noticeForm = document.querySelector('.notice__form');

  var bindFormReset = function () {
    noticeForm.addEventListener('reset', function () {
      window.photoPreview.resetPreviews();
    });
  };

  var resetForm = function () {
    noticeForm.reset();
  };

  var setUpCustomValidation = function () {
    if (noticeForm) {
      var addressInput = noticeForm.querySelector('#address');
      var formElements = noticeForm.querySelectorAll('[name]');

      noticeForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        var canBeSubmitted = true;
        var errorOutlineColor = '#ff1111';

        var roomsAmount = +roomsAmountSelect.value;
        var capacity = +capacitySelect.value;
        if (roomsAmount === 100) {
          var capacityErrorMessage = capacity !== 0 ? 'something bad happened!' : '';
        } else {
          capacityErrorMessage = roomsAmount < capacity ? 'something bad happened!' : '';
        }
        capacitySelect.setCustomValidity(capacityErrorMessage);

        for (var i = 0; i < formElements.length; i++) {
          var currentElement = formElements[i];
          if (!currentElement.validity.valid) {
            setInvalid(currentElement, errorOutlineColor);
            canBeSubmitted = false;
          } else {
            setValid(currentElement);
          }
        }

        if (!addressInput.value) {
          setInvalid(addressInput, errorOutlineColor);
          canBeSubmitted = false;
        } else {
          setValid(addressInput);
        }

        if (canBeSubmitted) {
          window.backend.save(new FormData(noticeForm), resetForm, window.showMessage);
        }
      });
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

  var setAddressValue = function (address) {
    var addressInput = document.querySelector('#address');
    if (addressInput) {
      addressInput.value = address;
    }
  };

  window.form = {
    setUpSyncOfCheckTimes: setUpSyncOfCheckTimes,
    setUpMinPricesSync: setUpMinPricesSync,
    setUpGuestsCapacitySync: setUpGuestsCapacitySync,
    setUpCustomValidation: setUpCustomValidation,
    bindFormReset: bindFormReset,
    enableAdForm: enableAdForm,
    setAddressValue: setAddressValue,
  };
})();
