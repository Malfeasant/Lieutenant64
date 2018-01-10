var canvas;

function init() {
  canvas = document.getElementById('canv');
  var context = canvas.getContext('2d');
  canvas.width = "384";
  canvas.height = "216";
  context.fillStyle = "#3f7fff";
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "#0000ff";
  context.fillRect(4*8,1*8,40*8,25*8);
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
}

function resizeCanvas() {
  canvas.style.height = (canvas.clientWidth * .75) + 'px';
}
