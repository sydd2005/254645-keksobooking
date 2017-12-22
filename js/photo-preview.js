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

  var avatarPreviewElement = document.querySelector('.notice__preview img');
  var defaultAvatar = avatarPreviewElement.src;
  var adPhotosPreviewContainer = document.querySelector('.form__photo-container');

  var resetAvatar = function () {
    avatarPreviewElement.src = defaultAvatar;
  };

  var resetAdPhotos = function () {
    var photoListElement = adPhotosPreviewContainer.querySelector('#images-list');
    if (photoListElement) {
      adPhotosPreviewContainer.removeChild(photoListElement);
    }
  };

  var resetPreviews = function () {
    resetAvatar();
    resetAdPhotos();
  };

  var bindAvatarLoading = function () {
    var avatarFileInput = document.querySelector('#avatar');

    avatarFileInput.addEventListener('change', function () {
      var file = avatarFileInput.files[0];

      if (isImageFile(file)) {
        showPreview(file, avatarPreviewElement);
      }
    });
  };

  var createPhotoListItemElement = function (photoFile) {
    var photoListItemElement = document.createElement('li');
    photoListItemElement.style.marginBottom = '5px';

    var previewImgElement = document.createElement('img');
    previewImgElement.style.maxWidth = '100%';
    showPreview(photoFile, previewImgElement);

    photoListItemElement.appendChild(previewImgElement);

    return photoListItemElement;
  };

  var bindAdPhotosLoading = function () {
    var adPhotosFileInput = document.querySelector('#images');
    adPhotosFileInput.multiple = true;

    adPhotosFileInput.addEventListener('change', function () {
      var files = adPhotosFileInput.files;

      var photoListElement = adPhotosPreviewContainer.querySelector('#images-list');
      if (photoListElement) {
        adPhotosPreviewContainer.removeChild(photoListElement);
        photoListElement.innerHTML = '';
      } else {
        photoListElement = document.createElement('ul');
        photoListElement.id = 'images-list';
      }
      photoListElement.style = 'display: flex; flex-direction: column; padding: 0; list-style: none;';

      [].forEach.call(files, function (file) {
        if (isImageFile(file)) {
          photoListElement.appendChild(createPhotoListItemElement(file));
        }
      });

      adPhotosPreviewContainer.appendChild(photoListElement);
    });
  };

  window.photoPreview = {
    bindAvatarLoading: bindAvatarLoading,
    bindAdPhotosLoading: bindAdPhotosLoading,
    resetPreviews: resetPreviews,
  };
})();
