let data = require('../../get_data')(14);

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
});

for(let stone of stones){
    let tile = stone.tile;
    while(tile.north && !tile.north.occupied){
        tile = tile.north
    }
    stone.tile.occupied = false;
    tile.occupied = true
    stone.tile = tile;
}

const result = stones.map(e => maxY - e.tile.y + 1).reduce((a, b) => a + b)
console.log(result)