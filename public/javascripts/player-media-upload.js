(function () {
  var form = document.querySelector('[data-player-media-form]');
  if (!form) {
    return;
  }

  var fileInput = form.querySelector('input[name="mediaFile"]');
  var typeInputs = Array.prototype.slice.call(form.querySelectorAll('input[name="mediaType"]'));
  var previewSurface = form.querySelector('[data-player-media-preview-surface]');
  var previewImage = form.querySelector('[data-player-media-preview-image]');
  var previewFallback = form.querySelector('[data-player-media-preview-fallback]');
  var previewStatus = form.querySelector('[data-player-media-preview-status]');
  var previewHint = form.querySelector('[data-player-media-preview-hint]');
  var submitButton = form.querySelector('[data-player-media-submit]');
  var previewUrl = null;

  function getSelectedType() {
    var selected = typeInputs.find(function (input) { return input.checked; });
    return selected ? selected.value : 'avatar';
  }

  function setPreviewMode(mediaType) {
    if (!previewSurface) {
      return;
    }

    previewSurface.classList.toggle('player-media-circle', mediaType === 'avatar');
    previewSurface.classList.toggle('player-media-panel', mediaType !== 'avatar');
  }

  function updateStatusText(hasFile) {
    var mediaType = getSelectedType();
    if (previewStatus) {
      previewStatus.textContent = mediaType === 'avatar' ? 'Avatar mode' : 'Image mode';
    }
    if (previewHint) {
      previewHint.textContent = mediaType === 'avatar'
        ? 'Avatar mode crops the image into a square and resizes it before upload.'
        : 'Image mode keeps the full frame and scales large files down for a cleaner save.';
    }
    if (submitButton) {
      submitButton.textContent = hasFile
        ? (mediaType === 'avatar' ? 'Save Avatar' : 'Save Image')
        : 'Save Media';
    }
  }

  function revokePreviewUrl() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      previewUrl = null;
    }
  }

  function showPreview(url) {
    if (!previewImage || !previewFallback) {
      return;
    }

    previewImage.src = url;
    previewImage.hidden = false;
    previewFallback.hidden = true;
  }

  function resetPreview() {
    if (!previewImage || !previewFallback) {
      return;
    }

    var currentSrc = previewImage.getAttribute('data-current-src');
    if (currentSrc) {
      previewImage.src = currentSrc;
      previewImage.hidden = false;
      previewFallback.hidden = true;
      return;
    }

    if (!currentSrc) {
      previewImage.removeAttribute('src');
      previewImage.hidden = true;
      previewFallback.hidden = false;
    }
  }

  function updatePreviewFromFile(file) {
    if (!file) {
      revokePreviewUrl();
      resetPreview();
      updateStatusText(false);
      return;
    }

    revokePreviewUrl();
    previewUrl = URL.createObjectURL(file);
    showPreview(previewUrl);
    updateStatusText(true);
  }

  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      var objectUrl = URL.createObjectURL(file);

      image.onload = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not read the selected image file.'));
      };

      image.src = objectUrl;
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve) {
      canvas.toBlob(resolve, type, quality);
    });
  }

  async function transformFile(file, mediaType) {
    if (!file || !file.type || file.type.indexOf('image/') !== 0) {
      return file;
    }

    var image = await loadImage(file);
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    if (mediaType === 'avatar') {
      var side = Math.min(image.naturalWidth, image.naturalHeight);
      var sourceX = Math.round((image.naturalWidth - side) / 2);
      var sourceY = Math.round((image.naturalHeight - side) / 2);
      canvas.width = 512;
      canvas.height = 512;
      context.drawImage(image, sourceX, sourceY, side, side, 0, 0, canvas.width, canvas.height);
    } else {
      var maxDimension = 1440;
      var scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    var blob = await canvasToBlob(canvas, 'image/webp', 0.9);
    if (!blob) {
      return file;
    }

    var nameRoot = (file.name || 'player-media').replace(/\.[^.]+$/, '');
    return new File([blob], nameRoot + '-' + mediaType + '.webp', { type: 'image/webp' });
  }

  fileInput.addEventListener('change', function () {
    updatePreviewFromFile(fileInput.files && fileInput.files[0] ? fileInput.files[0] : null);
  });

  typeInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      setPreviewMode(getSelectedType());
      updateStatusText(Boolean(fileInput.files && fileInput.files[0]));
    });
  });

  form.addEventListener('submit', async function (event) {
    var file = fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    if (!file) {
      return;
    }

    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Saving media...';
    }

    try {
      var transformedFile = await transformFile(file, getSelectedType());
      if (window.DataTransfer && transformedFile) {
        var transfer = new DataTransfer();
        transfer.items.add(transformedFile);
        fileInput.files = transfer.files;
        updatePreviewFromFile(transformedFile);
      }
    } catch (error) {
      console.error(error);
    }

    HTMLFormElement.prototype.submit.call(form);
  });

  setPreviewMode(getSelectedType());
  updateStatusText(false);
})();