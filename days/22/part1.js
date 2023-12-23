let data = require('../../get_data')(22);

const bricks = data.split('\n').map(line => {
    const [first, second] = line.split('~');
    const [x1, y1, z1] = first.split(',').map(Number);
    const [x2, y2, z2] = second.split(',').map(Number);

    return {
        x1,x2,y1,y2,z1,z2, supports: [], isSupportedBy: []
    }
}).sort((a, b) => a.z1 - b.z1);

const collides = (brick1, brick2) => !(
    brick1.x1 > brick2.x2 ||
    brick1.x2 < brick2.x1 ||
    brick1.y1 > brick2.y2 ||
    brick1.y2 < brick2.y1
)

let settled = [];
for(let brick of bricks){
    const collisions = [];

    for(let other of settled){
        if(collisions.length && collisions[0].z2 > other.z2){
            //console.log(`exiting loop for ${bricks.indexOf(brick)} as ${bricks.indexOf(other)} s z index is too big ${collisions[0].z2} vs ${other.z2}`)            
            //console.log(settled.map(e => bricks.indexOf(e)))
            break;
        }

        if(!collides(brick, other)){
            continue;
        }

        //console.log(`${bricks.indexOf(brick)} collided with ${bricks.indexOf(other)}`)

        collisions.push(other);
        other.supports.push(brick);
    }

    if(collisions.length){
        brick.z2 = collisions[0].z2 + 1 + brick.z2 - brick.z1;
        brick.z1 = collisions[0].z2 + 1;

        //console.log('new zindex ', brick.z1, brick.z2)
    } else {
        brick.z2 = brick.z2 - brick.z1;
        brick.z1 = 0;
    }

    brick.isSupportedBy = collisions;
    settled.push(brick)
    settled = settled.sort((a, b) => b.z2 - a.z2);
}

const result = bricks.filter(e => !e.supports.length || e.supports.every(b => b.isSupportedBy.length > 1)).length;

console.log(result);
