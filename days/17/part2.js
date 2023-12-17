let data = require('../../get_data')(17);

const map = data.split('\n').map((line, y) => line.split('').map((char, x) => {
    return {
        loss: Number(char),
        x, y, neighbors: [], shortest: undefined
    }
})).flat();

map.forEach(e => {
    e.neighbors = map.filter(f => Math.abs(f.x - e.x) + Math.abs(f.y - e.y) === 1);
});

const visited = new Set();
let queue = [{tile: map[0], loss: 0, x: 0, y: 0, previous: {x: -1, y: -1}}];

while(queue.length){
    const current = queue.shift();
    const key = `${current.tile.x},${current.tile.y}:${current.x},${current.y}`;
    if(visited.has(key) || current.x > 10 || current.y > 10){
        continue;
    }

    visited.add(key);
    if(current.tile.shortest === undefined && (current.x >= 4 || current.y >= 4)){
        current.tile.shortest = current.loss;
    }

    if(current.x > 0 && current.x < 4){
        const x = current.tile.x - current.previous.x;
        const neighbor = current.tile.neighbors.find(e => e.x === current.tile.x + x);
        if(neighbor === undefined){
            continue;
        }
        queue.push({
            tile: neighbor, loss: current.loss + neighbor.loss, x: current.x + 1, y: 0, previous: current.tile,
        });
    } else if(current.y > 0 && current.y < 4){
        const y = current.tile.y - current.previous.y;
        const neighbor = current.tile.neighbors.find(e => e.y === current.tile.y + y);
        if(neighbor === undefined){
            continue;
        }
        queue.push({
            tile: neighbor, loss: current.loss + neighbor.loss, x: 0, y: current.y + 1, previous: current.tile,
        });
    } else {
        for(let neighbor of current.tile.neighbors.filter(e => e !== current.previous)){
            const deltaX = Math.abs(neighbor.x - current.tile.x);
            const deltaY = Math.abs(neighbor.y - current.tile.y);
    
            const x = deltaX === 0 ? 0 : current.x + deltaX;
            const y = deltaY === 0 ? 0 : current.y + deltaY;
    
            queue.push({
                tile: neighbor, loss: current.loss + neighbor.loss, x, y, previous: current.tile,
            });
        }
    }
 

    queue = queue.sort((a, b) => a.loss - b.loss);
}

const result = map[map.length - 1].shortest

console.log(result);