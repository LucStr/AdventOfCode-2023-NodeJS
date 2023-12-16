let data = require('../../get_data')(16);

data = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`

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

const queue = [{tile: map[0], direction: 'right'}];

while(queue.length){
    const current = queue.shift();
    current.visited = true;
    current.tile.visited = true;

    queue.push(...current.tile.neighbors[current.direction].filter(e => !e.visited))
}

const result = map.filter(e => e.visited).length

console.log(result);