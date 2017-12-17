'use strict';

(function () {
  var RESPONSE_STATUS_OK = 200;

  var LOAD_DATA_ENDPOINT = 'https://1510.dump.academy/keksobooking/data';
  var SAVE_DATA_ENDPOINT = 'https://1510.dump.academy/keksobooking';

  var createXhr = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === RESPONSE_STATUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Некорректный статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс.');
    });

    xhr.timeout = 5000;

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = createXhr(onLoad, onError);
    xhr.open('GET', LOAD_DATA_ENDPOINT);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = createXhr(onLoad, onError);
    xhr.open('POST', SAVE_DATA_ENDPOINT);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save,
  };
})();
