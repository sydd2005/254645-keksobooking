'use strict';

(function () {
  var IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];

  var isImageFile = function (file) {
    var fileName = file.name.toLowerCase();
    var fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
    return IMAGE_EXTENSIONS.indexOf(fileExtension) !== -1;
  };

  var showPreview = function (file, previewImgElement) {
    var reader = new FileReader();

    reader.addEventListener('load', function () {
      previewImgElement.src = reader.result;
    });

    reader.readAsDataURL(file);
  };

  var addAvatarLoading = function () {
    var avatarFileInput = document.querySelector('#avatar');
    var avatarPreviewElement = document.querySelector('.notice__preview img');

    avatarFileInput.addEventListener('change', function () {
      var file = avatarFileInput.files[0];

      if (isImageFile(file)) {
        showPreview(file, avatarPreviewElement);
      }
    });
  };

  var addAdPhotosLoading = function () {
    var adPhotosFileInput = document.querySelector('#images');
    adPhotosFileInput.multiple = true;
    var adPhotosPreviewContainer = document.querySelector('.form__photo-container');

    adPhotosFileInput.addEventListener('change', function () {
      var files = adPhotosFileInput.files;

      var pictureListElement = adPhotosPreviewContainer.querySelector('#images-list');
      if (pictureListElement) {
        adPhotosPreviewContainer.removeChild(pictureListElement);
        pictureListElement.innerHTML = '';
      } else {
        pictureListElement = document.createElement('ul');
        pictureListElement.id = 'images-list';
      }
      pictureListElement.style = 'display: flex; flex-direction: column; padding: 0; list-style: none;';

      for (var i = 0; i < files.length; i++) {
        if (isImageFile(files[i])) {
          var pictureListItemElement = document.createElement('li');
          pictureListItemElement.style.marginBottom = '5px';

          var previewImgElement = document.createElement('img');
          previewImgElement.style.maxWidth = '100%';
          showPreview(files[i], previewImgElement);

          pictureListItemElement.appendChild(previewImgElement);
          pictureListElement.appendChild(pictureListItemElement);
        }
      }

      adPhotosPreviewContainer.appendChild(pictureListElement);
    });
  };

  window.photoPreview = {
    addAvatarLoading: addAvatarLoading,
    addAdPhotosLoading: addAdPhotosLoading,
  };
})();
