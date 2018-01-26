var Lieutenant64 = window.Lieutenant64 || {};
Lieutenant64.Console = (function() {

var canvas;
var context;
var worker;
var imageData;
/* Accepted values: Paused(wait for click, run to next stepSize),
                    Slow(run stepSize steps n times per sec),
                    Realtime(track cycles per sec & adjust),
                    Frenzy(run continuously without limit) */
var runMode = "Realtime"; // TODO: accept a parameter to allow starting at different speeds
/* Cycle, Line, Frame- obvious for pause/slow, but also affects granularity of
   Realtime & Frenzy */
var stepSize = "Line";
var cycles = 0;
var time;
var adjust = 0;
var cycleTime = {
  millis: 11,
  cycles: 11250
}; // TODO: this will be different for PAL
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
  if (runMode !== "Paused") doWork();
}

// Intended to be called by requestAnimationFrame- renders data passed from worker,
// decides how much more work needs to be done.
function showFrame(now) {
  if (imageData) {
    context.putImageData(imageData, 0, 0);
    imageData=null; // to signal that the frame has been rendered
  }
  if (runMode == "Realtime") {
    if (time) {
      var elapsed = now - time;
      while (cycles > cycleTime.cycles) {
        cycles -= cycleTime.cycles;
        elapsed -= cycleTime.millis;
        adjust = elapsed;
      }
    }
    time = now;
  }
}

function resizeCanvas() {
  canvas.style.height = (canvas.clientWidth * .75) + 'px';
}

// Process a message from the worker process-
// Video output will be an ImageData object
function fromWorker(message) {
  if (message.data.imageData) {
    /* possible to receive multiple imageData objects per AnimationFrame-
       have to check for it, otherwise requests will stack up */
    var newImage = imageData ? false : true;
    imageData = message.data.imageData;
    if (newImage) requestAnimationFrame(showFrame); // if not, frame has already been requested
    if (runMode == "Frenzy") doWork();  // run another stepSize immediately
    if (runMode == "Realtime") {
      
    }
    cycles += message.data.cycles;
  }
}

function setStep(s) {
  stepSize = s;
}

function setMode(m) {
  runMode = m;
}

function step() {
  if (runMode == "Paused") {
    doWork();
  } else {
    runMode = "Paused";
  }
}

function doWork() {
  switch (stepSize) {
    case "Cycle":
    case "Line":
    case "Frame":
      worker.postMessage({ runTo: runMode});
      break;
    default:
      die("Unexpected speed: " + speed);
  }
}

  return { init: init, step: step, setMode: setMode, setStep: setStep };
})();

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
