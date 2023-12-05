let data = require('../../get_data')(5);

const inputs = data.split('\n\n');
const seeds = inputs.shift().split(': ')[1].split(' ').map(Number);
const maps = inputs.map(input => {
    const [description, ...instructionTexts] = input.split('\n');
    const [source, _, destination] = description.split(' ')[0].split('-');
    const instructions = instructionTexts.map(instruction => {
        const [drs, srs, length] = instruction.split(' ').map(Number);

        return {
            drs, srs, length
        }
    })

    return {
        source, destination, instructions
    }
});

const result = seeds.map((seed, i) => {
    let current = 'seed';
    let value = seed;
    let map;

    while(map = maps.find(e => e.source == current)) {
        for(let i = 0; i < map.instructions.length; i++){
            const instruction = map.instructions[i];

            if(instruction.srs <= value && instruction.srs + instruction.length >= value){
                value += instruction.drs - instruction.srs;
                break;
            }
        }

        current = map.destination;
    }

    return value;
}).sort((a, b) => a - b)[0]

console.log(result);