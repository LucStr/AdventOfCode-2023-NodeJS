let data = require('../../get_data')(13);

const isReflected = (source, index) => {
    let offset = 0;
    while(source[index - 1 - offset] === source[index + offset]){
        offset++
    }

    return source[index - 1 - offset] === undefined || source[index + offset] === undefined;
}

const getScore = (pattern, scoreToBeIgnored) => {
    for(let i = 1; i < pattern.rows.length; i++){
        if(isReflected(pattern.rows, i)){
            if(i * 100 !== scoreToBeIgnored){
                return i * 100
            }
        }
    }

    for(let i = 1; i < pattern.columns.length; i++){
        if(isReflected(pattern.columns, i)){
            if(i !== scoreToBeIgnored){
                return i
            }
        }
    }
}

const convert = pattern => {
    const rows = pattern.split('\n');
    const columns = [...rows[0]].map((_, i) => rows.map(e => e.charAt(i)).join(''));

    return {
        rows, columns
    }
}

const result = data.split('\n\n').map(map => {
    const array = [...map];

    const originalScore = getScore(convert(map));
    const combinations = [];
    for(let i = 0; i < array.length; i++){
        const char = array[i];
        if(char === '\n'){
            continue;
        }
        const reverse = char === '.' ? '#' : '.';

        const patternString = [...array.slice(0, i), reverse, ...array.slice(i + 1, array.length)].join('');
        const pattern = convert(patternString);
        combinations.push(getScore(pattern, originalScore))
    }
    return combinations.find(e => e);
}).reduce((a, b) => a + b);

console.log(result)