var control = (function() {
  var imageData;

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
  function doCycle() {
    perf.cycles++;
  }

  function doFrame(timeNow) {
    if (perf.lastFrame) {
      millis += timeNow - perf.lastFrame;
    }
    perf.lastFrame = timeNow;
    if (imageData && exports.showImage) exports.showImage(imageData);
    requestAnimationFrame(doFrame);
  }
  requestAnimationFrame(doFrame);

  var exports = { step: step, play: play, fast: fast };
  return exports;
})();
