let data = require('../../get_data')(14);

const DIRECTIONS = [
    'north', 'west', 'south', 'east'
]

const SORTS = {
    'north': (a, b) => a.tile.y - b.tile.y,
    'west': (a, b) => a.tile.x - b.tile.x,
    'south': (a, b) => b.tile.y - a.tile.y,
    'east': (a, b) => b.tile.x - a.tile.x,
}

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        x, y, char, occupied: char === '#'
    }
})).flat();

const stones = [];
let maxY = 0;
map.forEach(tile => {
    maxY = Math.max(maxY, tile.y)
    if(tile.char === 'O'){
        tile.char = '.';
        const stone = {
            tile: tile
        };

        stones.push(stone);
        tile.occupied = true;
    }

    tile.north = map.find(e => e.x === tile.x && e.y === tile.y - 1);
    tile.west = map.find(e => e.x === tile.x - 1 && e.y === tile.y);
    tile.south = map.find(e => e.x === tile.x && e.y === tile.y + 1);
    tile.east = map.find(e => e.x === tile.x + 1 && e.y === tile.y);
});


const moveStone = (stone, direction) =>{
    let tile = stone.tile;
    while(tile[direction] && !tile[direction].occupied){
        tile = tile[direction]
    }
    stone.tile.occupied = false;
    tile.occupied = true
    stone.tile = tile;
}

const printMap = () => {
    console.log(map.reduce((a, b) => {
        if(b.x === 0){
            a += '\n';
        }
        if(b.char === '#'){
            a += '#'
        } else if(b.occupied) {
            a += 'O'
        } else {
            a += '.'
        }
    
        return a;
    }, ''))
}

const score = () => {
    return stones.map(e => maxY - e.tile.y + 1).reduce((a, b) => a + b);
}

const cycle = (times) => {
    for(let i = 0; i < times; i++){
        for(let direction of DIRECTIONS){
            for(let stone of stones.sort(SORTS[direction])){
                moveStone(stone, direction);
            }
        }
    }
}

cycle(1000)
console.log(score())
