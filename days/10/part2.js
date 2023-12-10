let data = require('../../get_data')(10); 

const DEFAULT = `...
...
...`;

const VERTICAL = `.x.
.x.
.x.`;

const HORIZONTAL = `...
xxx
...`;

const UP_RIGHT = `.x.
.xx
...`

const UP_LEFT = `.x.
xx.
...`;

const LEFT_DOWN = `...
xx.
.x.`;

const RIGHT_DOWN = `...
.xx
.x.`;

const originalMap = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        x, y, char
    }
})).flat();

originalMap.forEach(tile => {
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

    tile.neighbors = neighbors.map(n => originalMap.find(e => e.x === tile.x + n.x && e.y === tile.y + n.y)).filter(e => e);
});

const start = originalMap.find(e => e.char === 'S');
const tail = [start];
let current = originalMap.find(e => e.neighbors.find(f => f === start));

while(current != start){
    const previous = tail[tail.length - 1];
    tail.push(current);
    current = current.neighbors.find(e => e != previous);
}

originalMap.forEach(e => {
    e.char = e.char !== '.' && tail.indexOf(e) === -1 ? '.' : e.char;
})


const map = originalMap.map(tile => {
    let blowup;
    switch(tile.char){
        case '|':
        case 'S':
            blowup = VERTICAL;
            break;
        case '-':
            blowup = HORIZONTAL;
            break;
        case 'L':
            blowup = UP_RIGHT;
            break;
        case 'J':
            blowup = UP_LEFT;
            break;
        case '7':
            blowup = LEFT_DOWN;
            break;
        case 'F':
            blowup = RIGHT_DOWN
            break;
        default:
            blowup = DEFAULT;
    }

    return blowup.split('\n').map((bl, by) => bl.split('').map((bc, bx) => {
        return {
            char: bc,
            x: tile.x * 3 + bx,
            y: tile.y * 3 + by
        }
    })).flat();
}).flat().sort((a, b) => {
    if(a.y == b.y){
        return a.x - b.x
    }
    return a.y - b.y
});

//console.log(map)

//console.log(map.reduce((a, b) => b.x === 0 ? `${a}\n${b.char}` : a + b.char , ''))
//console.log(originalMap.reduce((a, b) => b.x === 0 ? `${a}\n${b.char}` : a + b.char , ''))

const queue = [map.find(e => e.x === 0 && e.y === 0)];

while(queue.length){
    const current = queue.shift();
    current.char = '*';
    queue.push(...map.filter(o => Math.abs(o.x - current.x) + Math.abs(o.y - current.y) === 1 && o.char === '.' && queue.indexOf(o) === -1));
}

const result = originalMap.filter(e => e.char === '.' && map.find(f => f.x === e.x * 3 && f.y === e.y * 3).char === '.').length;

//console.log(map.reduce((a, b) => b.x === 0 ? `${a}\n${b.char}` : a + b.char , ''))
console.log(result);
return;
