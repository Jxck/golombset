function Golombset(bufsize, fixedBits) {
  this.buf = new Uint8Array(bufsize);
  this.fixedBits = fixedBits;
  this.current = 0;
  this.shift = 8;
}


Golombset.prototype.encodeBit = function(bit) {
  if (this.shift === 0) {
    this.current += 1;
    this.buf[this.current] = 0xff;
    this.shift = 8;
  }

  this.shift -= 1;

  if (!bit) {
    this.buf[this.current] &= ~(1 << this.shift);
  }
}

Golombset.prototype.encodeValue = function(value) {
  // emit the unary bits
  var unary = value >> this.fixedBits;
  for (; unary > 0; unary--) {
    this.encodeBit(1);
  }
  this.encodeBit(0);

  // emit the rest
  var shift = this.fixedBits;
  do {
    this.encodeBit((value >> --shift) & 1);
  } while (shift > 0);
}


Golombset.prototype.encode = function(keys) {
  var next_min = 0;
  this.buf[0] = 0xff;
  for (var i = 0; i < keys.length; i++) {
    this.encodeValue(keys[i] - next_min);
    next_min = keys[i];
  }

  if (this.shift === 8) {
    this.current -= 1;
  }

 
}


function main() {
  var golombset = new Golombset(25, 6);

  var keys = [
    151, 192,  208,  269,  461,  512,  526,  591,  662,  806,  831,  866,  890,
    997, 1005, 1017, 1134, 1207, 1231, 1327, 1378, 1393, 1418, 1525, 1627, 1630
  ];

  golombset.encode(keys);

  console.log(golombset.buf);

  console.log([
      '11001011', '10101001', '00100000', '11110111',
      '10000000', '01100110', '00111010', '00000110',
      '00011111', '00100000', '01100101', '00011001',
      '10001010', '10110001', '00000011', '00101101',
      '01100010', '01001100', '01010000', '00110011',
      '00011110', '01100110', '10101110', '10011000',
      '00011000',
  ].map(function(s) {
    return parseInt(s, 2);
  }));
}

main();
