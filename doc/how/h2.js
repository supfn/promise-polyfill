function loadImg() {
  return new Promise((resolve, reject) => {
    let URL = "http://cdn103.img.lizhi.fm/audio_cover/2016/12/17/2574145067906931719_320x320.jpg";
    let img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = URL;
  });
}
