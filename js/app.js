'use strict';

(function () {

  var initApp = function () {
    window.map.addMapEventListeners();

    window.form.setUpSyncOfCheckTimes();
    window.form.setUpMinPricesSync();
    window.form.setUpGuestsCapacitySync();

    window.form.setUpCustomValidation();
    window.form.bindFormReset();

    window.photoPreview.bindAvatarLoading();
    window.photoPreview.bindAdPhotosLoading();
  };

  initApp();
})();
