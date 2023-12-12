let data = require('../../get_data')(12);

const result = data.split('\n').map(e => {
    const [springs, criteria] = e.split(' ');

    return {
        springs: [...new Array(5).fill(springs).join('?')],
        criteria: [...new Array(5).fill(criteria).join(',').split(',').map(Number)],
    }
}).map(parsed => {
    var cache = new Map();

    return combinations(parsed.springs, parsed.criteria);

    function combinations(springs, criteria){
        const key = `${springs.join('')}:${criteria.join(',')}`;
        if(cache.has(key)){
            return cache.get(key);
        }

        while(springs[0] === '.'){
            springs.shift();
        }

        if(criteria.length === 0){
            return springs.every(e => e !== '#') ? 1 : 0;
        }

        if(springs.length === 0){
            return 0;
        }

        if(springs[0] === '?'){
            var result = combinations(['.', ...springs.slice(1)], criteria) + combinations(['#', ...springs.slice(1)], criteria);
            cache.set(key, result);
            return result;
        }

        for(let i = 0; i < criteria[0]; i++){
            const next = springs.shift();
            if(next === '.' || next === undefined){
                return 0;
            }
        }

        if(springs[0] === '#'){
            return 0;
        }

        springs.shift();
        var result = combinations(springs, criteria.slice(1))
        cache.set(key, result);
        return result;
    }
}).reduce((a, b) => a + b);

console.log(result);