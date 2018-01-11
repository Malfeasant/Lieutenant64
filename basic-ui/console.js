var canvas;
var worker;

function init() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(worker) == "undefined") {
      worker = new Worker("../worker/main.js");
    }
  } else {
    die("Sorry, your browser does not support web workers, which are required.");
  }
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

function openLeftMenu() {
  document.getElementById("leftMenu").style.display = "block";
}

function closeLeftMenu() {
  document.getElementById("leftMenu").style.display = "none";
}

function openRightMenu() {
  document.getElementById("rightMenu").style.display = "block";
}

function closeRightMenu() {
  document.getElementById("rightMenu").style.display = "none";
}

function die(message) {
  if (typeof(message) === 'string') {
    alert(message);
  }
  window.addEventListener('error', function (e) {
    e.preventDefault();
    e.stopPropagation();
  }, false);
  throw '';
}

function speedYawn() {

}

function speedSlow() {

}

function speedNormal() {

}

function speedFast() {

}

function pause() {

}

function step() {

}

function run() {

}
