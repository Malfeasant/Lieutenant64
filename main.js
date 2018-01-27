var pageBits = {};

function init() {
  pageBits.canvas = document.getElementById("screen");
  pageBits.canvas.width = 384;
  pageBits.canvas.height = 216;
  pageBits.context = pageBits.canvas.getContext("2d");

  function resizeCanvas() {
    pageBits.canvas.style.height = (pageBits.canvas.clientWidth * .75) + 'px';
  }
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();

  // test pattern (just to make the canvas show up)
  pageBits.context.fillStyle = "#3f7fff";
  pageBits.context.fillRect(0,0,pageBits.canvas.width, pageBits.canvas.height);
  pageBits.context.fillStyle = "#0000ff";
  pageBits.context.fillRect(4*8,1*8,40*8,25*8);
}

function step() {

}

function play() {

}

function ffwd() {

}
