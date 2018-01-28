var control = (function() {
  var imageData;
  var worker;
  if (typeof(Worker) !== "undefined") {
    worker = new Worker("worker/main.js")
    worker.onmessage = receive;
  } else {
    fatalError("Web Workers are required.")
  }

  var mode = "Step";

  function step() {
    if (mode !== "Step") {
      mode = "Step";
    } else {
      timing.cycles++;
      worker.postMessage({ cycles: 1 });
    }
  }

  function play() {
    if (mode !== "Play") {
      timing.remainder = 0;
      mode = "Play";
    }
  }

  function fast() {
    if (mode !== "Fast") {
      // setup for unlimited
      mode = "Fast";
    }
  }

  var timing = {
    cycles: 0,
    elapsed: 0, // tracks total time since last reset
    remainder: 0, // keeps track of leftover time since last burst of cycles
    lastFrame: null
  }

  function doFrame(timeNow) {
    if (timing.lastFrame) {
      var timeStep = timeNow - timing.lastFrame;
      timing.elapsed += timeStep;
      if (mode == "Play") timing.remainder += timeStep;
    }
    timing.lastFrame = timeNow;
    if (imageData && exports.showImage) exports.showImage(imageData);
    doWork();
    requestAnimationFrame(doFrame);
    if (timing.elapsed > 5000) {
      console.log("Ran " + timing.cycles + " cycles in " + timing.elapsed + " milliseconds.");
      console.log("  that's " + 1000 * timing.cycles / timing.elapsed + " cycles per second.")
      timing.cycles = 0;
      timing.elapsed = 0;
    }
  }
  requestAnimationFrame(doFrame);

  function doWork() {
    var cycles = 0;
    if (mode == "Play") {
      while (timing.remainder > 0) {
        cycles += exports.throttle.cycles;
        timing.remainder -= exports.throttle.millis;
      }
    } else if (mode == "Fast") {
      cycles = exports.throttle.cycles;
    }
    timing.cycles += cycles;
    worker.postMessage({ cycles: cycles });
  }

  function receive(message) {
    if (message.data.imageData) {
      imageData = message.data.imageData;
    }
    if (mode == "Fast") doWork(); // request more
  }

  function reset(imageData) {
    worker.postMessage({ reset: { imageData: imageData }});
    // any other reset stuff...
  }

  var exports = { step: step, play: play, fast: fast, reset: reset };
  return exports;
})();
