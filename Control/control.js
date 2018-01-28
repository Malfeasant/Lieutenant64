var control = (function() {
  var imageData;
  var worker;
  if (typeof(Worker) !== "undefined") {
    worker = new Worker("worker/main.js")
  } else {
    fatalError("Web Workers are required.")
  }

  var mode;

  function step() {
    if (mode !== "Step") {
      mode = "Step";
    } else {
      // do a step
    }
  }

  function play() {
    if (mode !== "Play") {
      // setup for realtime
      mode = "Play";
    }
  }

  function fast() {
    if (mode !== "Fast") {
      // setup for unlimited
      mode = "Fast";
    }
  }

  var perf = {
    cycles: 0,
    millis: 0,
    lastFrame: null
  };

  function doFrame(timeNow) {
    if (perf.lastFrame) {
      perf.millis += timeNow - perf.lastFrame;
    }
    perf.lastFrame = timeNow;
    if (imageData && exports.showImage) exports.showImage(imageData);
    requestAnimationFrame(doFrame);
  }
  requestAnimationFrame(doFrame);

  var exports = { step: step, play: play, fast: fast };
  return exports;
})();
