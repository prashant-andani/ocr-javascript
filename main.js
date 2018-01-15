(function () {
  'use strict';
  var video = document.querySelector('video'),
    canvas, img;
  document.getElementById('uploadInput').addEventListener('change', readURL);
  document.getElementById('recgBtn').addEventListener('click', takeSnapshot);
  document.getElementById('btnCameraAccess').addEventListener('click', accessCamera);
  recognizeImage('assets/sample_text.png');
  /**
   *  Access to camera
   * 
   */
  function accessCamera() {
    if (navigator.mediaDevices) {
      // access the web cam
      navigator.mediaDevices.getUserMedia({
          video: true
        })
        // permission granted:
        .then(function (stream) {
          video.src = window.URL.createObjectURL(stream);
          document.getElementById('btnCameraAccess').style.display = "none";
          document.getElementById('recgBtn').style.display = "block";

        })
        // permission denied:
        .catch(function (error) {
          console.log(error);
          document.body.textContent = 'Could not access the camera. Error: ' + error.name;
        });
    }
  }

  /**
   * Take a still photo of a video
   */
  function takeSnapshot() {

    // use MediaDevices API
    // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

    video.style.display = "inline";
    let context;
    let width = video.offsetWidth,
      height = video.offsetHeight;

    canvas = canvas || document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, width, height);

    recognizeImage(canvas.toDataURL('image/png'));
  }

  /**
   * Read upload image
   */
  function readURL() {
    if (this.files && this.files[0]) {
      let reader = new FileReader();
      reader.onload = function (e) {
        img = document.querySelector('img') || document.createElement('img');
        img.setAttribute('src', e.target.result);
        img.setAttribute('width', 500);
        recognizeImage(e.target.result);
      }
      reader.readAsDataURL(this.files[0]);
    }
  }
  /**
   * Recognize image src via tesseract
   * @param {image src} image 
   */
  function recognizeImage(image) {
    Tesseract.recognize(image)
      .progress(message => document.getElementById('result').innerHTML = "<h3>Recognizing..</h3>")
      .then(function (result) {
        document.getElementById('result').innerHTML = result.html;
        document.getElementById('confidence').innerHTML = `Recognition confidence: ${result.confidence}`;
      })
      .catch(err => console.error(err))
  }
})();
