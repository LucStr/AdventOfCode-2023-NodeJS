let data = require('../../get_data')(16);

const VECTORS = {
    'right': {x: 1, y: 0},
    'left': {x: -1, y: 0},
    'up': {x: 0, y: -1},
    'down': {x: 0, y: 1},
}

const CONFIGURATION = {
    '.': {
        'right': ['right'],
        'left': ['left'],
        'up': ['up'],
        'down': ['down']
    },
    '/': {
        'right': ['up'],
        'left': ['down'],
        'up': ['right'],
        'down': ['left']
    },
    '\\': {
        'right': ['down'],
        'left': ['up'],
        'up': ['left'],
        'down': ['right']
    },
    '|': {
        'right': ['up', 'down'],
        'left': ['up', 'down'],
        'up': ['up'],
        'down': ['down']
    },
    '-': {
        'right': ['right'],
        'left': ['left'],
        'up': ['right', 'left'],
        'down': ['right', 'left']
    }
}


const map = data.split('\n').map((line, y) => line.split('').map((char, x) =>{
    return {
        char, x, y
    };
})).flat();

map.forEach(tile => {
    const config = CONFIGURATION[tile.char];
    tile.neighbors = {};
    for(let direction in config){
        tile.neighbors[direction] = config[direction].map(e => {
            const vector = VECTORS[e];

            return {
                tile: map.find(t => t.x === tile.x + vector.x && t.y === tile.y + vector.y),
                direction: e,
                visited: false,
            }
        }).filter(e => e.tile);
    }
});

const minY = Math.min(...map.map(e => e.y));
const maxY = Math.max(...map.map(e => e.y));
const minX = Math.min(...map.map(e => e.x));
const maxX = Math.max(...map.map(e => e.x));

const starts = [
    ...map.filter(e => e.y === minY).map(e => {
        return {
            tile: e, direction: 'down'
        }
    }),
    ...map.filter(e => e.y === maxY).map(e => {
        return {
            tile: e, direction: 'up'
        }
    }),
    ...map.filter(e => e.x === minX).map(e => {
        return {
            tile: e, direction: 'right'
        }
    }),
    ...map.filter(e => e.x === maxX).map(e => {
        return {
            tile: e, direction: 'left'
        }
    }),
]

const reset = () => {
    for(let tile of map){
        tile.visited = false;
        for(let vector in tile.neighbors){
            for(let connection of tile.neighbors[vector]){
                connection.visited = false;
            }
        }
    }
}

let counter = 0;

const run = (start) => {
    console.log(`${++counter}/${starts.length}`)
    reset();
    const queue = [start];

    while(queue.length){
        const current = queue.shift();
        current.visited = true;
        current.tile.visited = true;
    
        queue.push(...current.tile.neighbors[current.direction].filter(e => !e.visited))
    }
    
    return map.filter(e => e.visited).length
}

const result = Math.max(...starts.map(run));

console.log(result);