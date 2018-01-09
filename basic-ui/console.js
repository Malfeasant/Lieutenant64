var canvas;

function init() {
  canvas = document.getElementById('canv');
  var context = canvas.getContext('2d');
  canvas.width = "384";
  canvas.height = "216";
  context.fillStyle = "#000000";
  context.fillRect(0,0,canvas.width,canvas.height);
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
}

function resizeCanvas() {
  canvas.style.height = (canvas.clientWidth * .7) + 'px';
}
