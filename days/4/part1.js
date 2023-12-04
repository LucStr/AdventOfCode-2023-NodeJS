let data = require('../../get_data')(4);

const cards = data.split('\n').map(line => {
    const [info, numbers] = line.split(':');

    const [winners, owned] = numbers.split('|').map(e => e.match(/\d+/g).map(Number));

    const matches = owned.filter(e => winners.includes(e)).length;

    return {
        cardNumber: Number(info.match(/\d+/)[0]),
        winners, owned,
        points: matches ? Math.pow(2, matches - 1) : 0,
    }
})

const result = cards.reduce((a, b) => a + b.points, 0);
console.log(result);