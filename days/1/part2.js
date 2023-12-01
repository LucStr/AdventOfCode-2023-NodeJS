let data = require('../../get_data')(1);

const mappings = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

var result = data
    .split('\n').map(line => {
        while(true) {
            let detects = Object.keys(mappings).map(e => {
                return {
                    digit: mappings[e],
                    index: line.indexOf(e),
                    value: e,
                }
            }).sort((a, b) => a.index - b.index).filter(e => e.index != -1);
            if(!detects.length){
                break;
            }
            line = line.substring(0, detects[0].index) + detects[0].digit + line.substring(detects[0].index + 1, line.length);
        }

        const match = line.match(/\d/g)
        const number = Number(match[0] + match[match.length - 1]);
        console.log(line + ' ' + number);
        return number;
    }).reduce((a, b) => a + b)

console.log(result);