let data = require('../../get_data')(4);

const cards = data.split('\n').map(line => {
    const [info, numbers] = line.split(':');

    const [winners, owned] = numbers.split('|').map(e => e.match(/\d+/g).map(Number));

    const matches = owned.filter(e => winners.includes(e)).length;

    return {
        cardNumber: Number(info.match(/\d+/)[0]),
        winners, owned,
        matches,
        worth: 1,
    }
});

for(let i = cards.length - 1; i >= 0; i--){
    cards[i].worth += cards.slice(i + 1, i + cards[i].matches + 1).reduce((a, b) => a + b.worth, 0); 
}

const result = cards.reduce((a, b) => a + b.worth, 0);

console.log(result);