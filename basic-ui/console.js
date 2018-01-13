var canvas;
var context;
var worker;
var lastRequested;
var framesRequested=0;
var imageData;

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
  canvas.width = "384";
  canvas.height = "216";
  context = canvas.getContext('2d');
  context.fillStyle = "#3f7fff";
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "#0000ff";
  context.fillRect(4*8,1*8,40*8,25*8);
  worker.postMessage({ imageData: context.createImageData(canvas.width,canvas.height) });
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  requestAnimationFrame(request);
}

function request(now) {
  if (imageData) {
    context.putImageData(imageData, 0, 0);
  }
  worker.postMessage({ runFor: "frame" });
  framesRequested++;
  if (framesRequested >= 60) {
    if (lastRequested) {
      console.log("Sent " + framesRequested + " frames in " + (now - lastRequested) + " milliseconds.");
    }
    framesRequested=0;
    lastRequested = now;
  }
  requestAnimationFrame(request);
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

// Process a message from the worker process-
// Video output will be an ImageData object
function fromWorker(message) {
  if (message.data.imageData) {
    imageData = message.data.imageData;
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
