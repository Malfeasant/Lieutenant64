var canvas;
var worker;

function init() {
  if (typeof(Worker) !== "undefined") {
    if (typeof(worker) == "undefined") {
      worker = new Worker("../worker/main.js");
      worker.onmessage = fromWorker;
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

// Process a message from the worker process- for simplicity, only strings
// Video output will be strings of value 0-f representing a pixel color,
// \n for hsync, \f for vsync
function fromWorker(event) {
  for (var i=0; i < event.data.length; i++) {
    var ch = event.data.charAt(i);
    // do something with it...
  }
}

function speedYawn() {
  worker.postMessage("Yawn...\n");
}

function speedSlow() {
  worker.postMessage("Slow...\n");
}

function speedNormal() {
  worker.postMessage("Normal...\n");
}

function speedFast() {
  worker.postMessage("Fast...\n");
}

function pause() {
  worker.postMessage("Pause...\n");
}

function step() {
  worker.postMessage("Step...\n");
}

function run() {
  worker.postMessage("Run...\n");
}
