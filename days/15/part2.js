let data = require('../../get_data')(15);

const hash = (input) => {
    let current = 0;

    for(let i = 0; i < input.length; i++){
        const code = input.charCodeAt(i);
        current += code;
        current *= 17;
        current %= 256;
    }

    return current;
}

const boxes = new Array(256).fill(0).map(() => []);

const instructions = data.split(',').map(e => {
    const [_, label, operation, focal] = e.match(/([a-z]+)(\=|\-)(\d*)/);

    return {
        box: hash(label),
        label, 
        operation, 
        focal: Number(focal)
    }
});

instructions.forEach(instruction => {
    const box = boxes[instruction.box];

    if(instruction.operation === '-'){
        const indexToRemove = box.findIndex(e => e.label === instruction.label);

        if(indexToRemove > -1){
            box.splice(indexToRemove, 1);
        }
    } else {
        let current = box.find(e => e.label === instruction.label);

        if(current === undefined){
            current = {
                label: instruction.label
            };

            box.push(current);
        }

        current.focal = instruction.focal;
    }
})

const result = boxes.map((box, i) => box.reduce((a, b, ci) => a + (i + 1) * (ci + 1) * b.focal, 0)).reduce((a, b) => a + b);

console.log(result);