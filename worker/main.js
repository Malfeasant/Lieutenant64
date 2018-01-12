// Receive a message from the UI
onmessage = function(e) {
  switch (typeof(e.data)) {
    case "string":
    // testing to be sure it works- it does
    console.log(e.data);
  }
}
