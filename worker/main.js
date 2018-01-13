var imageData;

// Receive a message from the UI
onmessage = function(message) {
  if (message.data.runFor && imageData) {  // todo: could be frame, line, cycle...
    for (var y=0; y<216; y++) {
      if (y<8 || y>208) {
        for (var x=0; x<384; x++) {
          imageData.data[y * 384 * 4 + x * 4] = 0x7f;
          imageData.data[y * 384 * 4 + x * 4 + 1] = 0xff;
          imageData.data[y * 384 * 4 + x * 4 + 2] = 0x7f;
          imageData.data[y * 384 * 4 + x * 4 + 3] = 0xff;
        }
      } else {
        for (var x=0; x<384; x++) {
          if (x<32 || x>352) {
            imageData.data[y * 384 * 4 + x * 4] = 0x7f;
            imageData.data[y * 384 * 4 + x * 4 + 1] = 0xff;
            imageData.data[y * 384 * 4 + x * 4 + 2] = 0x7f;
            imageData.data[y * 384 * 4 + x * 4 + 3] = 0xff;
          } else {
            imageData.data[y * 384 * 4 + x * 4] = x;
            imageData.data[y * 384 * 4 + x * 4 + 1] = 0xc0;
            imageData.data[y * 384 * 4 + x * 4 + 2] = y;
            imageData.data[y * 384 * 4 + x * 4 + 3] = 0xff;
          }
        }
      }
    }
    postMessage({ imageData: imageData });
  } else if (message.data.imageData && !imageData) {
    imageData = message.data.imageData;
  } else {
    console.log("Worker process received unknown message: " + message.data);
  }
};
