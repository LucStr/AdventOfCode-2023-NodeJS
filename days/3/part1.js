let data = require('../../get_data')(3);

const map = data.split('\n').map((line, y) => {
    return [...line].map((char, x) => {
        return {
            symbol: char,
            x, y,
            isImportant: char != '.',
            isNumber: !isNaN(char),
        }
    })
}).flat().filter(x => x.isImportant);

map.forEach(dot => {
    dot.neighbors = new Set(map.filter(p =>p != dot && Math.abs(p.x - dot.x) <= 1 && Math.abs(p.y - dot.y) <= 1));
});

for(let i = 0; i < map.length - 1; i++){
    const cur = map[i];
    const next = map[i + 1];

    if(!cur.isNumber || !next.isNumber || cur.y != next.y || cur.x + 1 != next.x){
        continue;
    }

    cur.neighbors.forEach(n => {
        if(n == next){
            return;
        }
        next.neighbors.add(n);
        n.neighbors.delete(cur);
        n.neighbors.add(next);
    });

    next.symbol = cur.symbol + next.symbol;
    next.neighbors.delete(cur);
    map[i] = null;
}

const result = map.filter(e => e && e.isNumber && [...e.neighbors].find(f => !f.isNumber)).reduce((a, b) => a + Number(b.symbol) , 0);

console.log(result);

