onmessage = function(message) {
  if (message.data.cycles) {
    doCycles(message.data.cycles);
  }
}

function doCycles(cycles) {
  for (var i = 0; i < cycles; i++) {

  }
  postMessage({ imageData: null });
}
