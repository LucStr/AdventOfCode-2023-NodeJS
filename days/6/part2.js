let data = require('../../get_data')(6);

const [ timeString, distanceString ] = data.split('\n');

const time = Number(timeString.split(': ')[1].match(/\d+/g).join(''));
const distance = Number(distanceString.split(':')[1].match(/\d+/g).join(''));

let i;
for(i = 0; i < time; i++){
    if(i * (time - i) > distance){
        break;
    }
}

const result =  time - 2 * (i - 1) - 1;

console.log(result);