importScripts("vic/vic.js", "palette.js");  // TODO: fill this out

/* This is the top level of the web worker- not much specific behavior
   should be here, mainly just interacting with the browser thread. */

var imageData;

onmessage = function(message) {
  if (message.data.cycles) {
    doCycles(message.data.cycles);
  } else if (message.data.reset) {
    imageData = message.data.reset.imageData;
    vic.reset();
    // any other reset stuff
  }
}

var videoOut = {
  cycle: 0,
  line: 0,
  calls: 0  // TODO: remove this, for debugging
}

function doCycles(cycles) {
  vic.poke(0x20, videoOut.calls);
  while (cycles > 0) {
    // run a cycle on each module...
    vic.poke(0x21, cycles);
    var bar = vic.doCycle();
    if (bar == "") {
      // anything?
    } else if (bar == "h") {
      videoOut.cycle = 0;
      videoOut.line++;
    } else if (bar == "v") {
      videoOut.cycle = 0;
      videoOut.line = 0;
    } else {
      var offset = videoOut.line * 4 * imageData.width + videoOut.cycle * 8 * 4;
      for (var i = 0; i < 8; i++) {
        var ch = parseInt(bar.charAt(i), 16);
        imageData.data[offset + i * 4 + 0] = palette[ch].red;
        imageData.data[offset + i * 4 + 1] = palette[ch].green;
        imageData.data[offset + i * 4 + 2] = palette[ch].blue;
        imageData.data[offset + i * 4 + 3] = 0xff;  // alpha
      }
      videoOut.cycle++
    }
    cycles--;
    videoOut.calls++;
  }
  postMessage({ imageData: imageData });
}
