let data = require('../../get_data')(15);

const hashes = data.split(',').map(e => {
    let current = 0;

    for(let i = 0; i < e.length; i++){
        const code = e.charCodeAt(i);
        current += code;
        current *= 17;
        current %= 256;
    }

    return current;
})

const result = hashes.reduce((a, b) => a + b);

console.log(result);