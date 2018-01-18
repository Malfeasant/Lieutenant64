var canvas;
var context;
var worker;
var imageData;
var speed = "Normal"; // TODO: accept a parameter to allow starting at different speeds
var paused = false;
var lastFrameTime;
var cycleMillis = 11/11250; // TODO: this will be different for PAL
var cyclesPerLine = 65;
var linesPerFrame = 263;
// TODO: a config object that encompasses all these options

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
  /*
  // Test pattern is no longer needed, but will keep it here in case something breaks
  context.fillStyle = "#3f7fff";
  context.fillRect(0,0,canvas.width,canvas.height);
  context.fillStyle = "#0000ff";
  context.fillRect(4*8,1*8,40*8,25*8);
  */
  // Give the worker a buffer to fill
  worker.postMessage({ imageData: context.createImageData(canvas.width,canvas.height) });
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  requestAnimationFrame(showFrame);
}

// Intended to be called by requestAnimationFrame- renders data passed from worker,
// decides how much more work needs to be done.
function showFrame(now) {
  if (imageData) {
    context.putImageData(imageData, 0, 0);
    imageData=null; // so if no new frames come in, we don't waste time rendering the old one
  }
  if (!paused) {
    if (speed == "Normal") {
      worker.postMessage({ runFor: Math.floor((now - lastFrameTime) / cycleMillis) });
    } else doWork();
  }
  lastFrameTime = now;
  requestAnimationFrame(showFrame);
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
  if (!paused && speed == "Fast") worker.postMessage({ runTo: "Frame" });
}

function speedSlow() {
  speed = "Slow";
}

function speedNormal() {
  speed = "Normal";
}

function speedFast() {
  speed = "Fast";
  run();
}

function step() {
  if (paused) {
    doWork();
  } else {
    paused = true;
  }
}

function doWork() {
  switch (speed) {
    case "Slow":
      worker.postMessage({ runFor: 1 });
      break;
    case "Normal":
      worker.postMessage({ runTo: "Line"});
      break;
    case "Fast":
      worker.postMessage({ runTo: "Frame"});
      break;
    default:
      die("Unexpected speed: " + speed);
  }
}

function run() {
  paused = false;
}
