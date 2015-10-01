function Golombset(bufsize, fixedBits) {
  this.buf = new Uint8Array(bufsize);
  this.fixedBits = fixedBits;
  this.current = 0;
  this.shift = 8;
}


Golombset.prototype.encodeBit = function(bit) {
  // fill 1 in next octet
  if (this.shift === 0) {
    this.current += 1;
    this.buf[this.current] = 0xff;
    this.shift = 8;
  }

  this.shift -= 1;

  if (!bit) {
    // reverse target bit to 0
    this.buf[this.current] &= ~(1 << this.shift);
  }
}

Golombset.prototype.encodeValue = function(value) {
  // emit the unary bits
  var unary = value >> this.fixedBits; // value / p
  for (; unary > 0; unary--) { // N Unary
    this.encodeBit(1);         // 0 0
  }                            // 1 10
  this.encodeBit(0);           // 2 110

  // emit the rest
  // N = 151
  // 1001,0111
  // 0001,0111
  var shift = this.fixedBits;
  do {
    // emit each bit from top
    this.encodeBit((value >> --shift) & 1);
  } while (shift > 0);
}

Golombset.prototype.encode = function(keys) {
  var next_min = 0;
  this.buf[0] = 0xff;

  // encode each value
  for (var i = 0; i < keys.length; i++) {
    this.encodeValue(keys[i] - next_min);
    next_min = keys[i] + 1;
  }

  // after encode, shift = 8 means empty octet
  if (this.shift === 8) {
    this.current -= 1;
  }
}


function test() {
  var bufsize = 25;
  var fixedBits = 6;
  var golombset = new Golombset(25, 6);

  var keys = [
    151, 192,  208,  269,  461,  512,  526,  591,  662,  806,  831,  866,  890,
    997, 1005, 1017, 1134, 1207, 1231, 1327, 1378, 1393, 1418, 1525, 1627, 1630
  ];

  golombset.encode(keys);

  // console.log(golombset.buf);

  var expected = [
    203, 168, 30,  243, 126, 200, 108, 4, 54, 60, 194, 34, 245, 65, 197, 218, 68,
    23,  159, 100, 56,  197, 85,  40,  47,
  ];

  console.assert(golombset.buf.length === expected.length);
  for (var i = 0; i < expected.length; i ++) {
    console.assert(golombset.buf[i] === expected[i]);
  }
}

test();
