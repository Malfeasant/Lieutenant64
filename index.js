function init() {
  var canvas = document.getElementById("screen");
  canvas.width = 384;
  canvas.height = 216;

  function resizeCanvas() {
    canvas.style.height = (canvas.clientWidth * .75) + 'px';
  }
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  var context = canvas.getContext("2d");

  // test pattern (just to make the canvas show up)
  context.fillStyle = "#706deb";
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "#2e2c9b";
  context.fillRect(4*8,1*8,40*8,25*8);

  control.showImage = function (imageData) {
    context.putImageData(imageData, -16, -16);  // TODO: adjust
  }
  control.throttle = { cycles: 11250, millis: 11 }; // TODO: PAL option
}

function fatalError(message) {
  if (typeof(message) === 'string') {
    alert(message);
  }
  window.addEventListener('error', function(e) {
    e.preventDefault();
    e.stopPropagation();
  }, false);
  // Anything else to ensure execution stops?
  throw '';
}
