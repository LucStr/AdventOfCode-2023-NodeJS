let data = require('../../get_data')(11);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {char, x, y, weight: 1};
})).flat();

map.forEach(tile => {
    tile.neighbors = map.filter(f => Math.abs(f.x - tile.x) + Math.abs(f.y - tile.y) === 1);
});

const maxX = map.sort((a, b) => b.x - a.x)[0].x;
const maxY = map.sort((a, b) => b.y - a.y)[0].y;

for(let i = 0; i <= maxX; i++){
    const tiles = map.filter(e => e.x === i);
    if(tiles.every(e => e.char === '.')){
        tiles.forEach(t => {
            t.weight *= 1000000;
        });
    }
}


for(let i = 0; i <= maxY; i++){
    const tiles = map.filter(e => e.y === i);
    if(tiles.every(e => e.char === '.')){
        tiles.forEach(t => {
            t.weight *= 1000000;
        });
    }
}

const result = map.filter(e => e.char === '#').map((galaxy, i) =>{
    let result = 0;
    const visited = [galaxy];
    let queue = [{
        tile: galaxy,
        distance: 0
    }];

    console.log(galaxy, i)

    while(queue.length){
        const current = queue.shift();
        const neighbors = current.tile.neighbors.filter(e => visited.indexOf(e) === -1);

        for(let n of neighbors){
            if(n.char == '#'){
                result += current.distance + n.weight;
            }
            visited.push(n);
            queue.push({
                tile: n,
                distance: current.distance + n.weight
            });
        }

        queue = queue.sort((a, b) => a.distance - b.distance);
    }

    return result;
}).reduce((a, b) => a + b) / 2;

console.log(result);