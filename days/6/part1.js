let data = require('../../get_data')(6);

const [ timeString, distanceString ] = data.split('\n');

const times = timeString.split(': ')[1].match(/\d+/g).map(Number);
const distances = distanceString.split(':')[1].match(/\d+/g).map(Number);

const races = times.reduce((a, b, i) => {
    a.push({
        time: b,
        distance: distances[i]
    });

    return a;
}, []);

const result = races.map(r => {
    let i;
    for(i = 0; i < r.time; i++){
        if(i * (r.time - i) > r.distance){
            break;
        }
    }

    return r.time - 2 * (i - 1) - 1;
}).reduce((a, b) => a * b, 1);


console.log(result);