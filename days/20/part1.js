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

const iterate = (state, log) => {
    const queue = [{in: instructions.find(e => e.type === 'broadcaster'), pulse: 0, sender: {name: 'button'}}]
    let pulses = [1, 0];

    while(queue.length){
        const current = queue.shift();
    
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
                pulses[current.pulse] += current.in.outputs.length;
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

                pulses[newState] += current.in.outputs.length;
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
                pulses[newPulse] += current.in.outputs.length;
                break;
        }
    }

    return pulses;
}


const state = initState();
let lowCount = 0;
let highCount = 0;

for(let i = 0; i < 1000; i++){
    const [low, high] = iterate(state, false);
    lowCount += low;
    highCount += high;
}

const result = lowCount * highCount;
console.log(result);