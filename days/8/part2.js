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

const startingNodes = forks.filter(e => e.fork[2] == 'A');

const results = startingNodes.map(start => {
    let result = 0;
    let current = start;

    while(current.fork[2] != 'Z'){
        const ins = instructions[result % instructions.length];

        current = ins === 'L' ? current.left : current.right;
        result++;
    }

    return result;
})

const result = results.reduce((a, b) => {
    const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
    const lcm = (a, b) =>  a / gcd (a, b) * b

    return lcm(a, b)
})


console.log(result)
