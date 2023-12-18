let data = require('../../get_data')(18);

const VECTORS = {
    'U': {x: 0, y: -1},
    'D': {x: 0, y: 1},
    'L': {x: -1, y: 0},
    'R': {x: 1, y: 0},
};

const borders = data.split('\n').map(e => {
    const [ins, distance, hex] = e.split(' ');

    return {
        ins, distance: Number(distance)
    }
}).reduce((a, b) => {
    const vector = VECTORS[b.ins];
    for(let i = 0; i < b.distance; i++){
        const current = a[a.length - 1] || {x: 0, y: 0};
        a.push({
            x: current.x  + vector.x,
            y: current.y + vector.y,
            isBorder: true,
        });
    }

    return a;
}, []);

const minX = Math.min(...borders.map(e => e.x)) - 1;
const maxX = Math.max(...borders.map(e => e.x)) + 1;
const minY = Math.min(...borders.map(e => e.y)) - 1;
const maxY = Math.max(...borders.map(e => e.y)) + 1;

console.log({minX, maxX, minY, maxY})

const map = [...borders];
let out = ''

for(let y = minY; y <= maxY; y++){
    for(let x = minX; x <= maxX; x++){
        if(map.find(e => e.x === x && e.y === y)){
            out += '#';
            continue;
        }
        out += '.'
        map.push({x, y});
    }
    out += '\n'
}

console.log(out)

map.forEach(e => {
    e.neighbors = map.filter(f => Math.abs(f.x - e.x) + Math.abs(f.y - e.y) === 1);
})

const queue = [map.find(e => e.x === minX && e.y ===minY)]

while(queue.length){
    const current = queue.shift();
    if(current.seen){
        continue;
    }

    current.seen = true;

    queue.push(...current.neighbors.filter(f => !f.isBorder && !f.seen));
}

out = ''

for(let y = minY; y <= maxY; y++){
    for(let x = minX; x <= maxX; x++){
        const tile = map.find(e => e.x === x && e.y === y);
        if(tile.isBorder || !tile.seen){
            out += '#';
            continue;
        }
        out += '.'
    }
    out += '\n'
}

console.log(out)



const result = map.filter(e => e.seen !== true).length

console.log(result, borders.length);