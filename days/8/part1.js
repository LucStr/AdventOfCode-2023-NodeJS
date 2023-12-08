let data = require('../../get_data')(8);

const [instructions, map] = data.split('\n\n');

const forks = map.split('\n').map(e => {
    const [_, fork, left, right] = e.match(/([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/);
    
    return {
        fork, left, right
    }
});

forks.forEach(e => {
    e.left = forks.find(f => f.fork == e.left);
    e.right = forks.find(f => f.fork == e.right);
})

let result = 0;
let current = forks.find(e => e.fork == 'AAA');

while(current.fork != 'ZZZ'){
    const ins = instructions[result % instructions.length];

    current = ins === 'L' ? current.left : current.right;
    result++;
}

console.log(result);