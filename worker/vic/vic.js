var vic = (function() {

  var border = {
    h: false,
    v: false,
    ybottom: 251, // 247
    ytop: 51  // 55
  };

  var den = true;

  var raster = {
    cycle: 0,
    line: 0
  };

  var sync = {
    h: false,
    v: false
  };

  var blank = {
    h: false,
    v: false
  }

  var borderColor = 14;
  var backColor = 6;

  function reset(conf) {
    config = conf;
    // other reset stuff
  }

  // returns a string of 8 characters- 0-f represent color nybbles, empty for
  // blank, or h/v for sync
  function doCycle() {
    raster.cycle++;
    var bar = "";
    for (var x = raster.cycle * 8; x < raster.cycle * 8 + 8; x++) {
      switch (x) {
        case 416:
          sync.h = true;
          break;
        case 452:
          sync.h = false;
          break;
        case 396:
          blank.h = true;
          break;
        case 496:
          blank.h = false;
          break;
        case 35:
          // if !csel
          //border.h = false;
          //if (raster.line == ybottom) border.v = true;
          break;
        case 339:
          // if !csel
          //border.h = true;
          break;
        case 28:
          // if csel
          border.h = false;
          if (raster.line == border.ybottom) border.v = true;
          if (raster.line == border.ytop && den) border.v = false;
          break;
        case 348:
          // if csel
          border.h = true;
          break;
        case 412: // actually anywhere between 404 and 412
          raster.line++;
          break;
        case 12:
          // enable character fetch
          break;
        case 332:
          // disable character fetch
          // disable ba for char fetch
          break;
        case 496:
          // ba for char fetch
          break;
        case 336:
          // ba for sprite 0
          break;
        case 376:
          // end ba for sprite 0
          break;
        case 519:
          raster.cycle = 0;
          switch (raster.line) {
            case border.ybottom:
              border.v = true;
              break;
            case border.ytop:
              border.v = !den;
              break;
            case 262:
              raster.line = 0;
              break;
            case 17:
              sync.v = true;
              break;
            case 20:
              sync.v = false;
              break;
            default:

          }
          break;
        default:
          // nothing
      }
      if (sync.v) {
        bar += "v";
      } else if (sync.h) {
        bar += "h";
      } else if (blank.h || blank.v) {
        bar += " ";
      } else if (border.h || border.v) {
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
