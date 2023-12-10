let data = require('../../get_data')(10);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        x, y, char
    }
})).flat();

map.forEach(tile => {
    let neighbors = [];
    switch(tile.char){
        case '|':
            neighbors = [{x: 0, y: -1}, {x: 0, y: 1}];
            break;
        case '-':
            neighbors = [{x: -1, y: 0}, {x: 1, y: 0}];
            break;
        case 'L':
            neighbors = [{x: 0, y: -1}, {x: 1, y: 0}];
            break;
        case 'J':
            neighbors = [{x: 0, y: -1}, {x: -1, y: 0}];
            break;
        case '7':
            neighbors = [{x: 0, y: 1}, {x: -1, y: 0}];
            break;
        case 'F':
            neighbors = [{x: 0, y: 1}, {x: 1, y: 0}];
            break;
    }

    tile.neighbors = neighbors.map(n => map.find(e => e.x === tile.x + n.x && e.y === tile.y + n.y)).filter(e => e);
});

const start = map.find(e => e.char === 'S');
const tail = [start];
let current = map.find(e => e.neighbors.find(f => f === start));

while(current != start){
    const previous = tail[tail.length - 1];
    tail.push(current);
    current = current.neighbors.find(e => e != previous);
}

const result = tail.length / 2;

console.log(result);