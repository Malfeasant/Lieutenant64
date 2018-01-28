var vic = (function() {

  var cycle = 0;
  var line = 0;

  var border = {
    h: false,
    v: false
  };

  var borderColor = 14;
  var backColor = 6;

  function reset(conf) {
    config = conf;
    // other reset stuff
  }

  // returns a string of 8 characters- 0-f represent color nybbles, empty for
  // blank, or h/v for sync
  function doCycle() {
    cycle++;
    if (cycle > 65) { // TODO: get this from config
      cycle = 0; line++;
      if (line > 263) { // TODO: line increment is not in obvious place
        line = 0;
        return "v";
      }
      return "h";
    }
    var bar = "";
    if (cycle < 13 || cycle > 60) return bar; // TODO: adjust as needed
    if (line < 43 || line > 258) return bar;
    for (var x = cycle * 8; x < cycle * 8 + 8; x++) {
      if (x == 24 /* && CSEL */) border.h = false;
      if (x == 343 /* && CSEL */) border.h = true;
      if (line == 51 /* && RSEL */) border.v = false;
      if (line == 250 /* && RSEL */) border.v = true;
      if (border.h || border.v) {
        bar += borderColor.toString(16);
      } else {
        bar += backColor.toString(16);  // TODO: real stuff
      }
    }
    return bar;
  }

  function poke(addr, data) {
    if ((addr & 0x3f) == 0x21) { // TODO: real stuff
      backColor = data & 0xf;
    } else if ((addr & 0x3f) == 0x20) {
      borderColor = data & 0xf;
    }
  }

  function peek(addr) {
    return 0xff;  // TODO: real stuff
  }

  var exports = { reset: reset, doCycle: doCycle, poke: poke, peek: peek };
  return exports;
})();
