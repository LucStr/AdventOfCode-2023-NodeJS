let data = require('../../get_data')(24);

const TEST_START = 200000000000000;
const TEST_END = 400000000000000;

const storms = data.split('\n').map(line => {
    const [position, velocity] = line.split(' @ ').map(e => e.split(', ').map(Number));
    
    return {
        position: position.slice(0, 2), velocity: velocity.slice(0, 2),
    }
});

const collisions = [];

for(let i = 0; i < storms.length; i++){
    for(let j = i + 1; j < storms.length; j++){
        const a = storms[i];
        const b = storms[j];

        const avx = a.velocity[0];
        const avy = a.velocity[1];
        const apx = a.position[0];
        const apy = a.position[1];
        const bvx = b.velocity[0];
        const bvy = b.velocity[1];
        const bpx = b.position[0];
        const bpy = b.position[1];


        const m1 = avy / avx;
        const c1 = apy - m1 * apx;
        const m2 = bvy / bvx;
        const c2 = bpy - m2 * bpx;
    
        // lines are parallel
        if (m1 === m2) continue;
    
        const x = (c2 - c1) / (m1 - m2);
        const y = m1 * x + c1;

        const tA = (x - apx) / avx;
        const tB = (x - bpx) / bvx;

        // collision happened in the past
        if(tA < 0 || tB < 0){
            continue;
        }

        // collision outside of test area.
        if(x < TEST_START || y < TEST_START || x > TEST_END || y > TEST_END){
            continue;
        }
      
        collisions.push({
            point: {x, y},
            a, b
        });
    }
}

var result = collisions.length;

console.log(result);