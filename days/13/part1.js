let data = require('../../get_data')(13);

const patterns = data.split('\n\n').map(pattern => {
    const rows = pattern.split('\n');
    const columns = [...rows[0]].map((_, i) => rows.map(e => e.charAt(i)).join(''));

    return {
        rows, columns
    }
});

const isReflected = (source, index) => {
    let offset = 0;
    while(source[index - 1 - offset] === source[index + offset]){
        offset++
    }

    return source[index - 1 - offset] === undefined || source[index + offset] === undefined;
}

const result = patterns.map(pattern => {
    for(let i = 1; i < pattern.columns.length; i++){
        if(isReflected(pattern.columns, i)){
            return i;
        }
    }

    for(let i = 1; i < pattern.rows.length; i++){
        if(isReflected(pattern.rows, i)){
            return i * 100;
        }
    }
}).reduce((a, b) => a + b)

console.log(result);