var control = (function() {
  var imageData;

  var mode;

  function step() {
    if (mode == "Step") {
      // do a step
    } else {
      mode = "Step";
    }
  }

  function play() {
    if (mode !== "Play") {
      // setup for realtime
    }
  }

  function fast() {
    if (mode !== "Fast") {
      // setup for unlimited
    }
  }

  return { step: step, play: play, fast: fast };
})();
