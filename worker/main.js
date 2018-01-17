var imageData;
var cycle = 0;
var line = 0;
var call = 0;

var palette = [ // Thanks to http://www.pepto.de/projects/colorvic/
  { red: 0x00, green: 0x00, blue: 0x00 },
  { red: 0xff, green: 0xff, blue: 0xff },
  { red: 0x81, green: 0x33, blue: 0x38 },
  { red: 0x75, green: 0xce, blue: 0xc8 },
  { red: 0x8e, green: 0x3c, blue: 0x97 },
  { red: 0x56, green: 0xac, blue: 0x4d },
  { red: 0x2e, green: 0x2c, blue: 0x9b },
  { red: 0xed, green: 0xf1, blue: 0x71 },
  { red: 0x8e, green: 0x50, blue: 0x29 },
  { red: 0x55, green: 0x38, blue: 0x00 },
  { red: 0xc4, green: 0x6c, blue: 0x71 },
  { red: 0x4a, green: 0x4a, blue: 0x4a },
  { red: 0x7b, green: 0x7b, blue: 0x7b },
  { red: 0xa9, green: 0xff, blue: 0x9f },
  { red: 0x70, green: 0x6d, blue: 0xeb },
  { red: 0xb2, green: 0xb2, blue: 0xb2 }
]; // TODO: make this configurable

// Receive a message from the UI
onmessage = function(message) {
  var cycles = 0;
  if (message.data.runFor) {
    for (var cycle = 0; cycle < message.data.runFor; cycle++) {
      doCycle();
      cycles++;
    }
    done();
  } else if (message.data.runTo) {
    do {
      cycles++;
    } while (!doCycle(message.data.runTo));
    done();
  } else if (message.data.imageData && !imageData) {
    imageData = message.data.imageData;
  } else {
    console.log("Worker process received unknown message: %o", message.data);
  }
  call++;
  if (call > 0xf) call = 0;
  return { cycles: cycles };  // TODO: track frames too?
};

// pass "Line" or "Frame", then will return true if this is the last cycle of one.
function doCycle(matchWhat) {
  if (!imageData) return; // TODO: should still be able to simulate everything but video
  var match = false;
  for (var x = cycle * 8; x < cycle * 8 + 8; x++) {
    if (line < 8 || line >= 26 * 8 || x < 32 || x >= 44 * 8) {
      imageData.data[line * 384 * 4 + x * 4] = palette[0xe].red;
      imageData.data[line * 384 * 4 + x * 4 + 1] = palette[0xe].green;
      imageData.data[line * 384 * 4 + x * 4 + 2] = palette[0xe].blue;
      imageData.data[line * 384 * 4 + x * 4 + 3] = 0xff;
    } else {
      imageData.data[line * 384 * 4 + x * 4] = palette[call].red;
      imageData.data[line * 384 * 4 + x * 4 + 1] = palette[call].green;
      imageData.data[line * 384 * 4 + x * 4 + 2] = palette[call].blue;
      imageData.data[line * 384 * 4 + x * 4 + 3] = 0xff;
    }
  }
  cycle++;
  if (cycle >= 48) {
    match |= matchWhat == "Line";
    cycle=0;
    line++;
    if (line >= 216) {
      match |= matchWhat == "Frame";
      line = 0;
    }
  }
//  console.log("x: %d, y: %d, %o, %o", x, y, matchWhat, match);
  return match;
}

function done() {
  if (imageData) {
    postMessage({ imageData: imageData });
  }
}
