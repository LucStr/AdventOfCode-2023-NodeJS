let data = require('../../get_data')(21);

const STEPS = 64;

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        char, x, y, neighbors: [], offsets: []
    }
})).flat().filter(e => e.char !== '#');

const start = map.find(e => e.char === 'S');
start.char = '.';

map.forEach(tile => {
    if(tile.char !== '.'){
        return;
    }
    tile.neighbors = map.filter(e => e.char === '.' && Math.abs(e.x - tile.x) + Math.abs(e.y - tile.y) === 1);
});

const queue = [{tile: start, offset: 0}];

while(queue.length) {
    const {tile, offset} = queue.shift();
    const newOffset = offset + 1;
    for(let neighbor of tile.neighbors){
        if(neighbor.offsets.find(e => e % 2 === newOffset % 2)){
            continue;
        }

        neighbor.offsets.push(newOffset);
        queue.push({tile: neighbor, offset: newOffset});    
    }
}

const remainder = STEPS % 2;
const result = map.filter(e => e.offsets.filter(t => t <= STEPS && t % 2 === remainder).length > 0).length
console.log(result);