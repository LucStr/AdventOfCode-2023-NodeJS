let data = require('../../get_data')(24);

const storms = data.split('\n').map(line => {
    const [position, velocity] = line.split(' @ ').map(e => e.split(', ').map(Number));
    
    return {
        position: position, velocity: velocity,
    }
});

const everythingCollides = (xOffset, yOffset) => {
    let collider = undefined;

    for(let i = 0; i < storms.length; i++){
        for(let j = i + 1; j < storms.length; j++){
            const a = storms[i];
            const b = storms[j];


            const avx = a.velocity[0] + xOffset;
            const avy = a.velocity[1] + yOffset;
            const apx = a.position[0];
            const apy = a.position[1];
            const bvx = b.velocity[0] + xOffset;
            const bvy = b.velocity[1] + yOffset;
            const bpx = b.position[0];
            const bpy = b.position[1];


            const m1 = avy / avx;
            const c1 = apy - m1 * apx;
            const m2 = bvy / bvx;
            const c2 = bpy - m2 * bpx;
        
            const x = (c2 - c1) / (m1 - m2);
            const y = m1 * x + c1;

            const tA = (x - apx) / avx;
            const tB = (x - bpx) / bvx;

            // collision happened in the past
            if(tA < 0 || tB < 0){
                return false;
            }

            if(!collider){
                collider = {
                    x: xOffset, y: yOffset, a, b, tA, tB
                }
            }
        }
    }

    return collider;
}

const options = [];
for(let x = -1000; x < 1000; x++){
    for(let y = -1000; y < 1000; y++){
        let collider = everythingCollides(x, y);
        if(collider){
            options.push(collider);
        }
    }   
}

for(let option of options){
    const {a, b, tA, tB, x, y} = option;
    const z = (b.position[2] - a.position[2] - tA * a.velocity[2] + tB * b.velocity[2]) / (tA - tB);

    const vectors = [x, y, z];

    const start = vectors.map((v, i) => {
        const crossing = a.position[i] + tA * (a.velocity[i] + v);

        return crossing;
    });

    const result = start.reduce((a, b) => a + b);
    console.log(result);
}
