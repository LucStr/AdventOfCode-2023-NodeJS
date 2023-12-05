let data = require('../../get_data')(5);


const inputs = data.split('\n\n');
const seeds = inputs.shift().split(': ')[1].split(' ').map(Number);
const maps = inputs.map(input => {
    const [description, ...instructionTexts] = input.split('\n');
    const [source, _, destination] = description.split(' ')[0].split('-');
    const instructions = instructionTexts.map(instruction => {
        const [drs, srs, length] = instruction.split(' ').map(Number);

        return {
            drs, srs, 
            sre: srs + length,
            dre: drs + length,
            delta: drs - srs,
        }
    }).sort((a, b) => a.srs - b.srs)

    return {
        source, destination, instructions
    }
});

const pairs = [];
while(seeds.length){
    const [start, length] = seeds.splice(0, 2);
    pairs.push({
        start, 
        end: start + length
    });
}
const result = pairs.map((seedRange, i) => {
    let current = 'seed';
    let values = [seedRange];
    let map;

    while(map = maps.find(e => e.source == current)) {
        var newValues = [];
        valueLoop: while(values.length > 0){
            const value = values.shift();
            for(let instruction of map.instructions){
                if(value.end < instruction.srs || value.start > instruction.sre){
                    continue;
                }

                var start = Math.max(value.start, instruction.srs);
                var end = Math.min(value.end, instruction.sre);

                newValues.push({
                   start: start + instruction.delta,
                   end: end + instruction.delta
                });

                if(start == value.start && end == value.end){
                    continue valueLoop;
                }

                if(start > value.start){
                    newValues.push({
                        start: value.start,
                        end: start
                    });
                }

                if(value.end > end){
                    value.start = end;
                }
            }
            
            newValues.push(value)
        }        

        values = newValues.sort((a, b) => a.start - b.start);
        current = map.destination;
    }

    return values.sort((a, b) => a.start - b.start)[0].start;
}).sort((a, b) => a - b)[0]

console.log(result)