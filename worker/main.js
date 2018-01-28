var imageData;

onmessage = function(message) {
  if (message.data.cycles) {
    doCycles(message.data.cycles);
  } else if (message.data.reset) {
    imageData = message.data.reset.imageData;
    // any other reset stuff
  }
}

var cycle = 0;
var line = 0;

function doCycles(cycles) {
  while (cycles > 0) {
    // run a cycle on each module...
    cycles--;
  }
  postMessage({ imageData: imageData });
}
