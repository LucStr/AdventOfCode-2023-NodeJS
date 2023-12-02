let data = require('../../get_data')(1);

var result = data
    .split('\n').map(e => e.match(/\d/g)).map(e => e[0] + e[e.length - 1]).map(Number).reduce((a, b) => a + b)


console.log(result);