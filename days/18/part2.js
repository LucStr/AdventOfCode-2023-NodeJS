let data = require('../../get_data')(18);

// My implementation based on https://en.wikipedia.org/wiki/Shoelace_formula
const VECTORS = [
  {x: 1, y: 0},
  {x: 0, y: 1},
  {x: -1, y: 0},
  {x: 0, y: -1},
];

const {a, p} = data.split('\n').map(e => {
  const [ins, distance, hex] = e.split(' ');
  return {
      ins: Number(hex.slice(-2, -1)) , distance: parseInt(hex.slice(2, -2), 16)
  }
}).reduce((a, b) => {
  const vector = VECTORS[b.ins];
  const point = {
    x: a.prev.x + vector.x * b.distance,
    y: a.prev.y + vector.y * b.distance
  };

  a.a += (point.y + a.prev.y) * (a.prev.x - point.x);
  a.prev = point;
  a.p += b.distance;
  return a;
}, {a: 0, prev: {x: 0, y: 0}, p: 0});

const result = Math.abs(a / 2) + p / 2 + 1; 
console.log(result);




