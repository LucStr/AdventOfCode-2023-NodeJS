let data = require('../../get_data')(9);

const sequences = data.split('\n').map(line =>{
    const numbers = line.split(' ').map(Number);
    let tail = [numbers];

    while(!tail[tail.length - 1].every(e => e == 0)){
        const numbers = tail[tail.length - 1];
        const differences = [];
        for(let i = 0; i < numbers.length - 1; i++){
            differences.push(numbers[i + 1] - numbers[i]);
        }

        tail.push(differences);
    };

    let current = 0;
    for(let i = tail.length - 2; i >= 0; i--){
        current = tail[i][0] - current;
    }

    return current;
})

const result = sequences.reduce((a, b) => a + b)

console.log(result);