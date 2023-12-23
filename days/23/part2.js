let data = require('../../get_data')(23);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        x,y,char: char === '#' ? '#' : '.'
    }
})).flat().filter(e => e.char !== '#');

const UP = {x: 0, y: -1};
const DOWN = {x: 0, y: 1};
const LEFT = {x: -1, y: 0};
const RIGHT = {x: 1, y: 0};

const DIRECTIONS = {
    '.': [UP, DOWN, LEFT, RIGHT],
    '>': [RIGHT],
    'v': [DOWN],
    '^': [UP],
    '<': [LEFT]
};

map.forEach(tile => {
    tile.directions = DIRECTIONS[tile.char]
        .map(d => map
            .find(e => e.x === tile.x + d.x && e.y === tile.y + d.y))
        .filter(e => e);
});

const corners = map.filter(e => e.char === '.' && e.directions.length !== 2);

for(let corner of corners){
    corner.neighbors = [];
    directionLoop: for(let i = 0; i < corner.directions.length; i++){
        const direction = corner.directions[i];
        let prev = corner;
        let next = direction;
        let count = 1;

        while(next.char !== '.' || next.directions.length === 2){
            const target = next.directions.find(e => e !== prev);
            if(target === undefined){
                continue directionLoop;
            }
            prev = next;
            next = target;
            count++;
        }

        corner.neighbors.push({
            weight: 0 - count,
            target: next,
        });
    }
}


const destination = corners[corners.length - 1];
let queue = [{current: corners[0], tail: [], size: 0}];
let max = 0;

while(queue.length){
    const {current, tail, size} = queue.shift();

    if(current === destination){
        max = Math.max(max, 0 - size);
        continue;
    }

    queue.push(...current.neighbors.filter(e => !tail.includes(e.target)).map(n => {
        return {
            current: n.target,
            tail: [...tail, n.target],
            size: size + n.weight
        }
    }));

    queue = queue.sort((a, b) => a.size - b.size)
}

const result = max;

console.log(result);
