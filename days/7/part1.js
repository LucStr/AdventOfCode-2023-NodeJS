let data = require('../../get_data')(7);

const HIGH_CARD = 1;
const ONE_PAIR = 2;
const TWO_PAIR = 3;
const THREE_KIND = 4;
const FULL_HOUSE = 5;
const FOUR_KIND = 6;
const FIVE_KIND = 7;

const VALUE_MAP = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 11,
    'T': 10,
    '9': 9, 
    '8': 8, 
    '7': 7, 
    '6': 6, 
    '5': 5, 
    '4': 4, 
    '3': 3, 
    '2': 2
}

const hands = data.split('\n').map(e => {
    const [cardString, bidString] = e.split(' ');
    const cards = cardString.split('').reduce((a, b) => {
        const card = a.find(e => e.type == b);
        if(card){
            card.amount++;
        } else {
            a.push({type: b, amount: 1, value: VALUE_MAP[b]})
        }

        return a;
    }, []);

    let rank;
    switch(cards.length){
        case 5:
            rank = HIGH_CARD;
            break;
        case 4:
            rank = ONE_PAIR;
            break;
        case 3:
            rank = cards.sort((a, b) => b.amount - a.amount)[0].amount == 2 ? TWO_PAIR : THREE_KIND;
            break;
        case 2:
            rank = cards.sort((a, b) => b.amount - a.amount)[0].amount == 3 ? FULL_HOUSE : FOUR_KIND 
            break;
        case 1:
            rank = FIVE_KIND;
            break;
    }

    return {
        cardString,
        cards,
        rank,
        bid: Number(bidString)
    }
});

const result = hands.sort((a, b) => {
    if(a.rank - b.rank == 0){
        for(let i = 0; i < a.cardString.length; i++){
            const diff = VALUE_MAP[a.cardString[i]] - VALUE_MAP[b.cardString[i]];
            if(diff != 0){
                return diff
            }
        }
    }

    return a.rank - b.rank
}).map((card, i) => {
    return card.bid * (i + 1);
}).reduce((a, b) => a + b);

console.log(result);