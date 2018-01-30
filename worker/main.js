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
  x: 0,
  y: 0,
  calls: 0  // TODO: remove this, for debugging
}

function doCycles(cycles) {
  vic.poke(0x20, videoOut.calls);
  while (cycles > 0) {
    // run a cycle on each module...
    vic.poke(0x21, cycles);
    var bar = vic.doCycle();
    if (bar.includes("v")) {
      videoOut.y = 0;
    } else if (bar.includes("h")) {
      if (videoOut.x) { // so as not to increment repeatedly for single sync
        videoOut.y++;
      }
      videoOut.x = 0;
    } else {
      var offset = videoOut.y * 4 * imageData.width;
//      console.log(bar);
      for (var ch of bar) {
        if (ch == " ") break;
        ch = parseInt(ch, 16);
        imageData.data[offset + videoOut.x * 4 + 0] = palette[ch].red;
        imageData.data[offset + videoOut.x * 4 + 1] = palette[ch].green;
        imageData.data[offset + videoOut.x * 4 + 2] = palette[ch].blue;
        imageData.data[offset + videoOut.x * 4 + 3] = 0xff;  // alpha
        videoOut.x++;
      }
    }
    cycles--;
  }
  videoOut.calls++;
  postMessage({ imageData: imageData });
}
