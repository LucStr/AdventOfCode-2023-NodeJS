let data = require('../../get_data')(20);

const TYPES = {
    '%': 'flipflop',
    '&': 'conjunction',
    'b': 'broadcaster'
};

const instructions = data.split('\n').map(line => {
    const [input, outputs] = line.split(' -> ');


    return {
        type: TYPES[input.charAt(0)],
        name: input.slice(1),
        outputs: outputs.split(', '),
        inputs: []
    }
});

instructions.forEach(instruction => {
    for(let i = 0; i < instruction.outputs.length; i++){
        const node = instructions.find(e => e.name === instruction.outputs[i]);
        if(node === undefined){
            continue;
        }

        instruction.outputs[i] = node;
        node.inputs.push(instruction);
    }
})


const initState = () => {
    const state = new Map();
    instructions.forEach(e => {
        switch(e.type){
            case 'flipflop':
                state.set(e.name, 0)
                break;
            case 'conjunction':
                state.set(e.name, e.inputs.reduce((a, b) => {
                    a[b.name] = 0;
                    return a;
                }, {}))
                break;
        }
    })

    return state;
}

const iterate = (state, log, inputsTolookout) => {
    const queue = [{in: instructions.find(e => e.type === 'broadcaster'), pulse: 0, sender: {name: 'button'}}]
    const response = [];

    while(queue.length){
        const current = queue.shift();
    
        if(current.pulse === 0 && inputsTolookout.indexOf(current.in.name) !== -1){
            response.push(current.in.name)
        }
        log && console.log(`${current.sender.name} -${current.pulse === 0 ? 'low': 'high'}-> ${current.in.name || current.in}`);
    
        switch(current.in.type){
            case 'broadcaster':
                queue.push(...current.in.outputs.map(o => {
                    return {
                        in: o,
                        pulse: current.pulse,
                        sender: current.in
                    }
                }));
                break;
            case 'flipflop':
                if(current.pulse === 1){
                    continue;
                }
    
                const newState = state.get(current.in.name) === 0 ? 1 : 0;
                state.set(current.in.name, newState);
    
                queue.push(...current.in.outputs.map(o => {
                    return {
                        in: o,
                        pulse: newState,
                        sender: current.in
                    }
                }));
                break;
    
            case 'conjunction':
                const memory = state.get(current.in.name);
                memory[current.sender.name] = current.pulse;
                const newPulse = Object.values(memory).every(e => e === 1) ? 0 : 1;
                queue.push(...current.in.outputs.map(o => {
                    return {
                        in: o,
                        pulse: newPulse,
                        sender: current.in
                    }
                }));
                break;
            
            default:
                //console.log(`Setting ${current.in} to ${current.pulse}`)
                state.set(current.in, current.pulse);
        }
    }

    return response;
}

const state = initState();
let count = 0;

const base = {};

const inputsTolookout = instructions.find(e => e.outputs.indexOf('rx') !== -1).inputs.map(e => e.name);

for(let i of inputsTolookout){
    base[i] = 0;
}

console.log(inputsTolookout);

do{
    count++
    const found = iterate(state, false, inputsTolookout);

    for(let i of found){
        base[i] = count;
    }

    if(count % 1000000 === 0){
        console.log(count)
    }

} while(!Object.values(base).every(e => e > 0))

const gcd = (a, b) => b == 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b

const result = Object.values(base).reduce(lcm)
console.log(result);